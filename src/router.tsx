import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTripData } from "./data/useTripData";
import { OnboardingIntro } from "./features/onboarding/OnboardingIntro";
import { OnboardingCarousel } from "./features/onboarding/OnboardingCarousel";
import { NewTrip } from "./features/trip-setup/NewTrip";
import { ChooseCategory } from "./features/trip-setup/ChooseCategory";
import { HomeRouter } from "./features/home/HomeRouter";
import { FinishTripConfirm } from "./features/home/FinishTripConfirm";
import { AddExpense } from "./features/expense/AddExpense";
import { EditExpense } from "./features/expense/EditExpense";
import { ExpenseSuccess } from "./features/expense/ExpenseSuccess";
import { TrendScreen } from "./features/trend/TrendScreen";
import { DayDetail } from "./features/trend/DayDetail";
import { SummaryScreen } from "./features/summary/SummaryScreen";
import { OvershootChoice } from "./features/overshoot/OvershootChoice";
import { SearchFilter } from "./features/search/SearchFilter";
import { AccountScreen } from "./features/account/AccountScreen";
import { AdvisorChat } from "./features/advisor/AdvisorChat";
import { DevPanel } from "./features/dev/DevPanel";
import { Placeholder } from "./components/ui/Placeholder";
import { AchievementToast } from "./components/ui/AchievementToast";

function RootRedirect() {
  const { state } = useTripData();
  if (state.trips.length === 0 && !state.seenTutorial) return <Navigate to="/intro" replace />;
  return <Navigate to="/home" replace />;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}

export function AppRouter() {
  const location = useLocation();
  return (
    <>
      <AchievementToast />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/intro" element={<PageTransition><OnboardingIntro /></PageTransition>} />
          <Route path="/tutorial" element={<PageTransition><OnboardingCarousel /></PageTransition>} />
          <Route path="/new-trip" element={<PageTransition><NewTrip /></PageTransition>} />
          <Route path="/choose-category" element={<PageTransition><ChooseCategory /></PageTransition>} />
          <Route path="/home" element={<PageTransition><HomeRouter /></PageTransition>} />
          <Route path="/finish-trip" element={<PageTransition><FinishTripConfirm /></PageTransition>} />
          <Route path="/add-expense" element={<PageTransition><AddExpense /></PageTransition>} />
          <Route path="/expense-success" element={<PageTransition><ExpenseSuccess /></PageTransition>} />
          <Route path="/edit-expense/:id" element={<PageTransition><EditExpense /></PageTransition>} />
          <Route path="/trend" element={<PageTransition><TrendScreen /></PageTransition>} />
          <Route path="/day/:tripId/:day" element={<PageTransition><DayDetail /></PageTransition>} />
          <Route path="/summary" element={<PageTransition><SummaryScreen /></PageTransition>} />
          <Route path="/summary/:tripId" element={<PageTransition><SummaryScreen /></PageTransition>} />
          <Route path="/overshoot" element={<PageTransition><OvershootChoice /></PageTransition>} />
          <Route path="/search" element={<PageTransition><SearchFilter /></PageTransition>} />
          <Route path="/search/:tripId" element={<PageTransition><SearchFilter /></PageTransition>} />
          <Route path="/account" element={<PageTransition><AccountScreen /></PageTransition>} />
          <Route path="/advisor" element={<PageTransition><AdvisorChat /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Placeholder title="Settings" /></PageTransition>} />
          <Route path="/refer-a-friend" element={<PageTransition><Placeholder title="Refer a friend" /></PageTransition>} />
          <Route path="/buddies" element={<PageTransition><Placeholder title="Add buddies to trip" /></PageTransition>} />
          <Route path="/preferences" element={<PageTransition><Placeholder title="Preferences" /></PageTransition>} />
          <Route path="/help" element={<PageTransition><Placeholder title="Help" /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Placeholder title="Create a login" /></PageTransition>} />
          <Route path="/__dev" element={<PageTransition><DevPanel /></PageTransition>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
