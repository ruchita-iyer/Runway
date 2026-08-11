const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Whole calendar days between two ISO dates (b - a). */
export function daysBetween(aISO: string, bISO: string): number {
  const a = parseISO(aISO);
  const b = parseISO(bISO);
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/** 1-indexed day number of `dateISO` relative to a trip's start date, clamped to [1, durationDays]. */
export function dayNumberFor(startDateISO: string, durationDays: number, dateISO: string): number {
  const diff = daysBetween(startDateISO, dateISO) + 1;
  return Math.min(Math.max(diff, 1), durationDays);
}

export function addDaysISO(iso: string, days: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function formatShortDate(iso: string): string {
  const d = parseISO(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
