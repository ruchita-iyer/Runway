import { formatCurrency } from "../../lib/format";
import { formatShortDate } from "../../lib/date";

export function DayBar({
  dayNumber,
  dateISO,
  spent,
  symbol,
  onClick,
}: {
  dayNumber: number;
  dateISO: string;
  spent: number;
  symbol: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl bg-surface px-4 py-3.5 text-left shadow-soft active:opacity-80"
    >
      <p className="text-[14px] font-semibold text-ink">
        Day {dayNumber} <span className="font-normal text-slate">· {formatShortDate(dateISO)}</span>
      </p>
      <p className="tabular text-[15px] font-semibold text-ink">{formatCurrency(spent, { symbol })}</p>
    </button>
  );
}
