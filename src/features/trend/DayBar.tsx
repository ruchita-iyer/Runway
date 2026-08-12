import { formatCurrency } from "../../lib/format";
import { formatShortDate } from "../../lib/date";

export function DayBar({
  dayNumber,
  dateISO,
  spent,
  allowance,
  onClick,
}: {
  dayNumber: number;
  dateISO: string;
  spent: number;
  allowance: number;
  onClick?: () => void;
}) {
  const diff = spent - allowance;
  const over = diff > 0;

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl bg-surface px-4 py-3.5 text-left shadow-soft active:opacity-80"
    >
      <div>
        <p className="text-[14px] font-semibold text-ink">
          Day {dayNumber} <span className="font-normal text-slate">· {formatShortDate(dateISO)}</span>
        </p>
        <p className="text-[12px] text-slate">Budget: {formatCurrency(allowance)}</p>
      </div>
      <div className="text-right">
        <p className="tabular text-[15px] font-semibold text-ink">{formatCurrency(spent)}</p>
        <p className="flex items-center justify-end gap-1 text-[12px] font-medium">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: over ? "var(--pace-berry)" : "var(--pace-teal)" }}
          />
          <span style={{ color: over ? "var(--pace-berry)" : "var(--pace-teal)" }}>
            {over ? "-" : "+"}
            {formatCurrency(Math.abs(diff))}
          </span>
        </p>
      </div>
    </button>
  );
}
