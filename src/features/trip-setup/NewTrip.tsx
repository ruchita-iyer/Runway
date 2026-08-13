import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";
import { CategoryChipRow } from "../../components/ui/CategoryChipRow";
import { Icon, ArrowLeft, inferCategoryIcon } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { DEFAULT_CATEGORY_DEFS } from "../../data/seedCategories";
import { CURRENCIES, DEFAULT_CURRENCY } from "../../data/currencies";
import { todayISO } from "../../lib/date";
import type { Category, Currency } from "../../data/types";

type StartMode = "now" | "later";

export function NewTrip() {
  const navigate = useNavigate();
  const { createTrip } = useTripData();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [startMode, setStartMode] = useState<StartMode>("now");
  const [plannedStartDate, setPlannedStartDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [extra, setExtra] = useState<string[]>([]);

  const defaultPreview: Category[] = DEFAULT_CATEGORY_DEFS.map((d) => ({
    id: d.name,
    tripId: "",
    name: d.name,
    icon: d.icon,
    isDefault: true,
  }));
  const extraPreview: Category[] = extra.map((n) => ({
    id: n,
    tripId: "",
    name: n,
    icon: inferCategoryIcon(n),
    isDefault: false,
  }));
  const previewCategories: Category[] = [...defaultPreview, ...extraPreview];

  const canSubmit =
    name.trim() &&
    Number(budget) > 0 &&
    Number(duration) > 0 &&
    (startMode === "now" || plannedStartDate);

  const submit = () => {
    if (!canSubmit) return;
    createTrip({
      name: name.trim(),
      totalBudget: Number(budget),
      durationDays: Number(duration),
      startDate: startMode === "now" ? todayISO() : plannedStartDate,
      currency,
      status: startMode === "now" ? "active" : "upcoming",
      note: note.trim() || undefined,
      selectedDefaultNames: selected,
      extraCategoryNames: extra,
    });
    navigate("/home", { replace: true });
  };

  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-ink">
          <Icon icon={ArrowLeft} size={22} />
        </button>
        <h1 className="font-display text-[20px] font-bold text-ink">New trip</h1>
      </div>

      <div className="flex flex-col gap-5 px-5 pb-10 pt-6">
        <Field label="Trip name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lisbon"
            className="w-full bg-transparent font-display text-[22px] font-semibold text-ink placeholder:text-slate/40 focus:outline-none"
          />
        </Field>

        <div className="flex gap-3">
          <Field label="Total budget" className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="tabular font-display text-[20px] font-semibold text-slate">{currency.symbol}</span>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                inputMode="decimal"
                placeholder="900"
                className="tabular w-full bg-transparent font-display text-[20px] font-semibold text-ink placeholder:text-slate/40 focus:outline-none"
              />
            </div>
          </Field>
          <Field label="Days" className="w-24">
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 7"
              className="tabular w-full bg-transparent font-display text-[20px] font-semibold text-ink placeholder:text-slate/40 focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Currency">
          <select
            value={currency.code}
            onChange={(e) => {
              const next = CURRENCIES.find((c) => c.code === e.target.value);
              if (next) setCurrency(next);
            }}
            className="w-full bg-transparent text-[15px] text-ink focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} style={{ color: "#1a1a1a", backgroundColor: "#ffffff" }}>
                {c.symbol} {c.code} — {c.label}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-slate">When are you tracking from?</p>
          <div className="flex gap-2 rounded-2xl bg-surface p-1 shadow-soft">
            {(["now", "later"] as StartMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setStartMode(mode)}
                className={`flex-1 rounded-xl py-2.5 text-[14px] font-medium transition-colors ${startMode === mode ? "bg-action-primary text-white" : "text-slate"
                  }`}
              >
                {mode === "now" ? "Start my trip today" : "Plan for later"}
              </button>
            ))}
          </div>
        </div>

        {startMode === "later" && (
          <Field label="Start date">
            <input
              type="date"
              value={plannedStartDate}
              min={todayISO()}
              onChange={(e) => setPlannedStartDate(e.target.value)}
              className="w-full bg-transparent text-[15px] text-ink focus:outline-none"
            />
          </Field>
        )}

        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-slate">Categories</p>
          <CategoryChipRow
            categories={previewCategories}
            selectedIds={selected}
            onToggle={(id) =>
              setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
            }
            onCreate={(newName) => {
              setExtra((e) => [...e, newName]);
              setSelected((s) => [...s, newName]);
            }}
          />
        </div>

        <Field label="Note (optional)">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything to note about this trip"
            rows={2}
            className="w-full resize-none bg-transparent text-[15px] text-ink placeholder:text-slate/40 focus:outline-none"
          />
        </Field>
      </div>

      <div className="px-5 pb-8">
        <Button disabled={!canSubmit} onClick={submit}>
          {startMode === "now" ? "Start tracking" : "Save trip"}
        </Button>
      </div>
    </AppShell>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-surface px-4 py-3 shadow-soft ${className ?? ""}`}>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate">{label}</p>
      {children}
    </div>
  );
}
