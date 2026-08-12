import { motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { BottomNav } from "../../layout/BottomNav";
import { Button } from "../../components/ui/Button";
import { StatTile } from "../../components/ui/StatTile";
import { Icon, Calendar, Flag } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { effectiveToday, tripCurrencySymbol } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import { formatShortDate } from "../../lib/date";

export function HomeUpcoming() {
  const { activeTrip, startPlannedTrip } = useTripData();

  if (!activeTrip) return null;

  const symbol = tripCurrencySymbol(activeTrip);
  const canStartNow = activeTrip.startDate <= effectiveToday(activeTrip);

  return (
    <AppShell withNav>
      <div className="flex flex-col items-center gap-3 px-6 pt-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-violet/12 text-accent-violet"
        >
          <Icon icon={Flag} size={28} />
        </motion.div>
        <p className="text-[13px] font-medium uppercase tracking-wide text-slate">Upcoming trip</p>
        <h1 className="font-display text-[24px] font-bold text-ink">{activeTrip.name}</h1>
        <p className="flex items-center gap-1.5 text-[14px] text-slate">
          <Icon icon={Calendar} size={15} />
          Starts {formatShortDate(activeTrip.startDate)}
        </p>
      </div>

      <div className="flex gap-3 px-5 pt-8">
        <StatTile label="Budget" value={formatCurrency(activeTrip.totalBudget, { symbol })} tint="var(--accent-violet)" />
        <StatTile label="Duration" value={`${activeTrip.durationDays} day${activeTrip.durationDays === 1 ? "" : "s"}`} tint="var(--action-primary)" />
      </div>

      {activeTrip.categories.length > 0 && (
        <div className="px-5 pt-6">
          <p className="mb-2 text-[13px] font-medium text-slate">Categories</p>
          <div className="flex flex-wrap gap-2">
            {activeTrip.categories.map((c) => (
              <span
                key={c.id}
                className="rounded-pill bg-surface px-3 py-1.5 text-[13px] font-medium text-ink shadow-soft"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pt-8">
        <Button disabled={!canStartNow} onClick={() => startPlannedTrip(activeTrip.id)}>
          Start trip now
        </Button>
        <p className="mt-3 text-center text-[12px] text-slate">
          {canStartNow
            ? "Your trip is ready — tap above to start tracking."
            : `You can start once your trip begins on ${formatShortDate(activeTrip.startDate)}.`}
        </p>
      </div>

      <BottomNav />
    </AppShell>
  );
}
