# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (localhost:5173)
npm run build     # tsc -b (typecheck via project references) && vite build
npm run lint       # oxlint (see .oxlintrc.json — react/typescript/oxc plugins)
npm run preview   # serve the production build locally
```

There is no test suite configured in this repo. Verify changes by running the dev server and exercising the flow in a browser (or headlessly with Playwright, which is a devDependency but has no committed test files/config — use it ad hoc if you need to script a UI check).

To exercise trip states (day rollover, overshoot, trip-complete) without waiting on real dates, use the hidden route `/__dev` (`src/features/dev/DevPanel.tsx`): seed a demo trip, advance the active trip by a day, or clear all data. It reads/writes the same `useTripData` context as the real UI.

## Architecture

**Runway** is a mobile-first (390×844 target) trip budget-*pacing* app — not a simple balance tracker. The core domain idea: budget is prorated across the trip's days and spending is cumulative, so "today's" allowance rolls forward/backward with how you've spent on prior days. This is implemented in `src/data/calculations.ts`:

- `dailyAllowanceBase = effectiveBudget / durationDays`
- `dollarsLeftToday = dailyAllowanceBase * currentDay - spentThroughDay(currentDay)` — cumulative, **not** a fresh-per-day balance
- `paceStatus` buckets the above into `"onPace" | "tight" | "over"` for color/semantics

Any UI that shows "today's" numbers must recompute from these functions rather than caching a value — see the note below about `HomeActiveDay`'s local dial state.

### State: single context provider, localStorage-backed

`src/data/useTripData.tsx` (`TripDataProvider`, wired in `App.tsx`) is the only source of truth. It holds `AppState` (`src/data/types.ts`): `trips[]`, `activeTripId`, `darkMode`, `seenTutorial`, `acknowledgedTripId`, etc. Persistence is a versioned envelope in `src/data/storage.ts` (`localStorage["runway.state"]`) — `loadState()` merges saved data over `emptyState()`, so **new `AppState` fields must be added to `emptyState()`** (and to any other literal `AppState` object, e.g. `devClearAll`) or `tsc` will fail.

`derivedScreen` (`ScreenState = "empty" | "active" | "complete"`) drives `HomeRouter`'s screen selection and is computed from `resolveScreenState(activeTrip)`, then adjusted: if the active trip is complete **and** its id matches `state.acknowledgedTripId`, it's downgraded to `"empty"` so Home falls back to the returning-user homepage (`HomeReturning`) instead of re-showing the completion celebration (`HomeTripComplete`) forever. `acknowledgeTripComplete(tripId)` is called explicitly from each exit action on `HomeTripComplete` (not on unmount — StrictMode's mount/unmount/mount dev cycle will double-fire cleanup-based side effects, so lifecycle-triggered acknowledgment is unreliable here).

`HomeActiveDay` keeps the dial's displayed fraction/amount in **local `useState`**, updated only by specific triggers (expense logged, real-date rollover, or the day-change watcher keyed on `currentDayNumber`). If you add a new way for the active day/trip to change while `HomeActiveDay` stays mounted, make sure it also re-syncs `displayFraction`/`displayLeft` — otherwise the dial shows stale numbers.

### Screens, routing, motion

Screens live under `src/features/<domain>/` (`home`, `expense`, `trend`, `summary`, `trip-setup`, `overshoot`, `search`, `account`, `onboarding`, `dev`). `src/router.tsx` wraps every route in a `PageTransition` (`framer-motion` opacity fade) inside `AnimatePresence mode="wait"`. `HomeRouter` picks between `HomeEmpty` / `HomeReturning` / `HomeActiveDay` / `HomeTripComplete` based on `derivedScreen` + whether any trips exist — it has no UI of its own.

Sheets/drawers (`DayManageSheet`, `HamburgerMenu`, the category-picker bottom sheet in `AddExpense`/`EditExpense`) share one convention: `AnimatePresence` + backdrop fade + panel slide (`y`/`x`: `"100%"|"-100%"` → `0`) with `transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}`. Reuse that easing/duration for new sheets rather than inventing a new one.

**Known framer-motion + Tailwind pitfall**: don't combine a Tailwind transform utility (e.g. `-translate-x-1/2`) with `whileTap`/`animate` on the *same* element — framer-motion writes its own inline `transform` and silently clobbers the Tailwind one the first time the gesture fires (this broke the bottom-nav FAB's centering; fixed by moving the translate onto a plain non-motion wrapper `div`). Always put static Tailwind transforms on a wrapper and animated transforms on the inner motion element.

### Theming: one set of tokens, three places they're wired

Colors/shadows/radii are CSS custom properties defined once in `src/styles/globals.css` (`:root` for light, `:root.dark` for dark — `darkMode` toggles the `.dark` class on `<html>`), mirrored as JS constants in `src/theme/tokens.ts` (for places that need the hex value directly, e.g. inline SVG `stroke`), and exposed to Tailwind as color aliases in `tailwind.config.js` (`bg-canvas`, `text-ink`, `bg-action-primary`, `text-pace-berry`, `rounded-pill`, `shadow-soft`, …). **Changing the palette means editing all three files in lockstep.** `src/features/expense/Celebration.tsx` is the one place that references CSS vars as raw strings (`"var(--pace-teal)"`) for particle colors instead of Tailwind classes — remember to update it too when retheming.

Semantic pace colors (`--pace-teal` green / `--pace-gold` amber / `--pace-berry` red, via `paceColorVar()`/`paceStatus()`) are intentionally a separate palette from `--action-primary` (the coral brand/CTA color) — don't conflate "this is the primary action color" with "this means on-pace."

### The pace dial

`src/components/dial/LatitudeDial.tsx` + `dialMath.ts` render the circular "$X left today" ring as an SVG arc spanning `DIAL_ARC_SPAN_DEG` (280°, not a full circle — there's a deliberate gap). It's a small state machine over a `mode` prop (`"idle" | "sunrise" | "dropping" | "complete"`): `sunrise` plays a brighten-on-rollover overlay, `dropping` animates a "liquid bead" from/to the arc (used for expense-logged and undo transitions), `complete` cross-fades the center content into a seal/checkmark badge (`SealCheckIllustration`, `filled={false}` since it's already on a colored circle — see that component's `filled` prop for why). Each mode change is driven by the parent (`HomeActiveDay`) via callbacks (`onDropComplete`, `onSunriseComplete`, `onArcSettled`) that chain into the next state; read `HomeActiveDay`'s handlers together with this component if you're touching dial behavior.

### Categories & icons

`src/components/ui/IconIndex.ts` centralizes all `lucide-react` icons used in the app plus `CATEGORY_ICON_MAP` (category-id → icon) and `inferCategoryIcon(name)` (keyword match on a new category's name, e.g. "flight" → the flights icon) used whenever a user creates a category on the fly. `src/components/ui/CategoryPickerGrid.tsx` is the shared category-selection grid, used both as a full page (`ChooseCategory`) and inside a bottom sheet (`AddExpense`, `EditExpense`) — keep it decoupled from routing (it takes `onPick`/`onCreate` callbacks, no navigation) so both call sites keep working.

### Desktop chrome

`src/layout/PhoneFrame.tsx` renders a decorative iPhone chassis around the app when the viewport is ≥768px (`src/hooks/useViewportFrame.ts`); below that it's full-bleed, real-mobile-viewport. It also sets the `--app-height` CSS var that screens size against instead of `100vh`/`100dvh` directly.
