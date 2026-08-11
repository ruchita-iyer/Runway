import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Icon, House, BarChart3, MessageCircle, UserCircle, Plus } from "../components/ui/IconIndex";

const LEFT_TABS = [
  { path: "/home", label: "Home", icon: House },
  { path: "/trend", label: "Trend", icon: BarChart3 },
];

const RIGHT_TABS = [
  { path: "/advisor", label: "Advisor", icon: MessageCircle },
  { path: "/account", label: "Account", icon: UserCircle },
];

export function BottomNav({ onLogExpense }: { onLogExpense?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const renderTab = (tab: (typeof LEFT_TABS)[number]) => {
    const active = location.pathname === tab.path;
    return (
      <button
        key={tab.path}
        onClick={() => navigate(tab.path)}
        className="flex flex-col items-center gap-1 px-3 py-1"
      >
        <Icon icon={tab.icon} size={22} className={clsx(active ? "text-action-primary" : "text-slate")} />
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
