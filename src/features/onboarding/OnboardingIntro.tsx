import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";

const AUTO_ADVANCE_MS = 1800;

const SPARKLES = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * Math.PI * 2;
  const distance = 70 + (i % 2) * 20;
  return { id: i, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, delay: 0.5 + i * 0.06 };
});

const WORDMARK = "Runway";

/** First-launch-only splash. Auto-advances into the tutorial carousel; tap skips ahead. */
export function OnboardingIntro() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/tutorial", { replace: true }), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <AppShell className="bg-white">
      <button
        onClick={() => navigate("/tutorial", { replace: true })}
        aria-label="Skip intro"
        className="flex h-full w-full flex-col items-center justify-center gap-5 text-center"
      >
        <div className="relative flex h-56 w-56 items-center justify-center">
          {SPARKLES.map((s) => (
            <motion.span
              key={s.id}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0, 1, 0.6] }}
              transition={{ duration: 1.1, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
              className="absolute h-1.5 w-1.5 rounded-full bg-action-primary"
            />
          ))}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
            className="h-48 w-48"
          >
            <img src="/illustrations/happy.svg" alt="" className="h-full w-full" />
          </motion.div>
        </div>

        <div className="flex overflow-hidden">
          {WORDMARK.split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[32px] font-bold text-ink"
            >
              {ch}
            </motion.span>
          ))}
        </div>
      </button>
    </AppShell>
  );
}
