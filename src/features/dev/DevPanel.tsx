import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";
import { useTripData } from "../../data/useTripData";

export function DevPanel() {
  const navigate = useNavigate();
  const { state, activeTrip, devAdvanceDay, devClearAll, devSeedDemoTrip } = useTripData();

  return (
    <AppShell>
      <div className="flex flex-col gap-4 px-5 pt-6">
        <h1 className="font-display text-[20px] font-bold text-ink">Dev tools</h1>
        <p className="text-[13px] text-slate">
          Hidden debug panel for testing rollover / overshoot / trip-complete states without waiting real days.
        </p>

        <Button
          onClick={() => {
            devSeedDemoTrip();
            navigate("/home");
          }}
        >
          Seed demo trip (Lisbon)
        </Button>
        <Button variant="secondary" onClick={devAdvanceDay} disabled={!activeTrip}>
          Advance active trip by 1 day
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            devClearAll();
            navigate("/home");
          }}
        >
          Clear all data
        </Button>

        <div className="mt-4 rounded-xl border border-hairline bg-surface p-3">
          <p className="mb-1 text-[12px] font-medium uppercase text-slate">Active trip</p>
          <pre className="tabular whitespace-pre-wrap break-all text-[11px] text-ink">
            {activeTrip ? JSON.stringify({ ...activeTrip, expenses: activeTrip.expenses.length }, null, 2) : "none"}
          </pre>
          <p className="mb-1 mt-3 text-[12px] font-medium uppercase text-slate">Trips</p>
          <p className="text-[12px] text-ink">{state.trips.length} total</p>
        </div>

        <Button variant="ghost" onClick={() => navigate(-1)}>
          Close
        </Button>
      </div>
    </AppShell>
  );
}
