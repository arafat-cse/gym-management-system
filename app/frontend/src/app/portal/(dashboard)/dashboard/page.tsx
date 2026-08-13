import {
  CreditCard,
  Salad,
  CalendarClock,
  KeyRound,
  CalendarOff,
  Star,
  ClipboardList,
  Award,
} from "lucide-react";

import type {
  AuthUser,
  LeaveRequest,
  MemberDiet,
  Paginated,
  Subscription,
  TrainingSession,
} from "@/lib/types";
import { portalApi } from "@/lib/portal-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function memberStats() {
  const [subscription, diets, sessions] = await Promise.all([
    portalApi<Subscription>("subscription"),
    portalApi<Paginated<MemberDiet>>("my-diet"),
    portalApi<Paginated<TrainingSession>>("training-sessions?per_page=1&status=pending"),
  ]);

  return [
    {
      title: "Membership",
      value: subscription ? subscription.membership_plan.name : "No active plan",
      icon: CreditCard,
    },
    { title: "Diet Plan", value: diets ? "Active" : "None assigned", icon: Salad },
    { title: "Upcoming Sessions", value: sessions?.total ?? 0, icon: CalendarClock },
  ];
}

async function staffStats() {
  const pending = await portalApi<Paginated<LeaveRequest>>("leave-requests?per_page=1");
  return [{ title: "My Leave Requests", value: pending?.total ?? 0, icon: CalendarOff }];
}

async function trainerStats(user: AuthUser) {
  const sessions = await portalApi<Paginated<TrainingSession>>(
    "my-training-sessions?per_page=1&status=pending"
  );
  return [
    { title: "Total Sessions", value: user.trainer?.total_sessions ?? 0, icon: ClipboardList },
    { title: "Rating", value: user.trainer?.rating_avg ?? "—", icon: Star },
    { title: "Pending Requests", value: sessions?.total ?? 0, icon: CalendarClock },
    {
      title: "Specializations",
      value: user.trainer?.specializations?.length ?? 0,
      icon: Award,
    },
  ];
}

export default async function PortalDashboardPage() {
  const user = await portalApi<AuthUser>("profile");

  if (!user) return null;

  const stats =
    user.role === "member"
      ? await memberStats()
      : user.role === "staff"
        ? await staffStats()
        : await trainerStats(user);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user.first_name}</h1>
        <p className="text-sm text-muted-foreground capitalize">{user.role} overview</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {user.role === "member" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="size-4" /> Quick tip
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use the sidebar to check attendance history, book a trainer session, or view your
            payment history.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
