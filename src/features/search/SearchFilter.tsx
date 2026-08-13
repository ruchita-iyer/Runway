import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Chip } from "../../components/ui/Chip";
import { SwipeableRow } from "../../components/ui/SwipeableRow";
import { Icon, ArrowLeft, Search, categoryIcon } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { tripCurrencySymbol } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import { formatShortDate } from "../../lib/date";
import { Placeholder } from "../../components/ui/Placeholder";
import { categoryColor, categoryGradient } from "../../theme/tokens";

export function SearchFilter() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { state, activeTrip, deleteExpense } = useTripData();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const trip = tripId ? state.trips.find((t) => t.id === tripId) ?? null : activeTrip;

  const results = useMemo(() => {
    if (!trip) return [];
    return [...trip.expenses]
      .sort((a, b) => b.loggedAt - a.loggedAt)
      .filter((e) => {
        const cat = trip.categories.find((c) => c.id === e.categoryId);
        if (categoryFilter && e.categoryId !== categoryFilter) return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return e.note.toLowerCase().includes(q) || (cat?.name.toLowerCase().includes(q) ?? false);
      });
  }, [trip, query, categoryFilter]);

  if (!trip) return <Placeholder title="Search" />;

  const symbol = tripCurrencySymbol(trip);

  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-ink">
          <Icon icon={ArrowLeft} size={22} />
        </button>
        <h1 className="font-display text-[20px] font-bold text-ink">Search expenses</h1>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-center gap-2 rounded-pill bg-surface px-4 py-2.5 shadow-soft">
          <Icon icon={Search} size={18} className="text-slate" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes or categories"
            className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-slate focus:outline-none"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Chip selected={categoryFilter === null} onClick={() => setCategoryFilter(null)}>
            All
          </Chip>
          {trip.categories.map((cat) => (
            <Chip
              key={cat.id}
              selected={categoryFilter === cat.id}
              onClick={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
              icon={<Icon icon={categoryIcon(cat.icon)} size={14} />}
            >
              {cat.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-5">
        {results.length === 0 && (
          <p className="rounded-2xl bg-surface px-4 py-6 text-center text-[13px] text-slate shadow-soft">
            No expenses.
          </p>
        )}
        {results.map((exp) => {
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
                  <p className="text-[12px] text-slate">
                    {exp.note || "No note"} · {formatShortDate(new Date(exp.loggedAt).toISOString().slice(0, 10))}
                  </p>
                </div>
                <span className="tabular text-[15px] font-medium text-ink">-{formatCurrency(exp.amount, { symbol })}</span>
              </button>
            </SwipeableRow>
          );
        })}
      </div>
    </AppShell>
  );
}
