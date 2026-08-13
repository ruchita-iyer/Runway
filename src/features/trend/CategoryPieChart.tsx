import { motion } from "framer-motion";
import { categoryColor } from "../../theme/tokens";
import { categoryIcon, Icon } from "../../components/ui/IconIndex";
import { formatCurrency } from "../../lib/format";
import type { Category, Expense } from "../../data/types";

const SIZE = 180;
const RADIUS = 72;
const STROKE = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEG = 3;

/** Donut chart of % spent per category, with a legend of shares below. */
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
    return { ...r, fraction, startDeg, arcLen };
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--hairline)" strokeWidth={STROKE} strokeOpacity={0.5} />
          {segments.map((s, idx) => (
            <motion.circle
              key={s.cat.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={s.color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${s.arcLen} ${CIRCUMFERENCE - s.arcLen}`}
              transform={`rotate(${s.startDeg} ${SIZE / 2} ${SIZE / 2})`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${SIZE / 2}px ${SIZE / 2}px` }}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="tabular text-[18px] font-bold text-ink">{formatCurrency(total, { symbol })}</p>
          <p className="text-[11px] text-slate">total spent</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        {segments.map((s, idx) => {
          const IconCmp = categoryIcon(s.cat.icon);
          return (
            <motion.div
              key={s.cat.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
              className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-2.5 shadow-soft"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: s.color }}
              >
                <Icon icon={IconCmp} size={14} />
              </span>
              <span className="flex-1 text-[13px] font-medium text-ink">{s.cat.name}</span>
              <span className="tabular text-[13px] font-medium text-ink">{Math.round(s.fraction * 100)}%</span>
              <span className="tabular w-16 text-right text-[12px] text-slate">{formatCurrency(s.amount, { symbol })}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
