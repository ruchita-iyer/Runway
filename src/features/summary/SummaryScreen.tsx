import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Icon, ArrowLeft, Share2, ChevronRight, Wallet, TrendingDown, TrendingUp } from "../../components/ui/IconIndex";
import { NestedRingEcho } from "./NestedRingEcho";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { useTripData } from "../../data/useTripData";
import { effectiveBudget, totalSpent } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import { Placeholder } from "../../components/ui/Placeholder";

export function SummaryScreen() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { state, activeTrip } = useTripData();

  const trip = tripId ? state.trips.find((t) => t.id === tripId) ?? null : activeTrip;

  if (!trip) return <Placeholder title="Summary" />;

  const budget = effectiveBudget(trip);
  const spent = totalSpent(trip);
  const left = budget - spent;
  const fraction = budget > 0 ? spent / budget : 0;
  const over = spent > budget;
  const statusColor = over ? "var(--pace-berry)" : "var(--pace-teal)";

  const share = async () => {
    const text = `${trip.name}: spent ${formatCurrency(spent)} of ${formatCurrency(budget)}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const rowCount = trip.categories.filter((c) => trip.expenses.some((e) => e.categoryId === c.id)).length;
  const rowsDelay = 0.65;
  const footerDelay = rowsDelay + rowCount * 0.07 + 0.25;

  return (
    <AppShell>
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-3">
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
        <button onClick={share} className="text-ink">
          <Icon icon={Share2} size={20} />
        </button>
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
              {over ? `${formatCurrency(Math.abs(left))} over` : formatCurrency(Math.max(left, 0))}
            </motion.span>
            <span className="text-[12px] text-slate">{over ? "over budget" : "left"}</span>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-[13px] text-slate">
          <span style={{ color: statusColor }}>
            <Icon icon={over ? TrendingUp : TrendingDown} size={14} />
          </span>
          <span className="tabular">
            Spent {formatCurrency(spent)} of {formatCurrency(budget)}
          </span>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.55 }}
        className="flex gap-3 px-5 pt-6"
      >
        <div className="flex-1 rounded-xl bg-surface px-3 py-3 shadow-soft">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate">
            <Icon icon={Wallet} size={12} />
            Budget
          </p>
          <p className="tabular mt-1 font-display text-[19px] font-semibold text-ink">{formatCurrency(budget)}</p>
        </div>
        <div className="flex-1 rounded-xl bg-surface px-3 py-3 shadow-soft">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate">
            <span style={{ color: statusColor }}>
              <Icon icon={over ? TrendingUp : TrendingDown} size={12} />
            </span>
            Spent
          </p>
          <p className="tabular mt-1 font-display text-[19px] font-semibold" style={{ color: statusColor }}>
            {formatCurrency(spent)}
          </p>
        </div>
      </motion.div>

      <div className="px-5 pt-8">
        <p className="mb-2 text-[13px] font-medium text-slate">By category</p>
        <CategoryBreakdown categories={trip.categories} expenses={trip.expenses} startDelay={rowsDelay} />
      </div>

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
        {trip.status === "complete" && (
          <button
            onClick={share}
            className="w-full rounded-pill bg-action-primary py-3.5 text-center text-[15px] font-medium text-white shadow-soft"
          >
            Share summary
          </button>
        )}
      </motion.div>
    </AppShell>
  );
}
