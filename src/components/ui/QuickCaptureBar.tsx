import { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Icon, Plus } from "./IconIndex";

export function QuickCaptureBar({ onLog, onOpenFull }: { onLog: (amount: number) => void; onOpenFull: () => void }) {
  const [value, setValue] = useState("");
  const [ripple, setRipple] = useState(false);
  const tossControls = useAnimation();

  const submit = () => {
    const amount = parseFloat(value);
    if (!amount || amount <= 0) return;
    onLog(amount);
    setValue("");
  };

  const handleDragEnd = async (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    const amount = parseFloat(value);
    if (!amount || amount <= 0) return;
    const tossed = info.offset.y < -40 || info.velocity.y < -400;
    if (!tossed) {
      tossControls.start({ y: 0, opacity: 1 });
      return;
    }
    await tossControls.start({ y: -120, opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } });
    setRipple(true);
    setTimeout(() => setRipple(false), 400);
    onLog(amount);
    setValue("");
    tossControls.set({ y: 0, opacity: 1 });
  };

  return (
    <div className="relative flex items-center gap-2 rounded-pill bg-surface px-3 py-2 shadow-soft">
      <AnimatePresence>
        {ripple && (
          <span className="pointer-events-none absolute -top-3 left-1/2 h-8 w-8 -translate-x-1/2">
            <motion.span
              initial={{ scale: 0.4, opacity: 0.5 }}
              animate={{ scale: 1.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="block h-8 w-8 rounded-full bg-action-primary/40"
            />
          </span>
        )}
      </AnimatePresence>
      <motion.div
        drag={value ? "y" : false}
        dragConstraints={{ top: -140, bottom: 0 }}
        dragElastic={0.4}
        animate={tossControls}
        onDragEnd={handleDragEnd}
        className="flex flex-1 items-center gap-2"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          inputMode="decimal"
          placeholder="Log an expense... (swipe up to send)"
          className="tabular flex-1 bg-transparent px-2 text-[15px] text-ink placeholder:text-slate focus:outline-none"
        />
      </motion.div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={value ? submit : onOpenFull}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action-primary text-white"
      >
        <Icon icon={Plus} size={20} />
      </motion.button>
    </div>
  );
}
