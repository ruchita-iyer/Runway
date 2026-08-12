import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Icon, ArrowLeft, ChevronRight, Wallet, TrendingDown, TrendingUp, Flame } from "../../components/ui/IconIndex";
import { NestedRingEcho } from "./NestedRingEcho";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { useTripData } from "../../data/useTripData";
import {
  effectiveBudget,
  longestLoggingStreak,
  loggingStreak,
  totalSpent,
  tripCurrencySymbol,
  tripEndDateISO,
} from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import { Placeholder } from "../../components/ui/Placeholder";

export function SummaryScreen() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { state, activeTrip } = useTripData();

  const trip = tripId ? state.trips.find((t) => t.id === tripId) ?? null : activeTrip;

  if (!trip) return <Placeholder title="Summary" />;

  const symbol = tripCurrencySymbol(trip);
  const budget = effectiveBudget(trip);
  const spent = totalSpent(trip);
  const left = budget - spent;
  const fraction = budget > 0 ? spent / budget : 0;
  const over = spent > budget;
  const statusColor = over ? "var(--pace-berry)" : "var(--pace-teal)";
  const isComplete = trip.status === "complete";
  // For a completed trip, "today" may be long after the trip ended — anchor the streak
  // calculation to the trip's own end date so it reflects the final streak, not zero.
  const finalStreak = isComplete ? loggingStreak(trip, tripEndDateISO(trip)) : loggingStreak(trip);
  const bestStreak = longestLoggingStreak(trip);

  const rowCount = trip.categories.filter((c) => trip.expenses.some((e) => e.categoryId === c.id)).length;
  const rowsDelay = 0.65;
  const footerDelay = rowsDelay + rowCount * 0.07 + 0.25;

  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-ink">
          <Icon icon={ArrowLeft} size={22} />
        </button>
        <div>
          {trip.status === "complete" && (
            <p className="font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-action-primary">
              Wrapped
            </p>
          )}
          <h1 className="font-display text-[20px] font-bold text-ink">{trip.name}</h1>
        </div>
      </div>

      {trip.status === "complete" && (
        <p className="px-5 pt-1 text-[13px] leading-relaxed text-slate">
          A detailed breakdown of your travel finance flow.
        </p>
      )}

      <div className="flex flex-col items-center gap-2 pt-6">
        <div className="relative flex items-center justify-center">
          <NestedRingEcho fraction={fraction} over={over} />
          <div className="absolute flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="tabular font-display text-[26px] font-semibold"
              style={{ color: over ? statusColor : "var(--ink)" }}
            >
              {over ? `${formatCurrency(Math.abs(left), { symbol })} over` : formatCurrency(Math.max(left, 0), { symbol })}
            </motion.span>
            <span className="text-[12px] text-slate">{over ? "over budget" : "left"}</span>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-[13px] text-slate">
          <span style={{ color: statusColor }}>
            <Icon icon={over ? TrendingUp : TrendingDown} size={14} />
          </span>
          <span className="tabular">
            Spent {formatCurrency(spent, { symbol })} of {formatCurrency(budget, { symbol })}
          </span>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.55 }}
        className="flex gap-3 px-5 pt-6"
      >
        <div
          className="flex-1 rounded-xl px-3 py-3 shadow-soft"
          style={{ background: "color-mix(in srgb, var(--accent-violet) 16%, var(--surface))" }}
        >
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate">
            <Icon icon={Wallet} size={12} />
            Budget
          </p>
          <p
            className="tabular mt-1 font-display text-[19px] font-semibold"
            style={{ color: "var(--accent-violet)" }}
          >
            {formatCurrency(budget, { symbol })}
          </p>
        </div>
        <div
          className="flex-1 rounded-xl px-3 py-3 shadow-soft"
          style={{ background: `color-mix(in srgb, ${statusColor} 16%, var(--surface))` }}
        >
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate">
            <span style={{ color: statusColor }}>
              <Icon icon={over ? TrendingUp : TrendingDown} size={12} />
            </span>
            Spent
          </p>
          <p className="tabular mt-1 font-display text-[19px] font-semibold" style={{ color: statusColor }}>
            {formatCurrency(spent, { symbol })}
          </p>
        </div>
      </motion.div>

      <div className="px-5 pt-8">
        <p className="mb-2 text-[13px] font-medium text-slate">By category</p>
        <CategoryBreakdown categories={trip.categories} expenses={trip.expenses} symbol={symbol} startDelay={rowsDelay} />
      </div>

      {isComplete && (bestStreak > 0 || finalStreak > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: rowsDelay + 0.1 }}
          className="px-5 pt-8"
        >
          <p className="mb-2 text-[13px] font-medium text-slate">Achievements</p>
          <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-soft">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pace-teal/12 text-pace-teal">
              <Icon icon={Flame} size={19} />
            </span>
            <div>
              <p className="text-[14px] font-medium text-ink">
                Finished on a {finalStreak}-day logging streak
              </p>
              <p className="text-[12px] text-slate">Longest streak on this trip: {bestStreak} day{bestStreak === 1 ? "" : "s"}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: footerDelay }}
        className="flex flex-col gap-3 px-5 pb-10 pt-4"
      >
        <button
          onClick={() => navigate(`/search/${trip.id}`)}
          className="flex w-full items-center justify-between rounded-2xl bg-surface px-4 py-3.5 text-left shadow-soft"
        >
          <span className="text-[14px] font-medium text-ink">View all expenses</span>
          <Icon icon={ChevronRight} size={18} className="text-slate" />
        </button>
      </motion.div>
    </AppShell>
  );
}
