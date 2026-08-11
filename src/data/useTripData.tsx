import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createId } from "../lib/id";
import { addDaysISO } from "../lib/date";
import { currentDayNumber, effectiveToday, resolveScreenState, tripDateForDay } from "./calculations";
import { defaultCategoriesFor } from "./seedCategories";
import { loadState, saveState } from "./storage";
import type { AppState, Category, Expense, ScreenState, Trip } from "./types";

interface NewTripInput {
  name: string;
  totalBudget: number;
  durationDays: number;
  startDate: string;
  note?: string;
  extraCategoryNames?: string[];
}

interface NewExpenseInput {
  amount: number;
  categoryId: string;
  note: string;
  dateISO?: string;
}

interface TripDataContextValue {
  state: AppState;
  activeTrip: Trip | null;
  derivedScreen: ScreenState;
  dayJustRolledOver: boolean;
  acknowledgeDayRollover: () => void;
  justCompletedTripId: string | null;
  acknowledgeTripComplete: (tripId: string) => void;
  createTrip: (input: NewTripInput) => Trip;
  addCategory: (tripId: string, name: string, icon: string) => Category;
  logExpense: (tripId: string, input: NewExpenseInput) => Expense;
  editExpense: (
    id: string,
    patch: Partial<Pick<Expense, "amount" | "categoryId" | "note" | "dayNumber" | "loggedAt">>,
  ) => void;
  deleteExpense: (id: string) => void;
  undoLastExpense: () => void;
  lastLoggedExpenseId: string | null;
  clearLastLogged: () => void;
  markOvershootAcknowledged: (tripId: string, choice: "tighten" | "raise", newBudget?: number) => void;
  setActiveTrip: (tripId: string) => void;
  finishTrip: (tripId: string) => void;
  setTripDay: (tripId: string, day: number) => void;
  goToNextDay: (tripId: string) => void;
  startNewTripFlow: () => void;
  toggleDarkMode: () => void;
  markTutorialSeen: () => void;
  // dev-only helpers
  devAdvanceDay: () => void;
  devClearAll: () => void;
  devSeedDemoTrip: () => void;
}

const TripDataContext = createContext<TripDataContextValue | null>(null);

