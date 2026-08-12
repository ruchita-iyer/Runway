import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AppShell } from "../../layout/AppShell";
import { BottomNav } from "../../layout/BottomNav";
import { Icon, Sun, Moon, ChevronRight, Flame, Trophy, Award, Target, Lock } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { formatCurrency } from "../../lib/format";
import { isOvershoot, longestLoggingStreak, loggingStreak, onPaceStreak, totalSpent } from "../../data/calculations";

const XP_PER_LEVEL = 200;

export function AccountScreen() {
  const navigate = useNavigate();
  const { state, activeTrip, setActiveTrip, toggleDarkMode, startNewTripFlow } = useTripData();

  const pastTrips = state.trips.filter((t) => t.status === "complete");
  const currentActiveTrip = activeTrip && activeTrip.status === "active" ? activeTrip : null;
  const otherActive = state.trips.filter((t) => t.status === "active" && t.id !== activeTrip?.id);

  const totalExpenses = state.trips.reduce((sum, t) => sum + t.expenses.length, 0);
  const bestStreak = state.trips.reduce((max, t) => Math.max(max, longestLoggingStreak(t)), 0);
  const currentStreak = currentActiveTrip ? loggingStreak(currentActiveTrip) : 0;
  const currentPaceStreak = currentActiveTrip ? onPaceStreak(currentActiveTrip) : 0;
  const neverOvershot = state.trips.length > 0 && state.trips.every((t) => !isOvershoot(t));

  const xp = totalExpenses * 10 + bestStreak * 15;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;

  const achievements = [
    { icon: Award, label: "First log", unlocked: totalExpenses > 0 },
    { icon: Flame, label: "3-day streak", unlocked: bestStreak >= 3 },
    { icon: Trophy, label: "Multi-tripper", unlocked: state.trips.length >= 2 },
    { icon: Target, label: "Never overshot", unlocked: neverOvershot },
  ];

  const challenges = [
    {
      label: "Log 5 expenses this trip",
      progress: currentActiveTrip ? Math.min(currentActiveTrip.expenses.length, 5) / 5 : 0,
      detail: currentActiveTrip ? `${Math.min(currentActiveTrip.expenses.length, 5)}/5` : "0/5",
    },
    {
      label: "Stay on pace 3 days in a row",
      progress: Math.min(currentPaceStreak, 3) / 3,
      detail: `${Math.min(currentPaceStreak, 3)}/3`,
    },
  ];

  return (
    <AppShell withNav>
      <div className="px-5 pt-6">
        <h1 className="font-display text-[20px] font-bold text-ink">Account</h1>
      </div>

      <Section title="Progress">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-semibold text-ink">Level {level}</span>
            <span className="text-slate">
              {xpIntoLevel} / {XP_PER_LEVEL} XP
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-hairline/50">
            <div
              className="h-full rounded-pill bg-action-primary transition-all"
              style={{ width: `${(xpIntoLevel / XP_PER_LEVEL) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pace-teal/12 text-pace-teal">
            <Icon icon={Flame} size={19} />
          </span>
          <div>
            <p className="text-[14px] font-medium text-ink">{currentStreak} day streak</p>
            <p className="text-[12px] text-slate">
              {bestStreak > 0 ? `Longest streak: ${bestStreak} days` : "Log an expense to start a streak"}
            </p>
          </div>
        </div>

        <div className="px-4 py-3">
          <p className="mb-2 text-[12px] font-medium text-slate">Achievements</p>
          <div className="grid grid-cols-4 gap-2">
            {achievements.map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1.5 text-center">
                <span
                  className={clsx(
                    "flex h-11 w-11 items-center justify-center rounded-full",
                    a.unlocked ? "bg-action-primary/12 text-action-primary" : "bg-hairline/40 text-slate",
                  )}
                >
                  <Icon icon={a.unlocked ? a.icon : Lock} size={17} />
                </span>
                <span className="text-[10px] leading-tight text-slate">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3">
          <p className="mb-2 text-[12px] font-medium text-slate">Challenges</p>
          <div className="flex flex-col gap-3">
            {challenges.map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="text-ink">{c.label}</span>
                  <span className="tabular text-slate">{c.detail}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-pill bg-hairline/50">
                  <div
                    className="h-full rounded-pill bg-pace-teal transition-all"
                    style={{ width: `${c.progress * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {(otherActive.length > 0 || currentActiveTrip) && (
        <Section title="Trips">
          {currentActiveTrip && (
            <Row label={currentActiveTrip.name} sub="Active trip" active />
          )}
          {otherActive.map((t) => (
            <button key={t.id} onClick={() => setActiveTrip(t.id)} className="w-full text-left">
              <Row label={t.name} sub="Switch to this trip" />
            </button>
          ))}
          <button
            onClick={() => {
              startNewTripFlow();
              navigate("/new-trip");
            }}
            className="w-full text-left"
          >
            <Row label="Start a new trip" sub="" icon={<Icon icon={ChevronRight} size={16} />} />
          </button>
        </Section>
      )}

      <Section title="Appearance">
        <button onClick={toggleDarkMode} className="flex w-full items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 text-[14px] text-ink">
            <Icon icon={state.darkMode ? Moon : Sun} size={17} />
            Dark mode
          </span>
          <span
            className="flex h-6 w-11 items-center rounded-pill px-0.5 transition-colors"
            style={{ backgroundColor: state.darkMode ? "var(--action-primary)" : "var(--hairline)" }}
          >
            <span
              className="h-5 w-5 rounded-full bg-white transition-transform"
              style={{ transform: state.darkMode ? "translateX(20px)" : "translateX(0)" }}
            />
          </span>
        </button>
      </Section>

      <Section title="Past trips">
        {pastTrips.length === 0 && <p className="px-4 py-4 text-[13px] text-slate">No past trips yet.</p>}
        {pastTrips.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/summary/${t.id}`)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span>
              <p className="text-[14px] font-medium text-ink">{t.name}</p>
              <p className="text-[12px] text-slate">{formatCurrency(totalSpent(t))} spent</p>
            </span>
            <Icon icon={ChevronRight} size={16} className="text-slate" />
          </button>
        ))}
      </Section>

      <BottomNav />
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-5 mt-5 rounded-2xl bg-surface shadow-soft">
      <p className="px-4 pt-3 text-[11px] font-medium uppercase tracking-wide text-slate">{title}</p>
      <div className="divide-y divide-hairline">{children}</div>
    </div>
  );
}

function Row({ label, sub, active, icon }: { label: string; sub: string; active?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span>
        <p className="text-[14px] font-medium text-ink">{label}</p>
        {sub && <p className="text-[12px] text-slate">{sub}</p>}
      </span>
      {active ? <span className="h-2 w-2 rounded-full bg-action-primary" /> : icon}
    </div>
  );
}
