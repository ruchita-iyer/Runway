import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { BottomNav } from "../../layout/BottomNav";
import { LatitudeDial } from "../../components/dial/LatitudeDial";
import type { DialMode } from "../../components/dial/LatitudeDial";
import { StatTile } from "../../components/ui/StatTile";
import { PacePulseDot } from "../../components/ui/PacePulseDot";
import { StreakChip } from "../../components/ui/StreakChip";
import { MilestoneToast } from "../../components/ui/MilestoneToast";
import { SwipeableRow } from "../../components/ui/SwipeableRow";
import { UndoBar } from "../expense/UndoBar";
import { Celebration } from "../expense/Celebration";
import { DayManageSheet } from "./DayManageSheet";
import { DayOverspendNotice } from "./DayOverspendNotice";
import { HamburgerMenu } from "./HamburgerMenu";
import { Icon, ChevronDown, Menu, categoryIcon } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import {
  currentDayNumber,
  dailyAllowanceBase,
  daysLeft,
  dialFraction,
  dollarsLeftToday,
  effectiveBudget,
  isOvershoot,
  loggingStreak,
  milestoneForDay,
  paceStatus,
  spentOnDay,
  totalSpent,
} from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import { timeGreeting } from "../../lib/greeting";
import { categoryColor, categoryGradient, paceColorVar } from "../../theme/tokens";

