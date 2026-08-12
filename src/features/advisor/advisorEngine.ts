import {
  budgetStatus,
  daysLeft,
  effectiveBudget,
  loggingStreak,
  totalSpent,
  tripCurrencySymbol,
} from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import type { Trip } from "../../data/types";

const STATUS_LABEL: Record<string, string> = {
  onPace: "under budget",
  tight: "close to your budget",
  over: "over budget",
};

function extractAmount(text: string): number | null {
  const match = text.match(/\$?\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function findMentionedCategory(trip: Trip, text: string) {
  const lower = text.toLowerCase();
  return trip.categories.find((c) => lower.includes(c.name.toLowerCase())) ?? null;
}

function categorySpendLines(trip: Trip): string {
  const symbol = tripCurrencySymbol(trip);
  const total = totalSpent(trip) || 1;
  const rows = trip.categories
    .map((cat) => ({
      cat,
      amount: trip.expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0),
    }))
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  if (rows.length === 0) return "You haven't logged any expenses yet.";
  return rows
    .map((r) => `${r.cat.name}: ${formatCurrency(r.amount, { symbol })} (${Math.round((r.amount / total) * 100)}%)`)
    .join("\n");
}

function whatIfAnswer(trip: Trip, amount: number): string {
  const symbol = tripCurrencySymbol(trip);
  const budget = effectiveBudget(trip);
  const spent = totalSpent(trip);
  const left = budget - spent;
  const remaining = left - amount;

  if (remaining >= 0) {
    return `Yes — if you spend ${formatCurrency(amount, { symbol })} more, you'd still have ${formatCurrency(remaining, { symbol })} left of your ${formatCurrency(budget, { symbol })} budget.`;
  }
  return `That would put you ${formatCurrency(Math.abs(remaining), { symbol })} over your ${formatCurrency(budget, { symbol })} budget (you currently have ${formatCurrency(left, { symbol })} left).`;
}

function projectionAnswer(trip: Trip): string {
  const symbol = tripCurrencySymbol(trip);
  const budget = effectiveBudget(trip);
  const spent = totalSpent(trip);
  if (spent <= 0) return "You haven't logged any spending yet, so there's nothing to project from.";
  const diff = spent - budget;
  if (diff <= 0) {
    return `So far you've spent ${formatCurrency(spent, { symbol })} of your ${formatCurrency(budget, { symbol })} budget — ${formatCurrency(Math.abs(diff), { symbol })} of headroom left.`;
  }
  return `You've already spent ${formatCurrency(spent, { symbol })}, which is ${formatCurrency(diff, { symbol })} over your ${formatCurrency(budget, { symbol })} budget.`;
}

export function answerAdvisorQuestion(trip: Trip, question: string): string {
  const lower = question.toLowerCase();
  const symbol = tripCurrencySymbol(trip);
  const status = budgetStatus(trip);
  const budget = effectiveBudget(trip);
  const spent = totalSpent(trip);
  const left = budget - spent;

  const amount = extractAmount(lower);
  const isWhatIf = /spend|afford|splurge|what if|buy/.test(lower) && amount !== null;
  if (isWhatIf && amount !== null) return whatIfAnswer(trip, amount);

  if (/project|end of trip|finish|by the end|will i/.test(lower)) return projectionAnswer(trip);

  const mentionedCategory = findMentionedCategory(trip, lower);
  if (mentionedCategory) {
    const spentInCat = trip.expenses
      .filter((e) => e.categoryId === mentionedCategory.id)
      .reduce((s, e) => s + e.amount, 0);
    const total = spent || 1;
    return `You've spent ${formatCurrency(spentInCat, { symbol })} on ${mentionedCategory.name} so far — that's ${Math.round((spentInCat / total) * 100)}% of your total spend.`;
  }

  if (/categor|breakdown|where.*(spend|money|going)/.test(lower)) {
    return `Here's your spend by category:\n${categorySpendLines(trip)}`;
  }

  if (/budget|status|track|doing/.test(lower)) {
    return `You're ${STATUS_LABEL[status]}. You have ${formatCurrency(Math.max(left, 0), { symbol })} left of your ${formatCurrency(budget, { symbol })} budget.`;
  }

  if (/streak/.test(lower)) {
    const streak = loggingStreak(trip);
    return streak > 0
      ? `You're on a ${streak}-day logging streak. Log something today to keep it going.`
      : "No active streak right now — log an expense today to start one.";
  }

  if (/days left|how many days|left.*trip/.test(lower)) {
    return `You have ${daysLeft(trip)} day${daysLeft(trip) === 1 ? "" : "s"} left on this trip.`;
  }

  if (/total/.test(lower)) {
    return `Your total budget is ${formatCurrency(budget, { symbol })}. You've spent ${formatCurrency(spent, { symbol })} so far, with ${formatCurrency(Math.max(left, 0), { symbol })} left.`;
  }

  if (/spent|spend so far/.test(lower)) {
    return `You've spent ${formatCurrency(spent, { symbol })} of your ${formatCurrency(budget, { symbol })} budget so far.`;
  }

  if (/left|remaining/.test(lower)) {
    return `You have ${formatCurrency(Math.max(left, 0), { symbol })} left of your ${formatCurrency(budget, { symbol })} budget.`;
  }

  if (/hi|hello|hey/.test(lower)) {
    return `Hey! Ask me things like "how much do I have left?", "what if I spend $50 more?", or "where's my money going?".`;
  }

  return `I can help with your budget, category spend, or "what if" spending questions — try asking "how much do I have left?" or "what if I spend $30 more?".`;
}
