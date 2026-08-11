import { AnimatePresence, motion } from "framer-motion";

const COLORS = [
  "var(--action-primary)",
  "var(--category-1)",
  "var(--pace-gold)",
  "var(--action-primary)",
  "var(--category-4)",
  "var(--accent-violet)",
  "var(--action-primary)",
  "var(--category-2)",
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const distance = 90 + (i % 3) * 30;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    color: COLORS[i % COLORS.length],
    isSquare: i % 2 === 0,
    delay: (i % 4) * 0.02,
  };
});

export function Celebration({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          {PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 1, rotate: p.isSquare ? 180 : -180 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
              className="absolute"
              style={{
                width: p.isSquare ? 7 : 8,
                height: p.isSquare ? 7 : 8,
                backgroundColor: p.color,
                borderRadius: p.isSquare ? 2 : "50%",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
