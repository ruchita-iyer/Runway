import { motion } from "framer-motion";
import { categoryColor } from "../../theme/tokens";
import { formatCurrency } from "../../lib/format";
import type { Category, Expense } from "../../data/types";

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 64;
const STROKE = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEG = 3;
const LABEL_RADIUS = RADIUS + STROKE / 2 + 28;
const LEADER_START_RADIUS = RADIUS + STROKE / 2 + 4;
const LEADER_END_RADIUS = RADIUS + STROKE / 2 + 18;

/** Donut chart of % spent per category, labeled directly around the ring rather than in a separate legend. */
export function CategoryPieChart({
  categories,
  expenses,
  symbol = "$",
}: {
  categories: Category[];
  expenses: Expense[];
  symbol?: string;
}) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const rows = categories
    .map((cat) => ({
      cat,
      amount: expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0),
      color: categoryColor(categories, cat.id),
    }))
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (total === 0 || rows.length === 0) {
    return (
      <p className="rounded-2xl bg-surface px-4 py-6 text-center text-[13px] text-slate shadow-soft">
        Log an expense to see your category breakdown.
      </p>
    );
  }

  let cursorDeg = -90;
  const segments = rows.map((r) => {
    const fraction = r.amount / total;
    const sweep = fraction * 360;
    const startDeg = cursorDeg;
    cursorDeg += sweep;
    const gap = rows.length > 1 ? GAP_DEG : 0;
    const arcLen = Math.max((sweep / 360) * CIRCUMFERENCE - gap, 0);
    const midDeg = startDeg + sweep / 2;
    const midRad = (midDeg * Math.PI) / 180;
    const cos = Math.cos(midRad);
    const sin = Math.sin(midRad);
    return {
      ...r,
      fraction,
      startDeg,
      arcLen,
      leaderStart: { x: CENTER + LEADER_START_RADIUS * cos, y: CENTER + LEADER_START_RADIUS * sin },
      leaderEnd: { x: CENTER + LEADER_END_RADIUS * cos, y: CENTER + LEADER_END_RADIUS * sin },
      labelPoint: { x: CENTER + LABEL_RADIUS * cos, y: CENTER + LABEL_RADIUS * sin },
      anchor: cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle",
    } as const;
  });

  return (
    <div className="flex justify-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="overflow-visible">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--hairline)" strokeWidth={STROKE} strokeOpacity={0.5} />
          {segments.map((s, idx) => (
            <motion.circle
              key={s.cat.id}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={s.color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${s.arcLen} ${CIRCUMFERENCE - s.arcLen}`}
              transform={`rotate(${s.startDeg} ${CENTER} ${CENTER})`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
            />
          ))}

          {segments.map((s, idx) => (
            <motion.g
              key={`label-${s.cat.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + idx * 0.06 }}
            >
              <line
                x1={s.leaderStart.x}
                y1={s.leaderStart.y}
                x2={s.leaderEnd.x}
                y2={s.leaderEnd.y}
                stroke={s.color}
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />
              <text
                x={s.labelPoint.x}
                y={s.labelPoint.y}
                textAnchor={s.anchor}
                dominantBaseline="middle"
                className="tabular"
              >
                <tspan x={s.labelPoint.x} dy="-0.3em" style={{ fontSize: 11.5, fontWeight: 600, fill: "var(--ink)" }}>
                  {s.cat.name}
                </tspan>
                <tspan x={s.labelPoint.x} dy="1.25em" style={{ fontSize: 11, fontWeight: 500, fill: s.color }}>
                  {Math.round(s.fraction * 100)}%
                </tspan>
              </text>
            </motion.g>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="tabular text-[18px] font-bold text-ink">{formatCurrency(total, { symbol })}</p>
          <p className="text-[11px] text-slate">total spent</p>
        </div>
      </div>
    </div>
  );
}
