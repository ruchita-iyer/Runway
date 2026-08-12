import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { SwipeableRow } from "../../components/ui/SwipeableRow";
import { Icon, ArrowLeft, categoryIcon } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { dailyAllowanceBase, spentOnDay, tripDateForDay } from "../../data/calculations";
import { categoryColor, categoryGradient } from "../../theme/tokens";
import { formatCurrency } from "../../lib/format";
import { formatShortDate } from "../../lib/date";
import { Placeholder } from "../../components/ui/Placeholder";

export function DayDetail() {
  const navigate = useNavigate();
  const { tripId, day } = useParams();
  const { state, deleteExpense } = useTripData();

  const trip = tripId ? state.trips.find((t) => t.id === tripId) ?? null : null;
  const dayNumber = Number(day);

  if (!trip || !dayNumber) return <Placeholder title="Day detail" />;

  const allowance = dailyAllowanceBase(trip);
  const spent = spentOnDay(trip, dayNumber);
  const diff = spent - allowance;
  const over = diff > 0;
  const expenses = trip.expenses
    .filter((e) => e.dayNumber === dayNumber)
    .sort((a, b) => b.loggedAt - a.loggedAt);

  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-ink">
          <Icon icon={ArrowLeft} size={22} />
        </button>
        <div>
          <p className="text-[13px] text-slate">{formatShortDate(tripDateForDay(trip, dayNumber))}</p>
          <h1 className="font-display text-[20px] font-bold text-ink">Day {dayNumber}</h1>
        </div>
      </div>

      <div className="flex gap-3 px-5 pt-5">
        <div className="flex-1 rounded-xl bg-surface px-3 py-3 shadow-soft">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate">Budget</p>
          <p className="tabular mt-1 font-display text-[19px] font-semibold text-ink">{formatCurrency(allowance)}</p>
        </div>
        <div className="flex-1 rounded-xl bg-surface px-3 py-3 shadow-soft">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate">Spent</p>
          <p className="tabular mt-1 font-display text-[19px] font-semibold text-ink">{formatCurrency(spent)}</p>
          <p className="tabular mt-0.5 text-[12px] font-medium" style={{ color: over ? "var(--pace-berry)" : "var(--pace-teal)" }}>
            {over ? "-" : "+"}
            {formatCurrency(Math.abs(diff))}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-6 pb-8">
        {expenses.length === 0 && (
          <p className="rounded-2xl bg-surface px-4 py-6 text-center text-[13px] text-slate shadow-soft">
            Nothing logged on this day.
          </p>
        )}
        {expenses.map((exp) => {
          const cat = trip.categories.find((c) => c.id === exp.categoryId);
          return (
            <SwipeableRow
              key={exp.id}
              onEdit={() => navigate(`/edit-expense/${exp.id}`)}
              onDelete={() => deleteExpense(exp.id)}
            >
              <button
                onClick={() => navigate(`/edit-expense/${exp.id}`)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                  style={{ background: categoryGradient(categoryColor(trip.categories, exp.categoryId)) }}
                >
                  <Icon icon={categoryIcon(cat?.icon ?? "other")} size={16} />
                </span>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink">{cat?.name ?? "Other"}</p>
                  <p className="text-[12px] text-slate">{exp.note || "No note"}</p>
                </div>
                <span className="tabular text-[15px] font-medium text-ink">-{formatCurrency(exp.amount)}</span>
              </button>
            </SwipeableRow>
          );
        })}
      </div>
    </AppShell>
  );
}
