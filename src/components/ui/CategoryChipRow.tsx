import { useState } from "react";
import { motion } from "framer-motion";
import { Chip } from "./Chip";
import { Icon, Plus, Check } from "./IconIndex";
import { categoryIcon } from "./IconIndex";
import type { Category } from "../../data/types";

export function CategoryChipRow({
  categories,
  selectedIds,
  onToggle,
  onCreate,
  multi = true,
}: {
  categories: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onCreate: (name: string) => void;
  multi?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const name = draft.trim();
    if (name) onCreate(name);
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const IconCmp = categoryIcon(cat.icon);
        const selected = selectedIds.includes(cat.id);
        return (
          <Chip key={cat.id} selected={selected} onClick={() => onToggle(cat.id)} icon={<Icon icon={IconCmp} size={16} />}>
            {cat.name}
            {multi && selected && <Icon icon={Check} size={14} />}
          </Chip>
        );
      })}

      <motion.div layout className="overflow-hidden rounded-pill border border-dashed border-hairline">
        {adding ? (
          <motion.div layout className="flex items-center gap-1 py-1 pl-3 pr-1">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              placeholder="Category name"
              className="w-24 bg-transparent text-[14px] text-ink placeholder:text-slate focus:outline-none"
            />
            <button
              onClick={commit}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-action-primary text-white"
            >
              <Icon icon={Check} size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            layout
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-slate"
          >
            <Icon icon={Plus} size={16} />
            New
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
