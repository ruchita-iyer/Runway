# ✦ Runway Design System

**Reference · v1**

The visual language behind Runway, a mobile-first trip-budget-*pacing* app. Warm canvas neutrals, one coral action color, and a dedicated teal/gold/berry pace ramp that stays deliberately separate from the brand color — so "on pace" never gets confused with "the button you tap."

**Jump to:** [01 Color](#01--color) · [02 Typography](#02--typography) · [03 Spacing & radius](#03--spacing--radius) · [04 Elevation](#04--elevation) · [05 Components](#05--components)

---

## 01 · Color

Four families, each with a distinct job. Neutrals build surfaces, coral drives action, pace colors carry meaning, categories only ever label spending.

### Neutrals

| Swatch | Name | Token | Light | Dark | Use |
|---|---|---|---|---|---|
| ![canvas](https://placehold.co/64x36/fbf3ea/fbf3ea?text=%20) | Canvas | `--canvas` | `#FBF3EA` | `#1C1410` | App background |
| ![surface](https://placehold.co/64x36/ffffff/ffffff?text=%20) | Surface | `--surface` | `#FFFFFF` | `#2A2019` | Cards, sheets, tiles |
| ![surface-2](https://placehold.co/64x36/f6ede0/f6ede0?text=%20) | Surface 2 | `--surface-2` | `#F6EDE0` | `#241B15` | Recessed panels |
| ![ink](https://placehold.co/64x36/241c15/241c15?text=%20) | Ink | `--ink` | `#241C15` | `#F6EDE2` | Primary text |
| ![slate](https://placehold.co/64x36/8f8071/8f8071?text=%20) | Slate | `--slate` | `#8F8071` | `#B3A494` | Secondary text |
| ![hairline](https://placehold.co/64x36/ede1d3/ede1d3?text=%20) | Hairline | `--hairline` | `#EDE1D3` | `#3C2F24` | Borders, dividers |

### Brand & action

| Swatch | Name | Token | Light | Dark | Use |
|---|---|---|---|---|---|
| ![action-primary](https://placehold.co/64x36/f2653c/f2653c?text=%20) | Action primary | `--action-primary` | `#F2653C` | `#FF7A52` | CTAs, FAB, links, focus ring |
| ![accent-violet](https://placehold.co/64x36/c0673f/c0673f?text=%20) | Accent violet | `--accent-violet` | `#C0673F` | `#D68A63` | Secondary accent |

### Pace semantics — never the brand color

| Swatch | Name | Token | Light | Dark | Use |
|---|---|---|---|---|---|
| ![pace-teal](https://placehold.co/64x36/3fa35c/3fa35c?text=%20) | Teal · `onPace` | `--pace-teal` | `#3FA35C` | `#4FC773` | Spending on track |
| ![pace-gold](https://placehold.co/64x36/e0a337/e0a337?text=%20) | Gold · `tight` | `--pace-gold` | `#E0A337` | `#F0BC5C` | Close to the line |
| ![pace-berry](https://placehold.co/64x36/e0393b/e0393b?text=%20) | Berry · `over` | `--pace-berry` | `#E0393B` | `#FF5C5C` | Over budget |

> [!NOTE]
> **Rule:** pace color communicates budget status only. It is a separate palette from `--action-primary` — don't reach for coral to mean "on pace," and don't reach for teal to mean "primary action."

### Category palette

| Swatch | Name | Token | Hex |
|---|---|---|---|
| ![cat-1](https://placehold.co/64x36/f2a65a/f2a65a?text=%20) | Marigold | `--category-1` | `#F2A65A` |
| ![cat-2](https://placehold.co/64x36/e8734a/e8734a?text=%20) | Coral terracotta | `--category-2` | `#E8734A` |
| ![cat-3](https://placehold.co/64x36/c1533d/c1533d?text=%20) | Rust | `--category-3` | `#C1533D` |
| ![cat-4](https://placehold.co/64x36/d9a441/d9a441?text=%20) | Mustard | `--category-4` | `#D9A441` |
| ![cat-5](https://placehold.co/64x36/b98066/b98066?text=%20) | Clay rose | `--category-5` | `#B98066` |
| ![cat-6](https://placehold.co/64x36/8c7a6b/8c7a6b?text=%20) | Warm taupe | `--category-6` | `#8C7A6B` |

### Dial gradient & badge gradient

| Preview | Gradient | Stops |
|---|---|---|
| ![dial-start](https://placehold.co/40x36/e0393b/e0393b?text=%20)![dial-end](https://placehold.co/40x36/7c3aed/7c3aed?text=%20) | Pace dial fill | `--dial-start #E0393B` → `--dial-end #7C3AED` |
| ![badge-start](https://placehold.co/40x36/f2653c/f2653c?text=%20)![badge-end](https://placehold.co/40x36/e0a337/e0a337?text=%20) | Achievement badge | `--action-primary` → `--pace-gold` |

---

## 02 · Typography

Two families split by role: a geometric display face for headlines and numbers that need presence, a workhorse body face for everything you read in a hurry.

| Typeface | Sample | Role |
|---|---|---|
| **Outfit** — display | # Aa 12:40 | Page titles, stat values, dial center, hero numbers |
| **Satoshi** — body | Aa 12:40 | Default UI text, labels, buttons, inputs |

### Scale

| Size / weight | Face | Sample |
|---|---|---|
| 32 / 600 | display | # Welcome to Runway |
| 26 / 600 | display | ### $1,240 left |
| 20 / 700 | display | **Account** |
| 17 / 600 | display | **Edit budget** |
| 15 / 500 | body | Log an expense… |
| 14 / 500 | body | Bali getaway · Active trip |
| 13 / 400 | body | of $2,400 spent |
| 12 / 500 | caption | `9 Aug 2026` |
| 11 / 700 | eyebrow | `BADGES` |

> [!NOTE]
> **Numerals:** any digits that line up — spent/budget lines, dates, streak counts — use `.tabular` (`font-variant-numeric: tabular-nums`) so columns don't jitter as values change.

---

## 03 · Spacing & radius

### Radius scale

Four steps, each mapped to a Tailwind alias. Pills are reserved for anything tappable and round; `2xl` is the largest surface a card gets.

| Token | Value | Use |
|---|---|---|
| `--r-lg` | `12px` | Inputs, tiles |
| `--r-xl` | `20px` | Cards, dials |
| `--r-2xl` | `24px` | Section cards |
| `--r-pill` | `999px` | Buttons, chips, nav |

### Spacing rhythm

Layout runs on Tailwind's 4px scale. Screens sit on `px-5` horizontal margins; cards stack content in `px-4 py-3` rows; tight clusters (icon + label) use `gap-1.5` to `gap-2`.

```
8px   ▇
12px  ▇▇
16px  ▇▇▇
20px  ▇▇▇▇
24px  ▇▇▇▇▇
32px  ▇▇▇▇▇▇▇
40px  ▇▇▇▇▇▇▇▇▇
```

---

## 04 · Elevation

Just two shadows. `soft` lifts nearly everything off the canvas; `chassis` is reserved for the decorative desktop phone frame.

| Token | Value | Use |
|---|---|---|
| `--shadow-soft` | `0 12px 28px -10px rgba(66, 38, 20, 0.16)` | Cards, tiles, sheets, buttons |
| `--shadow-chassis` | `0 30px 60px -20px rgba(16, 24, 38, 0.45)` | Desktop phone chassis frame only |

---

## 05 · Components

### Buttons

One primary action per screen. Secondary is an outline, ghost drops the chrome entirely for tertiary exits.

![Save expense](https://img.shields.io/badge/Save_expense-F2653C?style=for-the-badge)
![Cancel](https://img.shields.io/badge/Cancel-FFFFFF?style=for-the-badge&labelColor=FFFFFF&color=EDE1D3)
![Skip for now](https://img.shields.io/badge/Skip_for_now-fbf3ea?style=for-the-badge&color=fbf3ea)

### Chips

Category filters and quick picks. Selected state swaps fill for the action color; dashed marks an "add new" affordance.

![Food & drink](https://img.shields.io/badge/Food_%26_drink-F2653C?style=for-the-badge)
![Transport](https://img.shields.io/badge/Transport-FFFFFF?style=for-the-badge&color=EDE1D3)
![Lodging](https://img.shields.io/badge/Lodging-FFFFFF?style=for-the-badge&color=EDE1D3)
![+ New category](https://img.shields.io/badge/%2B_New_category-fbf3ea?style=for-the-badge&color=fbf3ea)

### Stat tiles

Compact metric cards, optionally tinted toward a semantic color at 16% mix into the surface.

| Spent | On pace | Days left |
|---|---|---|
| **$860** | 🟢 **+$40** | 🔴 **3** |

### Streak chip

Always rendered, even at zero — it dims to neutral rather than disappearing, so its position on screen never shifts.

![streak on](https://img.shields.io/badge/🔥_5-3FA35C?style=for-the-badge&labelColor=3FA35C)
![streak off](https://img.shields.io/badge/🔥_0-EDE1D3?style=for-the-badge&labelColor=EDE1D3&color=EDE1D3)

### Section / row card

The Account screen's list pattern: an uppercase label, then hairline-divided rows.

**TRIPS**
| | |
|---|---|
| **Bali getaway** <br><sub>Active trip</sub> | 🟠 |
| **Lisbon, Oct** <br><sub>Upcoming · starts 12 Oct</sub> | |

### Achievement badges

A hexagon clip-path tile: gradient fill and full-color icon when unlocked, flat hairline fill with a lock glyph when not.

| Badge | Label | State |
|---|---|---|
| ⭐ | First log | ![Earned](https://img.shields.io/badge/Earned-3FA35C?style=flat-square) |
| 🔥 | 3-day streak | ![Earned](https://img.shields.io/badge/Earned-3FA35C?style=flat-square) |
| 🔒 | Multi-tripper | ![Locked](https://img.shields.io/badge/Locked-8F8071?style=flat-square) |
| 🔒 | Never overshot | ![Locked](https://img.shields.io/badge/Locked-8F8071?style=flat-square) |

### Toast

Achievement and milestone toasts share one shape — an icon chip plus a two-line message, auto-dismissing after ~3s, mounted above every route so it survives navigation.

> ⭐ **New badge unlocked!**
> First log

### Bottom nav

Four tabs with a raised center FAB for the primary "log expense" action, ringed in canvas so it visually floats off the bar.

| Home | Trend | ➕ | Search | Account |
|:---:|:---:|:---:|:---:|:---:|
| 🟠 ◐ | ◔ | **+** | ◒ | ◑ |

---

<sub>Tokens sourced from `src/styles/globals.css`, `src/theme/tokens.ts`, and `tailwind.config.js`. Changing the palette means editing all three in lockstep — plus `Celebration.tsx`, the one place pace colors are referenced as raw CSS-var strings instead of Tailwind classes. For a live, interactive version with a light/dark/auto toggle, open [`full-design-system-embed.html`](./full-design-system-embed.html).</sub>
