import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Icon, Plus } from "../components/ui/IconIndex";
import { NAV_TABS } from "./navTabs";

const LEFT_TABS = NAV_TABS.slice(0, 2);
const RIGHT_TABS = NAV_TABS.slice(2);

const SPARK_COUNT = 6;

/** Brief radial spark burst behind a tapped nav icon. Remounted (via `key`) on every tap so it replays. */
function NavSpark() {
  return (
    <span className="pointer-events-none absolute inset-0">
      {Array.from({ length: SPARK_COUNT }, (_, i) => {
        const angle = (i / SPARK_COUNT) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: 0, x: Math.cos(angle) * 16, y: Math.sin(angle) * 16, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-action-primary"
          />
        );
      })}
    </span>
  );
}

export function BottomNav({ onLogExpense }: { onLogExpense?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sparkTab, setSparkTab] = useState<string | null>(null);
  const [sparkNonce, setSparkNonce] = useState(0);

  const handleTap = (path: string) => {
    setSparkTab(path);
    setSparkNonce((n) => n + 1);
    navigate(path);
  };

  const renderTab = (tab: (typeof LEFT_TABS)[number]) => {
    const active = location.pathname === tab.path;
    return (
      <button
        key={tab.path}
        onClick={() => handleTap(tab.path)}
        className="flex flex-col items-center gap-1 px-3 py-1"
      >
        <span className="relative flex h-[22px] w-[22px] items-center justify-center">
          {sparkTab === tab.path && <NavSpark key={sparkNonce} />}
          <Icon icon={tab.icon} size={22} className={clsx(active ? "text-action-primary" : "text-slate")} />
        </span>
        <span className={clsx("text-[11px] font-medium", active ? "text-action-primary" : "text-slate")}>
          {tab.label}
        </span>
      </button>
    );
  };

  return (
    <nav
      className={clsx(
        "absolute inset-x-0 bottom-0 z-30 flex items-center border-t border-hairline bg-canvas/95 px-2 pb-5 pt-2 backdrop-blur",
        onLogExpense ? "justify-between px-6" : "justify-around",
      )}
    >
      {LEFT_TABS.map(renderTab)}
      {onLogExpense && <span className="w-12 shrink-0" aria-hidden />}
      {RIGHT_TABS.map(renderTab)}

      {onLogExpense && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-action-primary"
            animate={{ scale: [1, 1.45, 1], opacity: [0.32, 0, 0.32] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.button
            whileTap={{ scale: 0.88, rotate: 90 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            onClick={onLogExpense}
            aria-label="Log expense"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-action-primary text-white shadow-soft ring-4 ring-canvas"
          >
            <Icon icon={Plus} size={24} />
          </motion.button>
        </div>
      )}
    </nav>
  );
}
