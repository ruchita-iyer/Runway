// Single source of truth for color tokens. Tailwind reads these via CSS vars
// (see styles/globals.css) so light/dark is a class toggle, not a duplicated palette.
import type { Category, PaceStatus } from "../data/types";

export const paceLight = {
  teal: "#3FA35C",
  gold: "#E0A337",
  berry: "#E0393B",
};

export const paceDark = {
  teal: "#4FC773",
  gold: "#F0BC5C",
  berry: "#FF5C5C",
};

export const actionLight = "#F2653C";
export const actionDark = "#FF7A52";

export const accentLight = "#C0673F";
export const accentDark = "#D68A63";

export const neutralsLight = {
  canvas: "#FBF3EA",
  surface: "#FFFFFF",
  ink: "#241C15",
  slate: "#8F8071",
  hairline: "#EDE1D3",
};

export const neutralsDark = {
  canvas: "#1C1410",
  surface: "#2A2019",
  ink: "#F6EDE2",
  slate: "#B3A494",
  hairline: "#3C2F24",
};

// Category breakdown palette — deliberately its own set, never the pace ramp.
export const categoryPalette = [
  "#F2A65A", // marigold
  "#E8734A", // coral terracotta
  "#C1533D", // rust
  "#D9A441", // mustard
  "#B98066", // clay rose
  "#8C7A6B", // warm taupe
];

export type { PaceStatus };

export function paceColorVar(status: PaceStatus): string {
  if (status === "onPace") return "var(--pace-teal)";
  if (status === "tight") return "var(--pace-gold)";
  return "var(--pace-berry)";
}

/** Same category → color assignment used by the summary breakdown chart, reused for icon badges. */
export function categoryColor(categories: Category[], categoryId: string): string {
  const i = categories.findIndex((c) => c.id === categoryId);
  return categoryPalette[(i < 0 ? 0 : i) % categoryPalette.length];
}

/** Glossy gradient fill for a category badge — a lighter tint of `color` sliding into `color`. */
export function categoryGradient(color: string): string {
  return `linear-gradient(135deg, color-mix(in srgb, ${color} 80%, white), ${color})`;
}
