export type PaceStatus = "onPace" | "tight" | "over";
export type TripStatus = "upcoming" | "active" | "complete";
export type ScreenState = "empty" | "upcoming" | "active" | "complete";

export interface Currency {
  code: string;
  symbol: string;
}

export interface Category {
  id: string;
  tripId: string;
  name: string;
  icon: string;
  isDefault: boolean;
}

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  categoryId: string;
  note: string;
  loggedAt: number;
  dayNumber: number;
}

export interface Trip {
  id: string;
  name: string;
  totalBudget: number;
  durationDays: number;
  startDate: string; // ISO date, yyyy-mm-dd
  currency: Currency;
  categories: Category[];
  expenses: Expense[];
  status: TripStatus;
  overshootAcknowledged: boolean;
  overshootRaisedBudget?: number;
  note?: string;
  /** Overrides "today" for this trip's day math, without touching startDate. Used by day-advance controls. */
  simulatedTodayISO?: string;
}

export interface AppState {
  trips: Trip[];
  activeTripId: string | null;
  lastOpenedDayNumber: number | null;
  darkMode: boolean;
  seenTutorial: boolean;
  /** Trip id the user has dismissed the "Trip complete" celebration for — once acknowledged, Home falls back to the returning-user homepage instead of re-showing the celebration. */
  acknowledgedTripId: string | null;
}
