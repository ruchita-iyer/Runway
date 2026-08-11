import { motion } from "framer-motion";
import { formatShortDate } from "../../lib/date";

const TRACK_HEIGHT = 84;
const OVER_EXTRA = 22;

export function TrendBarChart({
  days,
}: {
  days: { dayNumber: number; dateISO: string; spent: number; allowance: number; reached: boolean }[];
}) {
  return (
    <div className="flex items-end justify-between gap-2 px-1">
      {days.map((d, idx) => {
        const ratio = d.allowance > 0 ? d.spent / d.allowance : 0;
        const over = d.reached && ratio > 1;
        const fillHeight = !d.reached
          ? 4
          : over
            ? TRACK_HEIGHT + Math.min((ratio - 1) * TRACK_HEIGHT, OVER_EXTRA)
            : Math.max(ratio * TRACK_HEIGHT, 4);
        const color = over ? "var(--pace-berry)" : "var(--action-primary)";

        return (
          <div key={d.dayNumber} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="relative w-3 overflow-visible rounded-pill"
              style={{ height: TRACK_HEIGHT, backgroundColor: "color-mix(in srgb, var(--slate) 28%, transparent)" }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: fillHeight }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 left-0 w-full rounded-pill"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-medium text-ink">D{d.dayNumber}</p>
              <p className="text-[10px] text-slate">{formatShortDate(d.dateISO)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
