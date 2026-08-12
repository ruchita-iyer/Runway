import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";
import { CategoryPickerGrid } from "../../components/ui/CategoryPickerGrid";
import { Icon, ArrowLeft, Calendar, ChevronRight, categoryIcon, inferCategoryIcon } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { tripEndDateISO } from "../../data/calculations";
import { categoryColor, categoryGradient } from "../../theme/tokens";
import { dayNumberFor, toISODate, formatShortDate } from "../../lib/date";

export function EditExpense() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, editExpense, deleteExpense, addCategory } = useTripData();

  const trip = state.trips.find((t) => t.expenses.some((e) => e.id === id)) ?? null;
  const expense = trip?.expenses.find((e) => e.id === id);

  const [amount, setAmount] = useState(String(expense?.amount ?? ""));
  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? "");
  const [note, setNote] = useState(expense?.note ?? "");
  const [dateISO, setDateISO] = useState(() => (expense ? toISODate(new Date(expense.loggedAt)) : ""));
  const [pickerOpen, setPickerOpen] = useState(false);

  // Navigating during render (rather than in an effect) here would race with the state
  // update from `remove()` below: deleteExpense's setState re-renders this component with
  // `expense` now undefined before the pending navigate(-1) has taken effect, which used to
  // trigger a synchronous navigate-during-render into an infinite update loop.
  useEffect(() => {
    if (!trip || !expense) navigate("/home", { replace: true });
  }, [trip, expense, navigate]);

  if (!trip || !expense) {
    return null;
  }

  const selectedCategory = trip.categories.find((c) => c.id === categoryId) ?? null;

  const save = () => {
    const newDay = dayNumberFor(trip.startDate, trip.durationDays, dateISO);
    const [y, m, d] = dateISO.split("-").map(Number);
    const prevLoggedAt = new Date(expense.loggedAt);
    const newLoggedAt = new Date(
      y,
      m - 1,
      d,
      prevLoggedAt.getHours(),
      prevLoggedAt.getMinutes(),
      prevLoggedAt.getSeconds(),
    ).getTime();
    editExpense(expense.id, {
      amount: Number(amount),
      categoryId,
      note: note.trim(),
      dayNumber: newDay,
      loggedAt: newLoggedAt,
    });
    navigate(-1);
  };

  const remove = () => {
    deleteExpense(expense.id);
    navigate(-1);
  };

  return (
    <AppShell>
      <div className="relative flex items-center justify-center px-5 pt-6">
        <button onClick={() => navigate(-1)} className="absolute left-5 text-ink">
          <Icon icon={ArrowLeft} size={22} />
        </button>
        <h1 className="font-display text-[18px] font-bold text-ink">Edit Expense</h1>
      </div>

      <div className="flex justify-center pt-4">
        <label className="relative flex items-center gap-2 rounded-pill bg-action-primary/12 px-4 py-2 text-[13px] font-medium text-action-primary">
          <Icon icon={Calendar} size={15} />
          {formatShortDate(dateISO)}
          <input
            type="date"
            value={dateISO}
            min={trip.startDate}
            max={tripEndDateISO(trip)}
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="tabular w-full bg-transparent font-display text-[24px] font-semibold text-ink focus:outline-none"
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
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                  style={{ background: categoryGradient(categoryColor(trip.categories, selectedCategory.id)) }}
                >
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
            rows={3}
            className="w-full resize-none rounded-2xl bg-surface px-4 py-3 text-[15px] text-ink shadow-soft focus:outline-none"
          />
        </div>

        <p className="tabular text-[12px] text-slate">
          Logged on Day {expense.dayNumber}, {new Date(expense.loggedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </p>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-8 pt-6">
        <Button onClick={save}>Save changes</Button>
        <button
          onClick={remove}
          className="rounded-pill border border-dashed border-hairline py-3 text-[15px] font-medium text-pace-berry"
        >
          Delete expense
        </button>
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
                categories={trip.categories}
                onPick={(catId) => {
                  setCategoryId(catId);
                  setPickerOpen(false);
                }}
                onCreate={(name) => addCategory(trip.id, name, inferCategoryIcon(name)).id}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
