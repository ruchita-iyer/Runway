import type { ReactNode } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export function Chip({
  selected,
  onClick,
  children,
  icon,
  dashed,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  dashed?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      animate={{
        backgroundColor: selected ? "var(--action-primary)" : "var(--surface)",
        borderColor: selected ? "var(--action-primary)" : "var(--hairline)",
      }}
      transition={{ duration: 0.15 }}
      className={clsx(
        "flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-4 py-2 text-[14px] font-medium",
        dashed && "border-dashed",
        selected ? "text-white" : "text-ink",
      )}
    >
      {icon}
      {children}
    </motion.button>
  );
}
