import { Building2, Users, UserCog, ClipboardList } from "lucide-react";

import { adminApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Paginated<T> = { data: T[]; total: number };

async function safeCount(path: string) {
  try {
    const res = await adminApi<Paginated<unknown>>(path);
    return res.total ?? res.data?.length ?? 0;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const [branches, members, staff, subscriptions] = await Promise.all([
    safeCount("branches?per_page=1"),
    safeCount("members?per_page=1"),
    safeCount("staff?per_page=1"),
    safeCount("subscriptions?per_page=1&status=active"),
  ]);

  const stats = [
    { title: "Branches", value: branches, icon: Building2 },
    { title: "Members", value: members, icon: Users },
    { title: "Staff", value: staff, icon: UserCog },
    { title: "Active Subscriptions", value: subscriptions, icon: ClipboardList },
  ];

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your gym</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value === null ? "—" : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
