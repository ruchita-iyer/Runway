import { AnimatePresence, motion } from "framer-motion";
import { Icon, X, Calendar, SkipBack, SkipForward, Flag } from "../../components/ui/IconIndex";
import { useTripData } from "../../data/useTripData";
import { currentDayNumber, tripDateForDay, tripEndDateISO } from "../../data/calculations";
import { dayNumberFor } from "../../lib/date";
import type { Trip } from "../../data/types";

export function DayManageSheet({
  trip,
  open,
  onClose,
  onEndTrip,
}: {
  trip: Trip;
  open: boolean;
  onClose: () => void;
  onEndTrip: () => void;
}) {
  const { setTripDay, goToNextDay, goToPreviousDay } = useTripData();
  const day = currentDayNumber(trip);
  const isLastDay = day >= trip.durationDays;
  const isFirstDay = day <= 1;

  const handleDateChange = (dateISO: string) => {
    const newDay = dayNumberFor(trip.startDate, trip.durationDays, dateISO);
    setTripDay(trip.id, newDay);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl bg-canvas px-5 pb-8 pt-4 shadow-soft"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-hairline" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-[17px] font-bold text-ink">
                Day {day} of {trip.durationDays}
              </h2>
              <button onClick={onClose} className="text-slate">
                <Icon icon={X} size={20} />
              </button>
            </div>

            <label className="mb-5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-soft">
              <Icon icon={Calendar} size={18} className="text-slate" />
              <span className="flex-1 text-[14px] text-ink">Change date</span>
              <input
                type="date"
                value={tripDateForDay(trip, day)}
                min={trip.startDate}
                max={tripEndDateISO(trip)}
                onChange={(e) => e.target.value && handleDateChange(e.target.value)}
                className="tabular bg-transparent text-right text-[14px] text-action-primary focus:outline-none"
              />
            </label>

            <div className="mb-3 flex gap-3">
              <button
                disabled={isFirstDay}
                onClick={() => {
                  goToPreviousDay(trip.id);
                }}
                className="flex flex-1 items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 text-left shadow-soft disabled:opacity-40"
              >
                <Icon icon={SkipBack} size={18} className="text-slate" />
                <span className="flex-1 text-[14px] text-ink">Previous day</span>
              </button>
              <button
                disabled={isLastDay}
                onClick={() => {
                  goToNextDay(trip.id);
                }}
                className="flex flex-1 items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 text-left shadow-soft disabled:opacity-40"
              >
                <Icon icon={SkipForward} size={18} className="text-slate" />
                <span className="flex-1 text-[14px] text-ink">Next day</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onEndTrip();
              }}
              className="flex w-full items-center gap-3 rounded-2xl bg-accent-violet/10 px-4 py-3.5 text-left"
            >
              <Icon icon={Flag} size={18} className="text-accent-violet" />
              <span className="flex-1 text-[14px] font-medium text-accent-violet">End trip</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
