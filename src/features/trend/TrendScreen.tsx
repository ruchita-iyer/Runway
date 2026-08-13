import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { BottomNav } from "../../layout/BottomNav";
import { DayBar } from "./DayBar";
import { TrendLineChart } from "./TrendLineChart";
import { CategoryPieChart } from "./CategoryPieChart";
import { HamburgerMenu } from "../home/HamburgerMenu";
import { useTripData } from "../../data/useTripData";
import { currentDayNumber, effectiveBudget, spentOnDay, tripCurrencySymbol } from "../../data/calculations";
import { addDaysISO } from "../../lib/date";
import { Icon, Menu } from "../../components/ui/IconIndex";
import { Placeholder } from "../../components/ui/Placeholder";

export function TrendScreen() {
  const navigate = useNavigate();
  const { activeTrip, state } = useTripData();
  const [menuOpen, setMenuOpen] = useState(false);

  const mostRecentTrip = [...state.trips].sort((a, b) => b.startDate.localeCompare(a.startDate))[0] ?? null;
  const trip = activeTrip ?? mostRecentTrip;

  if (!trip) return <Placeholder title="Trend" />;

  const isPastTrip = !activeTrip;
  const symbol = tripCurrencySymbol(trip);
  const budget = effectiveBudget(trip);
  const reachedThrough = trip.status === "complete" ? trip.durationDays : currentDayNumber(trip);
  const allDays = Array.from({ length: trip.durationDays }, (_, i) => i + 1);

  let cumulative = 0;
  const chartDays = allDays.map((d) => {
    cumulative += spentOnDay(trip, d);
    return {
      dayNumber: d,
      dateISO: addDaysISO(trip.startDate, d - 1),
      cumulative,
      reached: d <= reachedThrough,
    };
  });

  const settleDays = allDays.filter((d) => d <= reachedThrough).reverse();

  const openDay = (d: number) => navigate(`/day/${trip.id}/${d}`);

  return (
    <AppShell withNav>
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(true)} aria-label="Menu" className="flex h-8 w-8 items-center justify-center text-ink">
            <Icon icon={Menu} size={22} />
          </button>
          <div>
            <p className="text-[13px] text-slate">
              {trip.name}
              {isPastTrip && " · Past trip"}
            </p>
            <h1 className="font-display text-[20px] font-bold text-ink">Trend</h1>
          </div>
        </div>
      </div>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="px-5 pt-6">
        <p className="mb-4 text-[13px] font-medium text-slate">Spend over time</p>
        <TrendLineChart days={chartDays} budget={budget} symbol={symbol} onDayClick={openDay} />
      </div>

      <div className="px-5 pt-8">
        <p className="mb-4 text-[13px] font-medium text-slate">By category</p>
        <CategoryPieChart categories={trip.categories} expenses={trip.expenses} symbol={symbol} />
      </div>

      <div className="px-5 pb-6 pt-8">
        <p className="mb-2 text-[13px] font-medium text-slate">By day</p>
        <div className="flex flex-col gap-2">
          {settleDays.length === 0 && (
            <p className="rounded-2xl bg-surface px-4 py-6 text-center text-[13px] text-slate shadow-soft">
              No days logged yet.
            </p>
          )}
          {settleDays.map((d) => (
            <DayBar
              key={d}
              dayNumber={d}
              dateISO={addDaysISO(trip.startDate, d - 1)}
              spent={spentOnDay(trip, d)}
              symbol={symbol}
              onClick={() => openDay(d)}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </AppShell>
  );
}
