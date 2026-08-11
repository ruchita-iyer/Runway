import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";
import { CategoryChipRow } from "../../components/ui/CategoryChipRow";
import { Icon, ArrowLeft, inferCategoryIcon } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { DEFAULT_CATEGORY_DEFS } from "../../data/seedCategories";
import { todayISO } from "../../lib/date";
import type { Category } from "../../data/types";

export function NewTrip() {
  const navigate = useNavigate();
  const { createTrip } = useTripData();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("6");
  const [startDate, setStartDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string[]>(DEFAULT_CATEGORY_DEFS.map((d) => d.name));
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

  const canSubmit = name.trim() && Number(budget) > 0 && Number(duration) > 0 && startDate;

  const submit = () => {
    if (!canSubmit) return;
    createTrip({
      name: name.trim(),
      totalBudget: Number(budget),
      durationDays: Number(duration),
      startDate,
      note: note.trim() || undefined,
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
            className="w-full bg-transparent font-display text-[22px] font-semibold text-ink placeholder:text-slate/50 focus:outline-none"
          />
        </Field>

        <div className="flex gap-3">
          <Field label="Total budget" className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="tabular font-display text-[20px] font-semibold text-slate">$</span>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                inputMode="decimal"
                placeholder="900"
                className="tabular w-full bg-transparent font-display text-[20px] font-semibold text-ink placeholder:text-slate/50 focus:outline-none"
              />
            </div>
          </Field>
          <Field label="Days" className="w-24">
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              inputMode="numeric"
              className="tabular w-full bg-transparent font-display text-[20px] font-semibold text-ink focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Start date">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-transparent text-[15px] text-ink focus:outline-none"
          />
        </Field>

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
            placeholder="Anything worth remembering about this trip"
            rows={2}
            className="w-full resize-none bg-transparent text-[15px] text-ink placeholder:text-slate/50 focus:outline-none"
          />
        </Field>
      </div>

      <div className="px-5 pb-8">
        <Button disabled={!canSubmit} onClick={submit}>
          Start tracking
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
