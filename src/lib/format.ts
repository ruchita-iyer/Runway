export function formatCurrency(amount: number, opts?: { sign?: boolean; symbol?: string }): string {
  const rounded = Math.round(amount * 100) / 100;
  const abs = Math.abs(rounded);
  const str = abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const symbol = opts?.symbol ?? "$";
  if (opts?.sign) {
    return rounded < 0 ? `-${symbol}${str}` : `${symbol}${str}`;
  }
  return `${symbol}${str}`;
}
