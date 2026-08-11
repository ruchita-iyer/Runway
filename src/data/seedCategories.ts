import { createId } from "../lib/id";
import type { Category } from "./types";

export const DEFAULT_CATEGORY_DEFS = [
  { name: "Food", icon: "food" },
  { name: "Stay", icon: "stay" },
  { name: "Transport", icon: "transport" },
  { name: "Activities", icon: "activities" },
  { name: "Other", icon: "other" },
] as const;

export function defaultCategoriesFor(tripId: string): Category[] {
  return DEFAULT_CATEGORY_DEFS.map((def) => ({
    id: createId("cat"),
    tripId,
    name: def.name,
    icon: def.icon,
    isDefault: true,
  }));
}
