import { motion } from "framer-motion";
import { formatCurrency } from "../../lib/format";

interface ChartDay {
  dayNumber: number;
  dateISO: string;
  cumulative: number;
  reached: boolean;
}

const CHART_HEIGHT = 160;
const CHART_PADDING_TOP = 16;
const MAX_TICKS = 6;

/** Cumulative spend over the trip, plotted against a flat budget reference line. */
export function TrendLineChart({
  days,
  budget,
  symbol,
  onDayClick,
}: {
  days: ChartDay[];
  budget: number;
  symbol: string;
  onDayClick?: (dayNumber: number) => void;
}) {
  const reachedDays = days.filter((d) => d.reached);
  const maxValue = Math.max(budget, ...reachedDays.map((d) => d.cumulative), 1) * 1.08;
  const usableHeight = CHART_HEIGHT - CHART_PADDING_TOP;
  const n = days.length;
  const stepX = n > 1 ? 100 / (n - 1) : 100;

  const yFor = (value: number) => CHART_PADDING_TOP + usableHeight - (value / maxValue) * usableHeight;
  const xFor = (i: number) => i * stepX;

  const linePoints = reachedDays.map((d) => `${xFor(days.indexOf(d))},${yFor(d.cumulative)}`);
  const pathD = linePoints.length > 0 ? `M ${linePoints.join(" L ")}` : "";
  const lastReachedIndex = reachedDays.length > 0 ? days.indexOf(reachedDays[reachedDays.length - 1]) : 0;
  const areaD = pathD ? `${pathD} L ${xFor(lastReachedIndex)},${CHART_HEIGHT} L ${xFor(0)},${CHART_HEIGHT} Z` : "";

  const budgetY = yFor(budget);
  const lastReached = reachedDays[reachedDays.length - 1];
  const over = lastReached ? lastReached.cumulative > budget : false;
  const lineColor = over ? "var(--pace-berry)" : "var(--action-primary)";

  const tickEvery = Math.max(1, Math.ceil(n / MAX_TICKS));
  const ticks = days.filter((_, i) => i % tickEvery === 0 || i === n - 1);

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 px-1">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lineColor }} /> Cumulative spend
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate">
          <span
            className="h-0 w-3 border-t border-dashed"
            style={{ borderColor: "color-mix(in srgb, var(--slate) 60%, transparent)" }}
          />
          Budget
        </span>
      </div>
      <svg viewBox={`0 0 100 ${CHART_HEIGHT}`} preserveAspectRatio="none" className="h-40 w-full overflow-visible">
        <line
          x1={0}
          y1={budgetY}
          x2={100}
          y2={budgetY}
          stroke="var(--slate)"
          strokeOpacity={0.5}
          strokeWidth={1}
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
        />
        {areaD && <path d={areaD} fill={lineColor} fillOpacity={0.12} stroke="none" />}
        {pathD && (
          <motion.path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </svg>
      <div className="mt-1 flex justify-between px-0.5">
        {ticks.map((d) => (
          <button
            key={d.dayNumber}
            type="button"
            disabled={!d.reached || !onDayClick}
            onClick={() => onDayClick?.(d.dayNumber)}
            className="text-center disabled:opacity-40"
          >
            <p className="text-[10px] font-medium text-ink">Day {d.dayNumber}</p>
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-slate">Budget: {formatCurrency(budget, { symbol })}</p>
    </div>
  );
}
