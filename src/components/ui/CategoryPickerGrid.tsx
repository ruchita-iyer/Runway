import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Icon, Plus, Check, categoryIcon } from "./IconIndex";
import { categoryColor, categoryGradient } from "../../theme/tokens";
import type { Category } from "../../data/types";

const SWIPE_DISTANCE_THRESHOLD = 40;
const SWIPE_CONFIRM_THRESHOLD = 50;

export function CategoryPickerGrid({
  categories,
  onPick,
  onCreate,
}: {
  categories: Category[];
  onPick: (id: string) => void;
  onCreate: (name: string) => string;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const commitNew = () => {
    const name = draft.trim();
    if (!name) return;
    const id = onCreate(name);
    setDraft("");
    setAdding(false);
    onPick(id);
  };

  const pick = (id: string) => {
    setPickedId(id);
    setTimeout(() => onPick(id), 260);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (pickedId) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || pickedId || categories.length === 0) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) < SWIPE_DISTANCE_THRESHOLD) return;
      setFocusIndex((i) => Math.min(Math.max(dx < 0 ? i + 1 : i - 1, 0), categories.length - 1));
    } else if (dy < -SWIPE_CONFIRM_THRESHOLD) {
      pick(categories[focusIndex].id);
    }
  };

  return (
    <div data-swipe-row>
      <div
        data-swipe-row
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="grid grid-cols-3 gap-3"
      >
        {categories.map((cat, i) => {
        const IconCmp = categoryIcon(cat.icon);
        const picked = pickedId === cat.id;
        const focused = i === focusIndex && !pickedId;
        const color = categoryColor(categories, cat.id);
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            disabled={pickedId !== null}
            onClick={() => {
              setFocusIndex(i);
              pick(cat.id);
            }}
            animate={{ scale: focused ? 1.04 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className={clsx(
              "flex flex-col items-center gap-2 rounded-2xl bg-surface py-5 shadow-soft ring-2 ring-offset-2 ring-offset-canvas transition-shadow",
              focused ? "ring-action-primary" : "ring-transparent",
            )}
          >
            <span
              className="relative flex h-12 w-12 items-center justify-center rounded-full text-white"
              style={{ background: categoryGradient(color) }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {picked ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.25, 1], opacity: 1 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center rounded-full text-white"
                    style={{ background: categoryGradient(color) }}
                  >
                    <Icon icon={Check} size={20} />
                  </motion.span>
                ) : (
                  <Icon icon={IconCmp} size={21} />
                )}
              </AnimatePresence>
            </span>
            <span className="text-[13px] font-medium text-ink">{cat.name}</span>
          </motion.button>
        );
        })}

      <motion.div
        layout
        className="col-span-1 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline py-5"
      >
        {adding ? (
          <motion.div layout className="flex w-full flex-col items-center gap-2 px-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitNew()}
              placeholder="Name"
              className="w-full bg-transparent text-center text-[13px] text-ink placeholder:text-slate focus:outline-none"
            />
            <button
              onClick={commitNew}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-action-primary text-white"
            >
              <Icon icon={Check} size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.button layout onClick={() => setAdding(true)} className="flex flex-col items-center gap-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full text-slate">
              <Icon icon={Plus} size={21} />
            </span>
            <span className="text-[13px] font-medium text-slate">New Category</span>
          </motion.button>
        )}
      </motion.div>
      </div>
    </div>
  );
}