export function TripDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const [dayJustRolledOver, setDayJustRolledOver] = useState(false);
  const [justCompletedTripId, setJustCompletedTripId] = useState<string | null>(null);
  const [lastLoggedExpenseId, setLastLoggedExpenseId] = useState<string | null>(null);
  const [, setUndoStack] = useState<string[]>([]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  const activeTrip = useMemo(
    () => state.trips.find((t) => t.id === state.activeTripId) ?? null,
    [state.trips, state.activeTripId],
  );

  const derivedScreen = useMemo(() => {
    const resolved = resolveScreenState(activeTrip);
    // Once the user has dismissed this trip's "Trip complete" celebration, treat Home as if
    // there's no active trip so it falls back to the returning-user homepage instead of
    // re-showing the celebration screen forever.
    if (resolved === "complete" && activeTrip && state.acknowledgedTripId === activeTrip.id) {
      return "empty";
    }
    return resolved;
  }, [activeTrip, state.acknowledgedTripId]);

  // Day-rollover detection: runs once on mount / when active trip changes.
  useEffect(() => {
    if (!activeTrip || derivedScreen !== "active") return;
    const today = currentDayNumber(activeTrip);
    if (state.lastOpenedDayNumber !== null && today > state.lastOpenedDayNumber) {
      setDayJustRolledOver(true);
    }
    if (state.lastOpenedDayNumber !== today) {
      setState((s) => ({ ...s, lastOpenedDayNumber: today }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrip?.id, derivedScreen]);

  // Auto-flip trip status to complete when its end date has passed.
  useEffect(() => {
    if (!activeTrip) return;
    if (derivedScreen === "complete" && activeTrip.status === "active") {
      setJustCompletedTripId(activeTrip.id);
      setState((s) => ({
        ...s,
        trips: s.trips.map((t) => (t.id === activeTrip.id ? { ...t, status: "complete" } : t)),
      }));
    }
  }, [activeTrip, derivedScreen]);

  const acknowledgeDayRollover = useCallback(() => setDayJustRolledOver(false), []);
  // Called when the user navigates away from the "Trip complete" screen — marks it seen so
  // Home falls back to the returning-user homepage instead of re-showing the celebration.
  const acknowledgeTripComplete = useCallback((tripId: string) => {
    setJustCompletedTripId((id) => (id === tripId ? null : id));
    setState((s) => ({ ...s, acknowledgedTripId: tripId }));
  }, []);

  const createTrip = useCallback((input: NewTripInput): Trip => {
    const id = createId("trip");
    const categories = defaultCategoriesFor(id);
    const extra = (input.extraCategoryNames ?? []).map((name) => ({
      id: createId("cat"),
      tripId: id,
      name,
      icon: "other",
      isDefault: false,
    }));
    const trip: Trip = {
      id,
      name: input.name,
      totalBudget: input.totalBudget,
      durationDays: input.durationDays,
      startDate: input.startDate,
      categories: [...categories, ...extra],
      expenses: [],
      status: "active",
      overshootAcknowledged: false,
      note: input.note,
    };
    setState((s) => ({
      ...s,
      trips: [...s.trips, trip],
      activeTripId: id,
      lastOpenedDayNumber: currentDayNumber(trip),
    }));
    return trip;
  }, []);

  const addCategory = useCallback((tripId: string, name: string, icon: string): Category => {
    const category: Category = { id: createId("cat"), tripId, name, icon, isDefault: false };
    setState((s) => ({
      ...s,
      trips: s.trips.map((t) => (t.id === tripId ? { ...t, categories: [...t.categories, category] } : t)),
    }));
    return category;
  }, []);

  const logExpense = useCallback((tripId: string, input: NewExpenseInput): Expense => {
    const trip = state.trips.find((t) => t.id === tripId);
    const chosenDateISO = input.dateISO;
    const day = trip
      ? chosenDateISO
        ? currentDayNumber(trip, chosenDateISO)
        : currentDayNumber(trip)
      : 1;
    const loggedAt = chosenDateISO ? loggedAtForDate(chosenDateISO) : Date.now();
    const expense: Expense = {
      id: createId("exp"),
      tripId,
      amount: input.amount,
      categoryId: input.categoryId,
      note: input.note,
      loggedAt,
      dayNumber: day,
    };
    setState((s) => ({
      ...s,
      trips: s.trips.map((t) => (t.id === tripId ? { ...t, expenses: [...t.expenses, expense] } : t)),
    }));
    setLastLoggedExpenseId(expense.id);
    setUndoStack((stack) => [...stack, expense.id]);
    return expense;
  }, [state.trips]);

  const editExpense = useCallback(
    (id: string, patch: Partial<Pick<Expense, "amount" | "categoryId" | "note">>) => {
      setState((s) => ({
        ...s,
        trips: s.trips.map((t) => ({
          ...t,
          expenses: t.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      }));
    },
    [],
  );

  const deleteExpense = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      trips: s.trips.map((t) => ({ ...t, expenses: t.expenses.filter((e) => e.id !== id) })),
    }));
  }, []);

  const undoLastExpense = useCallback(() => {
    setUndoStack((stack) => {
      const last = stack[stack.length - 1];
      if (!last) return stack;
      setState((s) => ({
        ...s,
        trips: s.trips.map((t) => ({ ...t, expenses: t.expenses.filter((e) => e.id !== last) })),
      }));
      setLastLoggedExpenseId(null);
      return stack.slice(0, -1);
    });
  }, []);

  const clearLastLogged = useCallback(() => setLastLoggedExpenseId(null), []);

  const markOvershootAcknowledged = useCallback(
    (tripId: string, _choice: "tighten" | "raise", newBudget?: number) => {
      setState((s) => ({
        ...s,
        trips: s.trips.map((t) =>
          t.id === tripId
            ? {
                ...t,
                overshootAcknowledged: true,
                overshootRaisedBudget: newBudget ?? t.overshootRaisedBudget,
              }
            : t,
        ),
      }));
    },
    [],
  );

  const setActiveTrip = useCallback((tripId: string) => {
    setState((s) => {
      const trip = s.trips.find((t) => t.id === tripId);
      return {
        ...s,
        activeTripId: tripId,
        lastOpenedDayNumber: trip ? currentDayNumber(trip) : s.lastOpenedDayNumber,
      };
    });
  }, []);

  const finishTrip = useCallback((tripId: string) => {
    setJustCompletedTripId(tripId);
    setState((s) => ({
      ...s,
      trips: s.trips.map((t) => (t.id === tripId ? { ...t, status: "complete" } : t)),
    }));
  }, []);

  const setTripDay = useCallback((tripId: string, day: number) => {
    setState((s) => ({
      ...s,
      trips: s.trips.map((t) => {
        if (t.id !== tripId) return t;
        const clamped = Math.min(Math.max(Math.round(day), 1), t.durationDays);
        return { ...t, simulatedTodayISO: tripDateForDay(t, clamped) };
      }),
    }));
  }, []);

  const goToNextDay = useCallback((tripId: string) => {
    setState((s) => ({
      ...s,
      trips: s.trips.map((t) =>
        t.id === tripId ? { ...t, simulatedTodayISO: addDaysISO(effectiveToday(t), 1) } : t,
      ),
    }));
  }, []);

  const startNewTripFlow = useCallback(() => {
    setState((s) => ({ ...s, activeTripId: null }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState((s) => ({ ...s, darkMode: !s.darkMode }));
  }, []);

  const markTutorialSeen = useCallback(() => {
    setState((s) => ({ ...s, seenTutorial: true }));
  }, []);

  const devAdvanceDay = useCallback(() => {
    setState((s) => {
      if (!s.activeTripId) return s;
      const trip = s.trips.find((t) => t.id === s.activeTripId);
      if (!trip) return s;
      return {
        ...s,
        trips: s.trips.map((t) =>
          t.id === trip.id ? { ...t, simulatedTodayISO: addDaysISO(effectiveToday(t), 1) } : t,
        ),
      };
    });
  }, []);

  const devClearAll = useCallback(() => {
    setState({
      trips: [],
      activeTripId: null,
      lastOpenedDayNumber: null,
      darkMode: state.darkMode,
      seenTutorial: true,
      acknowledgedTripId: null,
    });
  }, [state.darkMode]);

  const devSeedDemoTrip = useCallback(() => {
    const trip = createTrip({
      name: "Lisbon",
      totalBudget: 900,
      durationDays: 6,
      startDate: threeDaysAgo(),
    });
    return trip;
  }, [createTrip]);

  const value: TripDataContextValue = {
    state,
    activeTrip,
    derivedScreen,
    dayJustRolledOver,
    acknowledgeDayRollover,
    justCompletedTripId,
    acknowledgeTripComplete,
    createTrip,
    addCategory,
    logExpense,
    editExpense,
    deleteExpense,
    undoLastExpense,
    lastLoggedExpenseId,
    clearLastLogged,
    markOvershootAcknowledged,
    setActiveTrip,
    finishTrip,
    setTripDay,
    goToNextDay,
    startNewTripFlow,
    toggleDarkMode,
    markTutorialSeen,
    devAdvanceDay,
    devClearAll,
    devSeedDemoTrip,
  };

  return (
    <TripDataContext.Provider value={value}>{children}</TripDataContext.Provider>
  );
}

export function useTripData(): TripDataContextValue {
  const ctx = useContext(TripDataContext);
  if (!ctx) throw new Error("useTripData must be used within TripDataProvider");
  return ctx;
}

/** Combine a chosen calendar date with the current time-of-day, for sensible chronological ordering. */
function loggedAtForDate(dateISO: string): number {
  const now = new Date();
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()).getTime();
}

function threeDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return todayISOFrom(d);
}

function todayISOFrom(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
