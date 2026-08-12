import { useTripData } from "../../data/useTripData";
import { HomeEmpty } from "./HomeEmpty";
import { HomeReturning } from "./HomeReturning";
import { HomeUpcoming } from "./HomeUpcoming";
import { HomeActiveDay } from "./HomeActiveDay";
import { HomeTripComplete } from "./HomeTripComplete";

export function HomeRouter() {
  const { state, derivedScreen } = useTripData();

  if (derivedScreen === "empty") {
    return state.trips.length > 0 ? <HomeReturning /> : <HomeEmpty />;
  }
  if (derivedScreen === "upcoming") return <HomeUpcoming />;
  if (derivedScreen === "complete") return <HomeTripComplete />;
  return <HomeActiveDay />;
}