export function HomeActiveDay() {
  const {
    activeTrip,
    dayJustRolledOver,
    acknowledgeDayRollover,
    lastLoggedExpenseId,
    undoLastExpense,
    clearLastLogged,
    deleteExpense,
  } = useTripData();
  const navigate = useNavigate();
  const location = useLocation();

  const [displayFraction, setDisplayFraction] = useState(() => (activeTrip ? dialFraction(activeTrip) : 0));
  const [displayLeft, setDisplayLeft] = useState(() => (activeTrip ? dollarsLeftToday(activeTrip) : 0));
  const [dialMode, setDialMode] = useState<DialMode>("idle");
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [dropTargetLeft, setDropTargetLeft] = useState<number | null>(null);
  const [dropDirection, setDropDirection] = useState<"in" | "out">("in");
  const [daySheetOpen, setDaySheetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);

  const day = activeTrip ? currentDayNumber(activeTrip) : 0;
  const dayRef = useRef(day);

  // Re-sync the dial whenever the trip's current day changes while this screen stays mounted —
  // e.g. the user manually jumps to a new day via the day-manage sheet. Without this, the ring
  // and "left today" figure stay frozen on the previous day's numbers instead of resetting.
  useEffect(() => {
    if (!activeTrip || dayRef.current === day) return;
    const prevMilestone = activeTrip ? milestoneForDay(dayRef.current, activeTrip.durationDays) : null;
    const nextMilestone = activeTrip ? milestoneForDay(day, activeTrip.durationDays) : null;
    if (nextMilestone !== null && nextMilestone !== prevMilestone) setMilestone(nextMilestone);
    dayRef.current = day;
    setDisplayFraction(dialFraction(activeTrip));
    setDisplayLeft(dollarsLeftToday(activeTrip));
    setDialMode("sunrise");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

  // Safety net: whenever the trip's data changes for a reason none of the more specific
  // triggers above cover (e.g. editing/deleting an expense from the recent-activity list
  // via SwipeableRow, which doesn't change `day` or set `justLoggedId`), resync the dial to
  // the live-computed numbers once it's idle. Without this, displayFraction/displayLeft can
  // go stale and keep showing a previous day's or previous edit's figures — see CLAUDE.md's
  // note on HomeActiveDay's local dial state.
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (!activeTrip || dialMode !== "idle") return;
    setDisplayFraction(dialFraction(activeTrip));
    setDisplayLeft(dollarsLeftToday(activeTrip));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrip, dialMode]);

  useEffect(() => {
    if (!activeTrip) return;
    const justLoggedId = (location.state as { justLoggedId?: string } | null)?.justLoggedId;

    if (dayJustRolledOver) {
      setDisplayFraction(dialFraction(activeTrip));
      setDisplayLeft(dollarsLeftToday(activeTrip));
      setDialMode("sunrise");
      return;
    }

    if (justLoggedId) {
      const prevTrip = { ...activeTrip, expenses: activeTrip.expenses.filter((e) => e.id !== justLoggedId) };
      setDisplayFraction(dialFraction(prevTrip));
      setDisplayLeft(dollarsLeftToday(prevTrip));
      setDropTarget(dialFraction(activeTrip));
      setDropTargetLeft(dollarsLeftToday(activeTrip));
      setDropDirection("in");
      setDialMode("dropping");
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 900);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeTrip) return null;

  const status = paceStatus(activeTrip);
  const recent = [...activeTrip.expenses].sort((a, b) => b.loggedAt - a.loggedAt).slice(0, 5);
  const hasMore = activeTrip.expenses.length > 5;
  const overshoot = isOvershoot(activeTrip);
  const greeting = timeGreeting();

  const handleDropComplete = () => {
    if (dropTarget !== null) setDisplayFraction(dropTarget);
    if (dropTargetLeft !== null) setDisplayLeft(dropTargetLeft);
    setDialMode("idle");
    setDropTarget(null);
    setDropTargetLeft(null);
  };

  const handleSunriseComplete = () => {
    setDialMode("idle");
    acknowledgeDayRollover();
  };

  const lastExpense = activeTrip.expenses.find((e) => e.id === lastLoggedExpenseId) ?? null;
  const lastExpenseCategory = lastExpense
    ? activeTrip.categories.find((c) => c.id === lastExpense.categoryId)?.name ?? "Other"
    : null;

  const handleUndo = () => {
    if (!lastExpense || dialMode !== "idle") return;
    const prevTrip = { ...activeTrip, expenses: activeTrip.expenses.filter((e) => e.id !== lastExpense.id) };
    const prevFraction = dialFraction(prevTrip);
    const prevLeft = dollarsLeftToday(prevTrip);
    setDropTarget(prevFraction);
    setDropTargetLeft(prevLeft);
    setDropDirection("out");
    setDialMode("dropping");
    // Mutate the data immediately rather than waiting on the drop animation to finish —
    // gating the actual removal on an animation callback meant it silently never happened
    // if the callback didn't fire (e.g. fraction unchanged), leaving the expense in place.
    undoLastExpense();
  };

  return (
    <AppShell withNav>
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="mt-0.5 flex h-8 w-8 items-center justify-center text-ink"
          >
            <Icon icon={Menu} size={22} />
          </button>
          <div>
            <p className="flex items-center gap-1.5 text-[13px] text-slate">
              <Icon icon={greeting.icon} size={15} />
              {greeting.text}, Alex
            </p>
            <button
              onClick={() => setDaySheetOpen(true)}
              className="-ml-1.5 flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-left active:bg-surface"
            >
              <h1 className="font-display text-[19px] font-bold text-ink">
                {activeTrip.name}, Day {day} of {activeTrip.durationDays}
              </h1>
              <Icon icon={ChevronDown} size={16} className="mt-0.5 shrink-0 text-action-primary" />
            </button>
          </div>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <StreakChip streak={loggingStreak(activeTrip)} />
          <PacePulseDot status={status} />
        </div>
      </div>

      <MilestoneToast milestone={milestone} onDismiss={() => setMilestone(null)} />

      <DayOverspendNotice trip={activeTrip} />

      {day >= activeTrip.durationDays && (
        <div className="mx-5 mt-4 rounded-2xl bg-accent-violet/10 px-4 py-3">
          <p className="text-[13px] text-ink">This is your last day. Wrap up whenever you're ready.</p>
          <div className="mt-3 border-t border-accent-violet/20 pt-3">
            <button
              onClick={() => navigate("/finish-trip")}
              className="w-full rounded-pill bg-accent-violet py-2 text-center text-[13px] font-medium text-white"
            >
              Finish trip
            </button>
          </div>
        </div>
      )}

      <DayManageSheet
        trip={activeTrip}
        open={daySheetOpen}
        onClose={() => setDaySheetOpen(false)}
        onEndTrip={() => navigate("/finish-trip")}
      />

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex flex-col items-center gap-4 px-5 pt-6">
        <div className="relative">
          <Celebration show={celebrate} />
          <LatitudeDial
          fraction={displayFraction}
          status={status}
          mode={dialMode}
          dropDirection={dropDirection}
          dropTargetFraction={dropTarget ?? undefined}
          showOvershootRing={overshoot}
          onDropComplete={handleDropComplete}
          onSunriseComplete={handleSunriseComplete}
          centerLabel={
            <>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={Math.round(displayLeft * 100)}
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="tabular font-display text-[34px] font-semibold text-ink"
                >
                  {formatCurrency(displayLeft)}
                </motion.span>
              </AnimatePresence>
              <span className="mt-1 text-[13px] text-slate">left today</span>
            </>
          }
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="flex items-center justify-between text-[12px] text-slate">
            <span className="tabular">
              {formatCurrency(totalSpent(activeTrip))} of {formatCurrency(effectiveBudget(activeTrip))} spent
            </span>
            <span className="tabular">{formatCurrency(dailyAllowanceBase(activeTrip))}/day</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-hairline/50">
            <div
              className="h-full rounded-pill transition-all"
              style={{
                width: `${Math.min((totalSpent(activeTrip) / (effectiveBudget(activeTrip) || 1)) * 100, 100)}%`,
                background: paceColorVar(status),
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.16 } } }}
          className="grid w-full grid-cols-2 gap-3"
        >
          {[
            { label: "Spent today", value: formatCurrency(spentOnDay(activeTrip, day)), tint: "var(--pace-teal)" },
            { label: "Days left", value: String(daysLeft(activeTrip)), tint: "var(--accent-violet)" },
          ].map((tile) => (
            <motion.div
              key={tile.label}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <StatTile label={tile.label} value={tile.value} tint={tile.tint} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-6 px-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-medium text-slate">Recent activity</p>
          <button onClick={() => navigate("/search")} className="text-[13px] font-medium text-action-primary">
            View all
          </button>
        </div>
        <div className="flex max-h-[260px] flex-col gap-3 overflow-y-auto px-0.5 pb-1 pr-1.5">
          {recent.length === 0 && (
            <p className="rounded-2xl bg-surface px-4 py-6 text-center text-[13px] text-slate shadow-soft">
              Nothing logged yet today.
            </p>
          )}
          {recent.map((exp) => {
            const cat = activeTrip.categories.find((c) => c.id === exp.categoryId);
            const IconCmp = categoryIcon(cat?.icon ?? "other");
            return (
              <SwipeableRow
                key={exp.id}
                onEdit={() => navigate(`/edit-expense/${exp.id}`)}
                onDelete={() => deleteExpense(exp.id)}
              >
                <button
                  onClick={() => navigate(`/edit-expense/${exp.id}`)}
                  className="flex w-full shrink-0 items-center gap-3 px-4 py-3 text-left"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                    style={{ background: categoryGradient(categoryColor(activeTrip.categories, exp.categoryId)) }}
                  >
                    <Icon icon={IconCmp} size={17} />
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-ink">{cat?.name ?? "Other"}</p>
                    <p className="text-[12px] text-slate">{exp.note || "No note"}</p>
                  </div>
                  <span className="tabular text-[15px] font-medium text-ink">
                    -{formatCurrency(exp.amount)}
                  </span>
                </button>
              </SwipeableRow>
            );
          })}
        </div>
        {hasMore && (
          <button
            onClick={() => navigate("/search")}
            className="mt-2 w-full rounded-xl border border-dashed border-hairline py-2.5 text-[13px] font-medium text-action-primary"
          >
            See all transactions
          </button>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[84px] z-20 px-5 py-3">
        <div className="pointer-events-auto">
          <UndoBar
            amount={lastExpense?.amount ?? null}
            categoryName={lastExpenseCategory}
            onUndo={handleUndo}
            onDismiss={clearLastLogged}
          />
        </div>
      </div>

      <BottomNav onLogExpense={() => navigate("/add-expense")} />
    </AppShell>
  );
}
