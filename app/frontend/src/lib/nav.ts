import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  CreditCard,
  ClipboardList,
  Dumbbell,
  UserPlus,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Branches", href: "/branches", icon: Building2 },
  { title: "Members", href: "/members", icon: Users },
  { title: "Staff", href: "/staff", icon: UserCog },
  { title: "Plans", href: "/plans", icon: CreditCard },
  { title: "Subscriptions", href: "/subscriptions", icon: ClipboardList },
  { title: "Trainers", href: "/trainers", icon: Dumbbell },
  { title: "Registrations", href: "/registrations", icon: UserPlus },
  { title: "Training Sessions", href: "/training-sessions", icon: CalendarClock },
];
