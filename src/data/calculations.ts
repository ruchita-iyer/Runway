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
  if (trip.status === "complete") return "complete";
  if (isTripEnded(trip, asOfISO)) return "complete";
  return "active";
}

export function effectiveBudget(trip: Trip): number {
  return trip.overshootRaisedBudget ?? trip.totalBudget;
}

export function totalSpent(trip: Trip): number {
  return trip.expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function spentThroughDay(trip: Trip, day: number): number {
  return trip.expenses.filter((e) => e.dayNumber <= day).reduce((sum, e) => sum + e.amount, 0);
}

export function spentOnDay(trip: Trip, day: number): number {
  return trip.expenses.filter((e) => e.dayNumber === day).reduce((sum, e) => sum + e.amount, 0);
}

export function dailyAllowanceBase(trip: Trip): number {
  return effectiveBudget(trip) / trip.durationDays;
}

/** Core dial metric: how much of the prorated-to-date budget remains after all spending so far. */
export function dollarsLeftToday(trip: Trip, asOfISO: string = effectiveToday(trip)): number {
  const day = currentDayNumber(trip, asOfISO);
  const budgetThroughToday = dailyAllowanceBase(trip) * day;
  return budgetThroughToday - spentThroughDay(trip, day);
}

/** 0..1 fraction of today's base allowance remaining, clamped for arc rendering. */
export function dialFraction(trip: Trip, asOfISO: string = effectiveToday(trip)): number {
  const base = dailyAllowanceBase(trip);
  if (base <= 0) return 0;
  const ratio = dollarsLeftToday(trip, asOfISO) / base;
  return Math.min(Math.max(ratio, 0), 1);
}

export function paceStatus(trip: Trip, asOfISO: string = effectiveToday(trip)): PaceStatus {
  const base = dailyAllowanceBase(trip);
  if (base <= 0) return "over";
  const ratio = dollarsLeftToday(trip, asOfISO) / base;
  if (ratio < 0) return "over";
  if (ratio < 0.34) return "tight";
  return "onPace";
}

export function paceStatusForDay(trip: Trip, day: number): PaceStatus {
  const base = dailyAllowanceBase(trip);
  if (base <= 0) return "over";
  const budgetThroughDay = base * day;
  const leftAtDay = budgetThroughDay - spentThroughDay(trip, day);
  const ratio = leftAtDay / base;
  if (ratio < 0) return "over";
  if (ratio < 0.34) return "tight";
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
