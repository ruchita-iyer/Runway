export function StatTile({ label, value, tint }: { label: string; value: string; tint?: string }) {
  return (
    <div
      className="flex-1 rounded-xl px-3 py-3 shadow-soft"
      style={{ background: tint ? `color-mix(in srgb, ${tint} 16%, var(--surface))` : "var(--surface)" }}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate">{label}</p>
      <p
        className="tabular mt-1 font-display text-[19px] font-semibold"
        style={{ color: tint ?? "var(--ink)" }}
      >
        {value}
      </p>
    </div>
  );
}
