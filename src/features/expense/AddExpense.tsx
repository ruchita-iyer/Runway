import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";
import { CategoryPickerGrid } from "../../components/ui/CategoryPickerGrid";
import { Icon, ArrowLeft, Calendar, ChevronRight, categoryIcon, inferCategoryIcon } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { shouldPromptOvershoot, tripEndDateISO } from "../../data/calculations";
import { formatShortDate } from "../../lib/date";
import { todayISO } from "../../lib/date";

export function AddExpense() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTrip, logExpense, addCategory } = useTripData();

  const presetCategoryId = (location.state as { categoryId?: string } | null)?.categoryId;
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(presetCategoryId ?? null);
  const [note, setNote] = useState("");
  const [dateISO, setDateISO] = useState(todayISO());
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!activeTrip) {
    navigate("/home", { replace: true });
    return null;
  }

  const selectedCategory = activeTrip.categories.find((c) => c.id === categoryId) ?? null;
  const canSave = Number(amount) > 0 && categoryId;

  const save = () => {
    if (!canSave || !categoryId) return;
    const expense = logExpense(activeTrip.id, {
      amount: Number(amount),
      categoryId,
      note: note.trim(),
      dateISO,
    });
    const updatedTrip = { ...activeTrip, expenses: [...activeTrip.expenses, expense] };
    if (shouldPromptOvershoot(updatedTrip)) {
      navigate("/overshoot", { replace: true });
      return;
    }
    navigate("/home", { replace: true, state: { justLoggedId: expense.id } });
  };

  return (
    <AppShell>
      <div className="relative flex items-center justify-center px-5 pt-6">
        <button onClick={() => navigate(-1)} className="absolute left-5 text-ink">
          <Icon icon={ArrowLeft} size={22} />
        </button>
        <h1 className="font-display text-[18px] font-bold text-ink">Add Expense</h1>
      </div>

      <div className="flex justify-center pt-4">
        <label className="relative flex items-center gap-2 rounded-pill bg-action-primary/12 px-4 py-2 text-[13px] font-medium text-action-primary">
          <Icon icon={Calendar} size={15} />
          {formatShortDate(dateISO)}
          <input
            type="date"
            value={dateISO}
            min={activeTrip.startDate}
            max={tripEndDateISO(activeTrip)}
            onChange={(e) => e.target.value && setDateISO(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>

      <div className="flex flex-col gap-5 px-5 pt-8">
        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-slate">Amount (USD)</p>
          <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-4 shadow-soft">
            <span className="tabular font-display text-[24px] font-semibold text-slate">$</span>
            <input
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="0.00"
              className="tabular w-full bg-transparent font-display text-[24px] font-semibold text-ink placeholder:text-slate/40 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-slate">Category</p>
          <button
            onClick={() => setPickerOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 text-left shadow-soft"
          >
            {selectedCategory ? (
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-action-primary/12 text-action-primary">
                  <Icon icon={categoryIcon(selectedCategory.icon)} size={16} />
                </span>
                <span className="flex-1 text-[15px] font-medium text-ink">{selectedCategory.name}</span>
              </>
            ) : (
              <span className="flex-1 text-[15px] text-slate">Select category</span>
            )}
            <Icon icon={ChevronRight} size={18} className="text-slate" />
          </button>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-slate">Notes (optional)</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Dinner at Gion district..."
            rows={3}
            className="w-full resize-none rounded-2xl bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-slate/60 shadow-soft focus:outline-none"
          />
        </div>
      </div>

      <div className="px-5 pb-8 pt-8">
        <Button disabled={!canSave} onClick={save}>
          Save Expense
        </Button>
      </div>

      <AnimatePresence>
        {pickerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPickerOpen(false)}
              className="absolute inset-0 z-40 bg-black/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 z-50 max-h-[80%] overflow-y-auto rounded-t-3xl bg-canvas px-5 pb-8 pt-4 shadow-soft"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-hairline" />
              <h2 className="mb-4 text-center font-display text-[17px] font-bold text-ink">Choose Category</h2>
              <CategoryPickerGrid
                categories={activeTrip.categories}
                onPick={(id) => {
                  setCategoryId(id);
                  setPickerOpen(false);
                }}
                onCreate={(name) => addCategory(activeTrip.id, name, inferCategoryIcon(name)).id}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
