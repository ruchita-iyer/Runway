export function StatTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex-1 rounded-xl bg-surface px-3 py-3 shadow-soft">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate">{label}</p>
      <p
        className="tabular mt-1 font-display text-[19px] font-semibold"
        style={{ color: accent ? "var(--action-primary)" : "var(--ink)" }}
      >
        {value}
      </p>
    </div>
  );
}
