import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Icon,
  X,
  Settings,
  UserPlus,
  Users,
  SlidersHorizontal,
  HelpCircle,
  LogIn,
} from "../../components/ui/IconIndex";
import type { LucideIcon } from "lucide-react";

const ITEMS: { label: string; path: string; icon: LucideIcon }[] = [
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Refer a friend", path: "/refer-a-friend", icon: UserPlus },
  { label: "Add buddies to trip", path: "/buddies", icon: Users },
  { label: "Preferences", path: "/preferences", icon: SlidersHorizontal },
  { label: "Help", path: "/help", icon: HelpCircle },
  { label: "Create a login", path: "/login", icon: LogIn },
];

export function HamburgerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/40"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-0 z-50 flex w-[78%] max-w-[300px] flex-col bg-canvas px-5 pb-8 pt-6 shadow-soft"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-[17px] font-bold text-ink">Menu</h2>
              <button onClick={onClose} className="text-slate">
                <Icon icon={X} size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {ITEMS.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onClose();
                    navigate(item.path);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left active:bg-surface"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-action-primary shadow-soft">
                    <Icon icon={item.icon} size={17} />
                  </span>
                  <span className="text-[14px] font-medium text-ink">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
