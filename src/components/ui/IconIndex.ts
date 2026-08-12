import {
  House,
  BarChart3,
  MessageCircle,
  UserCircle,
  Utensils,
  BedDouble,
  TramFront,
  Ticket,
  CircleDot,
  Plus,
  ArrowLeft,
  X,
  Search,
  Filter,
  Sun,
  Moon,
  Share2,
  Pencil,
  Trash2,
  ChevronRight,
  ArrowDownUp,
  TrendingUp,
  Sparkles,
  Check,
  Calendar,
  SkipForward,
  Flag,
  Sunrise,
  Sunset,
  PartyPopper,
  ChevronDown,
  Menu,
  Settings,
  UserPlus,
  Users,
  SlidersHorizontal,
  HelpCircle,
  LogIn,
  Plane,
  ShoppingBag,
  HeartPulse,
  Wallet,
  TrendingDown,
  Flame,
  Trophy,
  Award,
  Target,
  Send,
  Bot,
  Lock,
} from "lucide-react";
import { createElement } from "react";
import type { LucideIcon } from "lucide-react";

export function Icon({
  icon: IconCmp,
  size = 24,
  className,
  strokeWidth = 1.75,
}: {
  icon: LucideIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return createElement(IconCmp, { size, strokeWidth, className, absoluteStrokeWidth: false });
}

export {
  House,
  BarChart3,
  MessageCircle,
  UserCircle,
  Utensils,
  BedDouble,
  TramFront,
  Ticket,
  CircleDot,
  Plus,
  ArrowLeft,
  X,
  Search,
  Filter,
  Sun,
  Moon,
  Share2,
  Pencil,
  Trash2,
  ChevronRight,
  ArrowDownUp,
  TrendingUp,
  Sparkles,
  Check,
  Calendar,
  SkipForward,
  Flag,
  Sunrise,
  Sunset,
  PartyPopper,
  ChevronDown,
  Menu,
  Settings,
  UserPlus,
  Users,
  SlidersHorizontal,
  HelpCircle,
  LogIn,
  Plane,
  ShoppingBag,
  HeartPulse,
  Wallet,
  TrendingDown,
  Flame,
  Trophy,
  Award,
  Target,
  Send,
  Bot,
  Lock,
};

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  food: Utensils,
  stay: BedDouble,
  transport: TramFront,
  activities: Ticket,
  flights: Plane,
  shopping: ShoppingBag,
  health: HeartPulse,
  other: CircleDot,
};

export function categoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICON_MAP[icon] ?? CircleDot;
}

const ICON_KEYWORDS: [string, string][] = [
  ["food", "food"],
  ["eat", "food"],
  ["restaurant", "food"],
  ["stay", "stay"],
  ["hotel", "stay"],
  ["lodg", "stay"],
  ["transport", "transport"],
  ["taxi", "transport"],
  ["train", "transport"],
  ["activit", "activities"],
  ["ticket", "activities"],
  ["flight", "flights"],
  ["fly", "flights"],
  ["shop", "shopping"],
  ["health", "health"],
  ["pharma", "health"],
  ["medic", "health"],
];

export function inferCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  const match = ICON_KEYWORDS.find(([keyword]) => lower.includes(keyword));
  return match ? match[1] : "other";
}
