import type { LucideIcon } from "lucide-react";
import { Award, Flame, Trophy, Target } from "../components/ui/IconIndex";
import { isOvershoot, longestLoggingStreak } from "./calculations";
import type { AppState } from "./types";

export interface AchievementDef {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: "first-log", label: "First log", icon: Award, description: "Log your first expense on any trip." },
  { id: "streak-3", label: "3-day streak", icon: Flame, description: "Log an expense 3 days in a row." },
  { id: "multi-tripper", label: "Multi-tripper", icon: Trophy, description: "Start a second trip." },
  { id: "never-overshot", label: "Never overshot", icon: Target, description: "Finish every trip without going over budget." },
];

/** Ids of every achievement currently earned, derived purely from trip history. */
export function unlockedAchievementIds(state: AppState): string[] {
  const totalExpenses = state.trips.reduce((sum, t) => sum + t.expenses.length, 0);
  const bestStreak = state.trips.reduce((max, t) => Math.max(max, longestLoggingStreak(t)), 0);
  const neverOvershot = state.trips.length > 0 && state.trips.every((t) => !isOvershoot(t));

  const ids: string[] = [];
  if (totalExpenses > 0) ids.push("first-log");
  if (bestStreak >= 3) ids.push("streak-3");
  if (state.trips.length >= 2) ids.push("multi-tripper");
  if (neverOvershot) ids.push("never-overshot");
  return ids;
}
