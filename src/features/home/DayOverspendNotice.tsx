import { motion } from "framer-motion";
import { currentDayNumber, dollarsLeftToday } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import type { Trip } from "../../data/types";

export function DayOverspendNotice({ trip }: { trip: Trip }) {
  const left = dollarsLeftToday(trip);
  if (left >= 0) return null;

  const deficit = -left;
  const day = currentDayNumber(trip);
  const daysRemaining = Math.max(trip.durationDays - day, 0);

  const message =
    daysRemaining > 0
      ? `That's fine — tomorrow you'll have ${formatCurrency(deficit / daysRemaining)} less to spend.`
      : `That's fine — you're ${formatCurrency(deficit)} over for the trip. Consider wrapping up soon.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-5 mt-4 rounded-xl border border-pace-gold/30 bg-pace-gold/15 px-4 py-3"
    >
      <p className="text-[13px] font-medium leading-relaxed text-ink">{message}</p>
    </motion.div>
  );
}
