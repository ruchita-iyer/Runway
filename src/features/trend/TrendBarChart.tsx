import { motion } from "framer-motion";
import { formatShortDate } from "../../lib/date";

const TRACK_HEIGHT = 84;
const OVER_EXTRA = 22;
const BAR_WIDTH = 7;

function barHeight(ratio: number, reached: boolean) {
  if (!reached) return 4;
  if (ratio > 1) return TRACK_HEIGHT + Math.min((ratio - 1) * TRACK_HEIGHT, OVER_EXTRA);
  return Math.max(ratio * TRACK_HEIGHT, 4);
}

export function TrendBarChart({
  days,
  onDayClick,
}: {
  days: { dayNumber: number; dateISO: string; spent: number; allowance: number; reached: boolean }[];
  onDayClick?: (dayNumber: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-4 px-1">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate">
          <span className="h-1.5 w-1.5 rounded-full bg-action-primary" /> Actual
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "color-mix(in srgb, var(--slate) 45%, transparent)" }}
          />
          Planned
        </span>
      </div>
      <div className="flex items-end justify-between gap-2 px-1">
        {days.map((d, idx) => {
          const ratio = d.allowance > 0 ? d.spent / d.allowance : 0;
          const over = d.reached && ratio > 1;
          const actualHeight = barHeight(ratio, d.reached);
          const plannedHeight = TRACK_HEIGHT;
          const color = over ? "var(--pace-berry)" : "var(--action-primary)";
          const clickable = d.reached && !!onDayClick;

          return (
            <button
              key={d.dayNumber}
              type="button"
              disabled={!clickable}
              onClick={() => onDayClick?.(d.dayNumber)}
              className="flex flex-1 flex-col items-center gap-2 disabled:opacity-60"
            >
              <div className="flex items-end gap-1" style={{ height: TRACK_HEIGHT + OVER_EXTRA }}>
                <div
                  className="relative overflow-visible rounded-pill"
                  style={{
                    width: BAR_WIDTH,
                    height: TRACK_HEIGHT,
                    backgroundColor: "color-mix(in srgb, var(--slate) 20%, transparent)",
                    alignSelf: "flex-end",
                  }}
                >
                  <div
                    className="absolute bottom-0 left-0 w-full rounded-pill"
                    style={{ height: plannedHeight, backgroundColor: "color-mix(in srgb, var(--slate) 45%, transparent)" }}
                  />
                </div>
                <div
                  className="relative overflow-visible rounded-pill"
                  style={{
                    width: BAR_WIDTH,
                    height: TRACK_HEIGHT,
                    backgroundColor: "color-mix(in srgb, var(--slate) 12%, transparent)",
                    alignSelf: "flex-end",
                  }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: actualHeight }}
                    transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-0 w-full rounded-pill"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-medium text-ink">D{d.dayNumber}</p>
                <p className="text-[10px] text-slate">{formatShortDate(d.dateISO)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
