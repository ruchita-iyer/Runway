import type { AppState } from "./types";

const STORAGE_KEY = "runway.state";
const VERSION = 1;

interface Envelope {
  version: number;
  data: AppState;
}

function emptyState(): AppState {
  return {
    trips: [],
    activeTripId: null,
    lastOpenedDayNumber: null,
    darkMode: false,
    seenTutorial: false,
    acknowledgedTripId: null,
    seenAchievementIds: [],
  };
}

export function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Envelope;
    if (!parsed || parsed.version !== VERSION || !parsed.data) return emptyState();
    return { ...emptyState(), ...parsed.data };
  } catch {
    return emptyState();
  }
}

export function saveState(state: AppState): void {
  const envelope: Envelope = { version: VERSION, data: state };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
}

export function clearState(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
