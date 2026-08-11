import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { BottomNav } from "../../layout/BottomNav";
import { Icon, Sun, Moon, ChevronRight } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { formatCurrency } from "../../lib/format";
import { totalSpent } from "../../data/calculations";

export function AccountScreen() {
  const navigate = useNavigate();
  const { state, activeTrip, setActiveTrip, toggleDarkMode, startNewTripFlow } = useTripData();

  const pastTrips = state.trips.filter((t) => t.status === "complete");
  const currentActiveTrip = activeTrip && activeTrip.status === "active" ? activeTrip : null;
  const otherActive = state.trips.filter((t) => t.status === "active" && t.id !== activeTrip?.id);

  return (
    <AppShell withNav>
      <div className="px-5 pt-6">
        <h1 className="font-display text-[20px] font-bold text-ink">Account</h1>
      </div>

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
