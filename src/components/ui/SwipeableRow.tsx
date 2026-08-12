import type { ReactNode } from "react";
import { motion, useAnimation } from "framer-motion";
import { Icon, Pencil, Trash2 } from "./IconIndex";

const REVEAL_WIDTH = 132;
const OPEN_THRESHOLD = REVEAL_WIDTH / 2;

/**
 * Swipe-left-to-reveal Edit/Delete actions behind a list row. Marked with
 * `data-swipe-row` so the page-level tab-swipe gesture (useSwipeNavigation)
 * ignores touches that start here.
 */
export function SwipeableRow({
  children,
  onEdit,
  onDelete,
}: {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const controls = useAnimation();

  const close = () => controls.start({ x: 0 });
  const open = () => controls.start({ x: -REVEAL_WIDTH });

  return (
    <div data-swipe-row className="relative shrink-0 overflow-hidden rounded-2xl shadow-soft">
      <div className="absolute inset-y-0 right-0 flex items-stretch" style={{ width: REVEAL_WIDTH }}>
        <button
          onClick={() => {
            close();
            onEdit();
          }}
          aria-label="Edit"
          className="flex w-[66px] items-center justify-center bg-accent-violet text-white"
        >
          <Icon icon={Pencil} size={18} />
        </button>
        <button
          onClick={() => {
            onDelete();
          }}
          aria-label="Delete"
          className="flex w-[66px] items-center justify-center bg-pace-berry text-white"
        >
          <Icon icon={Trash2} size={18} />
        </button>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -REVEAL_WIDTH, right: 0 }}
        dragElastic={0.15}
        animate={controls}
        initial={{ x: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -OPEN_THRESHOLD || info.velocity.x < -400) open();
          else close();
        }}
        className="relative bg-surface"
      >
        {children}
      </motion.div>
    </div>
  );
}
