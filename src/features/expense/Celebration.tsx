import { AnimatePresence, motion } from "framer-motion";

const COLORS = [
  "var(--action-primary)",
  "var(--category-1)",
  "var(--pace-gold)",
  "var(--pace-teal)",
  "var(--category-4)",
  "var(--accent-violet)",
  "var(--category-2)",
];

const SPARK_COUNT = 28;
const MAX_DELAY = 0.12;
const SPARK_DURATION = 0.85;
/** Total time (seconds) for the last spark to finish — keep any caller's auto-close timer in sync with this. */
export const CELEBRATION_DURATION_S = MAX_DELAY + SPARK_DURATION;
export const CELEBRATION_DURATION_MS = CELEBRATION_DURATION_S * 1000;

const SPARKS = Array.from({ length: SPARK_COUNT }, (_, i) => {
  // Jittered angle so sparks don't line up in a perfect fan.
  const angle = (i / SPARK_COUNT) * 360 + (((i * 37) % 17) - 8);
  const rad = (angle * Math.PI) / 180;
  const distance = 130 + ((i * 53) % 70); // 130-200px — spans most of a 390px-wide phone screen
  return {
    id: i,
    angleDeg: angle,
    x: Math.cos(rad) * distance,
    y: Math.sin(rad) * distance,
    fallExtra: 30 + (i % 4) * 12, // gravity drift added on top of the radial travel
    color: COLORS[i % COLORS.length],
    length: 9 + (i % 3) * 4,
    delay: ((i * 29) % 12) * (MAX_DELAY / 12),
  };
});

export function Celebration({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.6, scale: 0.3 }}
            animate={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute h-20 w-20 rounded-full border-2"
            style={{ borderColor: "var(--pace-teal)" }}
          />
          {SPARKS.map((s) => (
            <motion.span
              key={s.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
              animate={{
                x: [0, s.x * 0.55, s.x],
                y: [0, s.y * 0.55, s.y + s.fallExtra],
                opacity: [1, 1, 0],
                scale: [0.4, 1, 0.7],
              }}
              transition={{
                duration: SPARK_DURATION,
                delay: s.delay,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.4, 1],
              }}
              className="absolute rounded-full"
              style={{
                width: 3,
                height: s.length,
                backgroundColor: s.color,
                rotate: `${s.angleDeg + 90}deg`,
                transformOrigin: "center",
                boxShadow: `0 0 4px ${s.color}`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
