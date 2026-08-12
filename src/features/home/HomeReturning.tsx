import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { BottomNav } from "../../layout/BottomNav";
import { Button } from "../../components/ui/Button";
import { StatTile } from "../../components/ui/StatTile";
import { StreakChip } from "../../components/ui/StreakChip";
import { Icon, ChevronRight, Menu, Flag } from "../../components/ui/IconIndex";
import { HamburgerMenu } from "./HamburgerMenu";
import { useTripData } from "../../data/useTripData";
import { loggingStreak, totalSpent, tripCurrencySymbol } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import { timeGreeting } from "../../lib/greeting";

export function HomeReturning() {
  const navigate = useNavigate();
  const { state, startNewTripFlow } = useTripData();
  const greeting = timeGreeting();
  const [menuOpen, setMenuOpen] = useState(false);

  const trips = [...state.trips].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const totalAcrossTrips = trips.reduce((sum, t) => sum + totalSpent(t), 0);
  const latestActiveTrip = trips.find((t) => t.status === "active") ?? null;
  const streak = latestActiveTrip ? loggingStreak(latestActiveTrip) : 0;
  const summarySymbol = trips[0] ? tripCurrencySymbol(trips[0]) : "$";

  return (
    <AppShell withNav>
      <div className="flex items-start justify-between gap-3 px-5 pt-6">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="mt-0.5 flex h-8 w-8 items-center justify-center text-ink"
          >
            <Icon icon={Menu} size={22} />
          </button>
          <div>
            <p className="flex items-center gap-1.5 text-[13px] text-slate">
              <Icon icon={greeting.icon} size={15} />
              {greeting.text}
            </p>
            <h1 className="font-display text-[22px] font-bold text-ink">Welcome back</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StreakChip streak={streak} />
          <img src="/illustrations/happy.svg" alt="" className="h-10 w-10" />
        </div>
      </div>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        <StatTile label="Trips taken" value={String(trips.length)} tint="var(--accent-violet)" />
        <StatTile label="Total spent" value={formatCurrency(totalAcrossTrips, { symbol: summarySymbol })} tint="var(--action-primary)" />
      </div>

      <div className="px-5 pt-5">
        <Button
          onClick={() => {
            startNewTripFlow();
            navigate("/new-trip");
          }}
        >
          Start a new trip
        </Button>
      </div>

      <div className="mt-6 px-5 pb-6">
        <p className="mb-2 text-[13px] font-medium text-slate">Your trips</p>
        <div className="flex flex-col gap-2">
          {trips.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/summary/${t.id}`)}
              className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-left shadow-soft"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-action-primary">
                <Icon icon={Flag} size={16} />
              </span>
              <span className="flex-1">
                <p className="text-[14px] font-medium text-ink">{t.name}</p>
                <p className="text-[12px] text-slate">
                  {formatCurrency(totalSpent(t), { symbol: tripCurrencySymbol(t) })} spent ·{" "}
                  {t.status === "upcoming" ? "Upcoming" : t.status === "active" ? "Active" : "Completed"}
                </p>
              </span>
              <Icon icon={ChevronRight} size={16} className="text-slate" />
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </AppShell>
  );
}
