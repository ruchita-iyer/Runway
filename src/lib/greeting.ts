import { Sun, Sunrise, Sunset, Moon } from "../components/ui/IconIndex";
import type { LucideIcon } from "lucide-react";

export function timeGreeting(date: Date = new Date()): { text: string; icon: LucideIcon } {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return { text: "Good morning", icon: Sunrise };
  if (hour >= 12 && hour < 17) return { text: "Good afternoon", icon: Sun };
  if (hour >= 17 && hour < 21) return { text: "Good evening", icon: Sunset };
  return { text: "Good night", icon: Moon };
}
