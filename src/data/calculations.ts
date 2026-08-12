import { addDaysISO, dayNumberFor as rawDayNumberFor, daysBetween, todayISO } from "../lib/date";
import type { PaceStatus, ScreenState, Trip } from "./types";

export function tripEndDateISO(trip: Trip): string {
  return addDaysISO(trip.startDate, trip.durationDays - 1);
}

/** "Today" for this trip's math — the real date, unless overridden by a day-advance control. */
export function effectiveToday(trip: Trip): string {
  return trip.simulatedTodayISO ?? todayISO();
}

export function currentDayNumber(trip: Trip, asOfISO: string = effectiveToday(trip)): number {
  return rawDayNumberFor(trip.startDate, trip.durationDays, asOfISO);
}

export function isTripEnded(trip: Trip, asOfISO: string = effectiveToday(trip)): boolean {
  return daysBetween(tripEndDateISO(trip), asOfISO) > 0;
}

export function resolveScreenState(
  trip: Trip | null,
  asOfISO: string = trip ? effectiveToday(trip) : todayISO(),
): ScreenState {
  if (!trip) return "empty";
  if (trip.status === "upcoming") return "upcoming";
  if (trip.status === "complete") return "complete";
  if (isTripEnded(trip, asOfISO)) return "complete";
  return "active";
}

export function effectiveBudget(trip: Trip): number {
  return trip.overshootRaisedBudget ?? trip.totalBudget;
}

export function tripCurrencySymbol(trip: Trip): string {
  return trip.currency?.symbol ?? "$";
}

export function totalSpent(trip: Trip): number {
  return trip.expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function spentOnDay(trip: Trip, day: number): number {
  return trip.expenses.filter((e) => e.dayNumber === day).reduce((sum, e) => sum + e.amount, 0);
}

/** 0..1 fraction of the whole-trip budget spent so far, clamped for arc rendering. */
export function budgetFraction(trip: Trip): number {
  const budget = effectiveBudget(trip);
  if (budget <= 0) return 1;
  return Math.min(Math.max(totalSpent(trip) / budget, 0), 1);
}

/** Whole-trip budget status — replaces the old per-day pace status with the same 3-bucket semantics/colors. */
export function budgetStatus(trip: Trip): PaceStatus {
  const budget = effectiveBudget(trip);
  if (budget <= 0) return "over";
  const ratio = totalSpent(trip) / budget;
  if (ratio > 1) return "over";
  if (ratio >= 0.9) return "tight";
  return "onPace";
}

export function isOvershoot(trip: Trip): boolean {
  return totalSpent(trip) > effectiveBudget(trip);
}

export function shouldPromptOvershoot(trip: Trip): boolean {
  return isOvershoot(trip) && !trip.overshootAcknowledged;
}

export function daysLeft(trip: Trip, asOfISO: string = effectiveToday(trip)): number {
  const day = currentDayNumber(trip, asOfISO);
  return Math.max(trip.durationDays - day, 0);
}

/** Calendar date (ISO) that a given 1-indexed trip day falls on. */
export function tripDateForDay(trip: Trip, day: number): string {
  return addDaysISO(trip.startDate, day - 1);
}

/**
 * Consecutive days, counting back from today, with at least one expense logged. Deliberately
 * independent of budget status — a day you overspent on still counts as a logged day, so an
 * overshoot doesn't zero out the streak the way missing a day of logging does.
 */
export function loggingStreak(trip: Trip, asOfISO: string = effectiveToday(trip)): number {
  const today = currentDayNumber(trip, asOfISO);
  let streak = 0;
  for (let d = today; d >= 1; d--) {
    const logged = spentOnDay(trip, d) > 0;
    if (!logged) {
      if (d === today) continue; // today isn't over yet — don't penalize before it ends
      break;
    }
    streak++;
  }
  return streak;
}

/** Longest run of consecutive logged days across the trip's history so far (not just the trailing streak). */
export function longestLoggingStreak(trip: Trip): number {
  const today = currentDayNumber(trip);
  let longest = 0;
  let current = 0;
  for (let d = 1; d <= today; d++) {
    if (spentOnDay(trip, d) > 0) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

const MILESTONE_THRESHOLDS = [25, 50, 75, 100];

/** Highest trip-duration percentage threshold (25/50/75/100) that `day` has just reached, or null. */
export function milestoneForDay(day: number, durationDays: number): number | null {
  if (durationDays <= 0) return null;
  const pct = (day / durationDays) * 100;
  const reached = MILESTONE_THRESHOLDS.filter((t) => pct >= t);
  return reached.length > 0 ? reached[reached.length - 1] : null;
}
