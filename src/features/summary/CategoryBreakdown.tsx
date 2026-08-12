import { motion } from "framer-motion";
import { categoryGradient, categoryPalette } from "../../theme/tokens";
import { categoryIcon, Icon } from "../../components/ui/IconIndex";
import { formatCurrency } from "../../lib/format";
import type { Category, Expense } from "../../data/types";

export function CategoryBreakdown({
  categories,
  expenses,
  symbol = "$",
  startDelay = 0.2,
}: {
  categories: Category[];
  expenses: Expense[];
  symbol?: string;
  startDelay?: number;
}) {
  const total = expenses.reduce((s, e) => s + e.amount, 0) || 1;
  const rows = categories
    .map((cat, i) => ({
      cat,
      amount: expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0),
      color: categoryPalette[i % categoryPalette.length],
    }))
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, idx) => {
        const IconCmp = categoryIcon(r.cat.icon);
        const pct = (r.amount / total) * 100;
        const rowDelay = startDelay + idx * 0.07;
        return (
          <motion.div
            key={r.cat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: rowDelay, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-soft"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: categoryGradient(r.color) }}>
              <Icon icon={IconCmp} size={16} />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-ink">{r.cat.name}</span>
                <span className="tabular text-[14px] font-medium text-ink">{formatCurrency(r.amount, { symbol })}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-canvas">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: rowDelay + 0.15 }}
                  className="h-full rounded-pill"
                  style={{ backgroundColor: r.color }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
