import {
  currentDayNumber,
  dailyAllowanceBase,
  daysLeft,
  dollarsLeftToday,
  effectiveBudget,
  loggingStreak,
  paceStatus,
  spentOnDay,
  totalSpent,
} from "../../data/calculations";
import { formatCurrency } from "../../lib/format";
import type { Trip } from "../../data/types";

const PACE_LABEL: Record<string, string> = {
  onPace: "on pace",
  tight: "cutting it tight",
  over: "over pace",
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
    .map((r) => `${r.cat.name}: ${formatCurrency(r.amount)} (${Math.round((r.amount / total) * 100)}%)`)
    .join("\n");
}

function whatIfAnswer(trip: Trip, amount: number): string {
  const left = dollarsLeftToday(trip);
  const remaining = left - amount;
  const projectedTotal = totalSpent(trip) + amount;
  const budget = effectiveBudget(trip);

  if (remaining >= 0) {
    return `Yes — if you spend ${formatCurrency(amount)} more today, you'd still have ${formatCurrency(remaining)} left in today's allowance. Total trip spend would be ${formatCurrency(projectedTotal)} of your ${formatCurrency(budget)} budget.`;
  }
  return `That would put you ${formatCurrency(Math.abs(remaining))} over today's allowance (you currently have ${formatCurrency(left)} left today). Total trip spend would reach ${formatCurrency(projectedTotal)} against your ${formatCurrency(budget)} budget — you'd want to pull back on other days to stay on pace.`;
}

function projectionAnswer(trip: Trip): string {
  const day = currentDayNumber(trip);
  const budget = effectiveBudget(trip);
  const spent = totalSpent(trip);
  if (day <= 0) return "Your trip hasn't started yet, so there's no spend to project from.";
  const avgPerDay = spent / day;
  const projectedTotal = avgPerDay * trip.durationDays;
  const diff = projectedTotal - budget;
  if (diff <= 0) {
    return `At your current rate of ${formatCurrency(avgPerDay)}/day, you're projected to finish the trip at ${formatCurrency(projectedTotal)} — ${formatCurrency(Math.abs(diff))} under your ${formatCurrency(budget)} budget.`;
  }
  return `At your current rate of ${formatCurrency(avgPerDay)}/day, you're projected to finish at ${formatCurrency(projectedTotal)} — ${formatCurrency(diff)} over your ${formatCurrency(budget)} budget if nothing changes.`;
}

export function answerAdvisorQuestion(trip: Trip, question: string): string {
  const lower = question.toLowerCase();
  const day = currentDayNumber(trip);
  const status = paceStatus(trip);

  const amount = extractAmount(lower);
  const isWhatIf = /spend|afford|splurge|what if|buy/.test(lower) && amount !== null;
  if (isWhatIf && amount !== null) return whatIfAnswer(trip, amount);

  if (/project|end of trip|finish|by the end|will i/.test(lower)) return projectionAnswer(trip);

  const mentionedCategory = findMentionedCategory(trip, lower);
  if (mentionedCategory) {
    const spentInCat = trip.expenses
      .filter((e) => e.categoryId === mentionedCategory.id)
      .reduce((s, e) => s + e.amount, 0);
    const total = totalSpent(trip) || 1;
    return `You've spent ${formatCurrency(spentInCat)} on ${mentionedCategory.name} so far — that's ${Math.round((spentInCat / total) * 100)}% of your total spend.`;
  }

  if (/categor|breakdown|where.*(spend|money|going)/.test(lower)) {
    return `Here's your spend by category:\n${categorySpendLines(trip)}`;
  }

  if (/pace|runrate|run rate|on track|doing|status/.test(lower)) {
    const left = dollarsLeftToday(trip);
    return `You're ${PACE_LABEL[status]} on Day ${day} of ${trip.durationDays}. You have ${formatCurrency(left)} left in today's allowance.`;
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

  if (/today/.test(lower)) {
    return `You have ${formatCurrency(dollarsLeftToday(trip))} left today, out of a ${formatCurrency(dailyAllowanceBase(trip))} daily allowance. You've spent ${formatCurrency(spentOnDay(trip, day))} today.`;
  }

  if (/budget|total/.test(lower)) {
    return `Your total budget is ${formatCurrency(effectiveBudget(trip))} across ${trip.durationDays} days (${formatCurrency(dailyAllowanceBase(trip))}/day). You've spent ${formatCurrency(totalSpent(trip))} so far.`;
  }

  if (/spent|spend so far/.test(lower)) {
    return `You've spent ${formatCurrency(totalSpent(trip))} of your ${formatCurrency(effectiveBudget(trip))} budget so far.`;
  }

  if (/hi|hello|hey/.test(lower)) {
    return `Hey! Ask me things like "am I on pace?", "what if I spend $50 more today?", or "where's my money going?".`;
  }

  return `I can help with your pace, budget, category spend, or "what if" spending questions — try asking "am I on pace?" or "what if I spend $30 more today?".`;
}
