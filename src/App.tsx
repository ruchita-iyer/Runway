import { BrowserRouter } from "react-router-dom";
import { TripDataProvider } from "./data/useTripData";
import { PhoneFrame } from "./layout/PhoneFrame";
import { AppRouter } from "./router";

export default function App() {
  return (
    <TripDataProvider>
      <BrowserRouter>
        <PhoneFrame>
          <AppRouter />
        </PhoneFrame>
      </BrowserRouter>
    </TripDataProvider>
  );
}
