"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import type { Paginated, TrainingSession } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_VARIANT: Record<
  TrainingSession["status"],
  "default" | "secondary" | "destructive"
> = {
  pending: "secondary",
  confirmed: "default",
  completed: "default",
  cancelled: "destructive",
  no_show: "destructive",
};

type FilterStatus = TrainingSession["status"] | "all";

export default function PortalSessionsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [status, setStatus] = useState<FilterStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const qs = status === "all" ? "" : `&status=${status}`;
      const res = await fetch(`/api/portal/my-training-sessions?per_page=30${qs}`);
      const data: Paginated<TrainingSession> = await res.json();
      setSessions(data.data ?? []);
    } catch {
      crudToast.error("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function updateStatus(session: TrainingSession, next: string) {
    setActingId(session.id);
    try {
      const res = await fetch(`/api/portal/my-training-sessions/${session.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to update session.");
        return;
      }
      crudToast.action(`Session ${next}.`);
      load();
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Sessions</h1>
        <p className="text-sm text-muted-foreground">Training sessions booked with you by members</p>
      </div>

      <Tabs value={status} onValueChange={(v) => setStatus(v as FilterStatus)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No sessions.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.member.user.name}</TableCell>
                    <TableCell>{session.session_date}</TableCell>
                    <TableCell>
                      {session.start_time}–{session.end_time}
                    </TableCell>
                    <TableCell>৳{session.fee ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[session.status]}>{session.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {session.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actingId === session.id}
                            onClick={() => updateStatus(session, "confirmed")}
                          >
                            {actingId === session.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Check className="size-4 text-primary" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actingId === session.id}
                            onClick={() => updateStatus(session, "cancelled")}
                          >
                            <X className="size-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      {session.status === "confirmed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={actingId === session.id}
                          onClick={() => updateStatus(session, "completed")}
                        >
                          {actingId === session.id && <Loader2 className="size-4 animate-spin" />}
                          Mark Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
