// Dial is a circle with its stroke restricted to a visible arc span (via Framer Motion's
// pathLength), leaving a gap at the bottom — reinforces "not a closed loop / balance."
export const DIAL_ARC_SPAN_DEG = 280;
export const DIAL_GAP_DEG = 360 - DIAL_ARC_SPAN_DEG;
// Rotate so the gap is centered at the bottom (90deg in SVG circle-transform space).
export const DIAL_ROTATION_DEG = 90 + DIAL_GAP_DEG / 2;

export const SPAN_FRACTION = DIAL_ARC_SPAN_DEG / 360;

/** Point on the dial arc at `fraction` (0..1) of the visible span, used as the bead's landing target. */
export function pointAtFraction(cx: number, cy: number, r: number, fraction: number) {
  const clamped = Math.min(Math.max(fraction, 0), 1);
  const angleDeg = DIAL_ROTATION_DEG + DIAL_ARC_SPAN_DEG * clamped;
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
