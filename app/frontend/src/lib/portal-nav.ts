import {
  LayoutDashboard,
  User,
  CreditCard,
  CheckSquare,
  Salad,
  Activity,
  Dumbbell,
  Wallet,
  HeartPulse,
  KeyRound,
  Star,
  CalendarOff,
  CalendarClock,
  ClipboardList,
  Award,
  type LucideIcon,
} from "lucide-react";

import type { AuthUser } from "@/lib/types";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const SHARED: NavItem[] = [
  { title: "Overview", href: "/portal/dashboard", icon: LayoutDashboard },
];

const MEMBER_NAV: NavItem[] = [
  { title: "Subscription", href: "/portal/subscription", icon: CreditCard },
  { title: "Attendance", href: "/portal/attendance", icon: CheckSquare },
  { title: "Diet Plan", href: "/portal/diet", icon: Salad },
  { title: "Workouts", href: "/portal/workouts", icon: Activity },
  { title: "Trainers", href: "/portal/trainers", icon: Dumbbell },
  { title: "Payments", href: "/portal/payments", icon: Wallet },
  { title: "Health Info", href: "/portal/health-info", icon: HeartPulse },
  { title: "Locker", href: "/portal/locker", icon: KeyRound },
  { title: "Reviews", href: "/portal/reviews", icon: Star },
];

const STAFF_NAV: NavItem[] = [
  { title: "Leave Requests", href: "/portal/leave-requests", icon: CalendarOff },
];

const TRAINER_NAV: NavItem[] = [
  { title: "My Schedule", href: "/portal/schedule", icon: CalendarClock },
  { title: "My Sessions", href: "/portal/sessions", icon: ClipboardList },
  { title: "Specializations", href: "/portal/specializations", icon: Award },
  { title: "My Reviews", href: "/portal/received-reviews", icon: Star },
];

const TAIL: NavItem[] = [{ title: "Profile", href: "/portal/profile", icon: User }];

export function portalNav(role: AuthUser["role"]): NavItem[] {
  const roleNav = role === "member" ? MEMBER_NAV : role === "staff" ? STAFF_NAV : TRAINER_NAV;
  return [...SHARED, ...roleNav, ...TAIL];
}
