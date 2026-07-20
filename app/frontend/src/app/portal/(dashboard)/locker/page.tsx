"use client";

import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";

import type { MemberLocker } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortalLockerPage() {
  const [locker, setLocker] = useState<MemberLocker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/portal/my-locker");
        setLocker(res.status === 200 ? await res.json() : null);
      } catch {
        crudToast.error("Failed to load locker.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Locker</h1>
        <p className="text-sm text-muted-foreground">Your assigned gym locker</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : locker ? (
        <Card className="max-w-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="size-4" /> Locker {locker.locker.number}
            </CardTitle>
            <Badge variant="secondary" className="capitalize">
              {locker.locker.size}
            </Badge>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Assigned since {new Date(locker.assigned_at).toLocaleDateString()}
            {locker.locker.branch && <p>Branch: {locker.locker.branch.name}</p>}
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-md">
          <CardContent className="py-6 text-sm text-muted-foreground">
            No locker assigned. Ask front desk to assign one.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
