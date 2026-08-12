import { House, BarChart3, MessageCircle, UserCircle } from "../components/ui/IconIndex";

export const NAV_TABS = [
  { path: "/home", label: "Home", icon: House },
  { path: "/trend", label: "Trend", icon: BarChart3 },
  { path: "/advisor", label: "Advisor", icon: MessageCircle },
  { path: "/account", label: "Account", icon: UserCircle },
] as const;
