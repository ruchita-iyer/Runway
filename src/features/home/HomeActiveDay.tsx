import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { BottomNav } from "../../layout/BottomNav";
import { LatitudeDial } from "../../components/dial/LatitudeDial";
import type { DialMode } from "../../components/dial/LatitudeDial";
import { StatTile } from "../../components/ui/StatTile";
import { PacePulseDot } from "../../components/ui/PacePulseDot";
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
  dialFraction,
  dollarsLeftToday,
  effectiveBudget,
  isOvershoot,
  paceStatus,
  spentOnDay,
  totalSpent,
} from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import { timeGreeting } from "../../lib/greeting";

export function HomeActiveDay() {
  const {
    activeTrip,
    dayJustRolledOver,
    acknowledgeDayRollover,
    lastLoggedExpenseId,
    undoLastExpense,
    clearLastLogged,
  } = useTripData();
  const navigate = useNavigate();
  const location = useLocation();

  const [displayFraction, setDisplayFraction] = useState(() => (activeTrip ? dialFraction(activeTrip) : 0));
  const [displayLeft, setDisplayLeft] = useState(() => (activeTrip ? dollarsLeftToday(activeTrip) : 0));
  const [dialMode, setDialMode] = useState<DialMode>("idle");
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [dropTargetLeft, setDropTargetLeft] = useState<number | null>(null);
  const [dropDirection, setDropDirection] = useState<"in" | "out">("in");
  const [pendingUndoTarget, setPendingUndoTarget] = useState<number | null>(null);
  const [pendingUndoLeft, setPendingUndoLeft] = useState<number | null>(null);
  const [daySheetOpen, setDaySheetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const day = activeTrip ? currentDayNumber(activeTrip) : 0;
  const dayRef = useRef(day);

  // Re-sync the dial whenever the trip's current day changes while this screen stays mounted —
  // e.g. the user manually jumps to a new day via the day-manage sheet. Without this, the ring
  // and "left today" figure stay frozen on the previous day's numbers instead of resetting.
  useEffect(() => {
    if (!activeTrip || dayRef.current === day) return;
    dayRef.current = day;
    setDisplayFraction(dialFraction(activeTrip));
    setDisplayLeft(dollarsLeftToday(activeTrip));
    setDialMode("sunrise");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

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

  const handleArcSettled = () => {
    if (pendingUndoTarget !== null) {
      setDropTarget(pendingUndoTarget);
      setDropTargetLeft(pendingUndoLeft);
      setDropDirection("out");
      setDialMode("dropping");
      setPendingUndoTarget(null);
      setPendingUndoLeft(null);
    }
  };

  const handleUndoDropComplete = () => {
    handleDropComplete();
    undoLastExpense();
  };

  const handleUndo = () => {
    if (!lastExpense || dialMode !== "idle") return;
    const prevTrip = { ...activeTrip, expenses: activeTrip.expenses.filter((e) => e.id !== lastExpense.id) };
    const prevFraction = dialFraction(prevTrip);
    const prevLeft = dollarsLeftToday(prevTrip);
    setPendingUndoTarget(prevFraction);
    setPendingUndoLeft(prevLeft);
    setDisplayFraction(prevFraction);
    setDisplayLeft(prevLeft);
  };

  const handleDropCompleteDynamic = () => {
    if (dropDirection === "out") handleUndoDropComplete();
    else handleDropComplete();
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
        <PacePulseDot status={status} />
      </div>

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

      <Celebration show={celebrate} />

      <div className="flex flex-col items-center gap-4 px-5 pt-6">
        <LatitudeDial
          fraction={displayFraction}
          status={status}
          mode={dialMode}
          dropDirection={dropDirection}
          dropTargetFraction={dropTarget ?? undefined}
          showOvershootRing={overshoot}
          onDropComplete={handleDropCompleteDynamic}
          onSunriseComplete={handleSunriseComplete}
          onArcSettled={handleArcSettled}
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

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
          className="grid w-full grid-cols-2 gap-3"
        >
          {[
            { label: "Total budget", value: formatCurrency(effectiveBudget(activeTrip)) },
            { label: "Spent", value: formatCurrency(totalSpent(activeTrip)) },
            { label: "Daily allowance", value: formatCurrency(dailyAllowanceBase(activeTrip)) },
            { label: "Today", value: formatCurrency(spentOnDay(activeTrip, day)) },
          ].map((tile) => (
            <motion.div
              key={tile.label}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <StatTile label={tile.label} value={tile.value} />
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
        <div className="flex max-h-[260px] flex-col gap-2 overflow-y-auto pr-1">
          {recent.length === 0 && (
            <p className="rounded-2xl bg-surface px-4 py-6 text-center text-[13px] text-slate shadow-soft">
              Nothing logged yet today.
            </p>
          )}
          {recent.map((exp) => {
            const cat = activeTrip.categories.find((c) => c.id === exp.categoryId);
            const IconCmp = categoryIcon(cat?.icon ?? "other");
            return (
              <motion.button
                key={exp.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/edit-expense/${exp.id}`)}
                className="flex shrink-0 items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-left shadow-soft"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-action-primary">
                  <Icon icon={IconCmp} size={17} />
                </span>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink">{cat?.name ?? "Other"}</p>
                  <p className="text-[12px] text-slate">{exp.note || "No note"}</p>
                </div>
                <span className="tabular text-[15px] font-medium text-ink">
                  -{formatCurrency(exp.amount)}
                </span>
              </motion.button>
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
