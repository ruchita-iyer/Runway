export function formatCurrency(amount: number, opts?: { sign?: boolean }): string {
  const rounded = Math.round(amount * 100) / 100;
  const abs = Math.abs(rounded);
  const str = abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (opts?.sign) {
    return rounded < 0 ? `-$${str}` : `$${str}`;
  }
  return `$${str}`;
}
