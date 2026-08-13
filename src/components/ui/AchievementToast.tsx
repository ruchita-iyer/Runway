import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./IconIndex";
import { ACHIEVEMENT_DEFS } from "../../data/achievements";
import { useTripData } from "../../data/useTripData";

const AUTO_DISMISS_MS = 3200;

export function AchievementToast() {
  const { newlyUnlockedAchievementId, dismissAchievementToast } = useTripData();
  const achievement = ACHIEVEMENT_DEFS.find((a) => a.id === newlyUnlockedAchievementId) ?? null;

  useEffect(() => {
    if (!achievement) return;
    const t = setTimeout(dismissAchievementToast, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievement?.id]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={dismissAchievementToast}
          className="pointer-events-auto absolute inset-x-5 top-4 z-[60] flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-soft"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: "linear-gradient(155deg, var(--action-primary), var(--pace-gold))" }}
          >
            <Icon icon={achievement.icon} size={19} />
          </span>
          <span>
            <p className="text-[13px] font-semibold text-ink">New badge unlocked!</p>
            <p className="text-[12px] text-slate">{achievement.label}</p>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
