import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "flex w-full items-center justify-center rounded-pill px-6 py-3.5 text-[15px] font-medium transition-colors disabled:opacity-40",
        variant === "primary" && "bg-action-primary text-white shadow-soft",
        variant === "secondary" && "border border-hairline bg-surface text-ink",
        variant === "ghost" && "text-slate",
        className,
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
