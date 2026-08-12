import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { Icon, ArrowLeft, ArrowDownUp, TrendingUp } from "../../components/ui/IconIndex";
import { Button } from "../../components/ui/Button";
import { useTripData } from "../../data/useTripData";
import { effectiveBudget, totalSpent, tripCurrencySymbol } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";

export function OvershootChoice() {
  const navigate = useNavigate();
  const { activeTrip, markOvershootAcknowledged } = useTripData();
  const [raising, setRaising] = useState(false);
  const [extra, setExtra] = useState("");

  if (!activeTrip) {
    navigate("/home", { replace: true });
    return null;
  }

  const symbol = tripCurrencySymbol(activeTrip);
  const over = totalSpent(activeTrip) - effectiveBudget(activeTrip);

  const chooseTighten = () => {
    markOvershootAcknowledged(activeTrip.id, "tighten");
    navigate("/home", { replace: true });
  };

  const chooseRaise = () => {
    const addAmount = Number(extra);
    if (!addAmount || addAmount <= 0) return;
    markOvershootAcknowledged(activeTrip.id, "raise", effectiveBudget(activeTrip) + addAmount);
    navigate("/home", { replace: true });
  };

  return (
    <AppShell>
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate("/home")} className="text-ink">
          <Icon icon={ArrowLeft} size={22} />
        </button>
        <h1 className="font-display text-[16px] font-medium text-slate">{activeTrip.name}</h1>
      </div>

      <div className="flex flex-col items-center gap-3 px-8 pt-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-pace-berry text-white shadow-soft"
        >
          <span className="text-[13px] font-medium opacity-90">Over budget</span>
          <span className="tabular font-display text-[26px] font-bold">by {formatCurrency(over, { symbol })}</span>
        </motion.div>
        <p className="max-w-[280px] text-[14px] leading-relaxed text-slate">
          This happens on real trips. Here's how you want to handle the rest of it.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-8">
        <button
          onClick={chooseTighten}
          className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-4 text-left shadow-soft"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-action-primary">
            <Icon icon={ArrowDownUp} size={18} />
          </span>
          <span>
            <p className="text-[15px] font-medium text-ink">Tighten the rest of the trip</p>
            <p className="text-[13px] text-slate">Original budget stays the goal</p>
          </span>
        </button>

        <div className="rounded-2xl bg-surface px-4 py-4 shadow-soft">
          <button onClick={() => setRaising((r) => !r)} className="flex w-full items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-action-primary">
              <Icon icon={TrendingUp} size={18} />
            </span>
            <span>
              <p className="text-[15px] font-medium text-ink">Raise the budget</p>
              <p className="text-[13px] text-slate">Add funds and update your trip budget</p>
            </span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: raising ? "auto" : 0, opacity: raising ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 pt-4">
              <span className="tabular text-[18px] font-semibold text-slate">{symbol}</span>
              <input
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                inputMode="decimal"
                placeholder="Additional amount"
                className="tabular flex-1 border-b border-hairline bg-transparent py-1 text-[16px] text-ink placeholder:text-slate/60 focus:outline-none"
              />
              <Button className="w-auto px-5 py-2" onClick={chooseRaise}>
                Add
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
