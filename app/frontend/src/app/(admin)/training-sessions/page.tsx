"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import type { Paginated, TrainingSession } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_VARIANT: Record<
  TrainingSession["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  no_show: "destructive",
};

type EditForm = {
  status: TrainingSession["status"];
  session_date: string;
  start_time: string;
  end_time: string;
  fee: string;
  payment_status: TrainingSession["payment_status"];
  trainer_notes: string;
};

export default function TrainingSessionsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<TrainingSession | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const qs = status === "all" ? "" : `&status=${status}`;
      const res = await fetch(`/api/admin/training-sessions?per_page=50${qs}`);
      const data: Paginated<TrainingSession> = await res.json();
      setSessions(data.data ?? []);
    } catch {
      crudToast.error("Failed to load training sessions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function openEdit(session: TrainingSession) {
    setEditing(session);
    setEditForm({
      status: session.status,
      session_date: session.session_date.slice(0, 10),
      start_time: session.start_time.slice(0, 5),
      end_time: session.end_time.slice(0, 5),
      fee: session.fee ?? "",
      payment_status: session.payment_status,
      trainer_notes: session.trainer_notes ?? "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editForm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/training-sessions/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editForm.status,
          session_date: editForm.session_date,
          start_time: editForm.start_time,
          end_time: editForm.end_time,
          fee: editForm.fee ? Number(editForm.fee) : null,
          payment_status: editForm.payment_status,
          trainer_notes: editForm.trainer_notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to update session.");
        return;
      }
      crudToast.updated("Session");
      setEditing(null);
      setEditForm(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Training Sessions</h1>
          <p className="text-sm text-muted-foreground">View and manage booked sessions</p>
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No training sessions.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.trainer?.user?.name}</TableCell>
                    <TableCell>{session.member?.user?.name}</TableCell>
                    <TableCell>
                      {session.session_date.slice(0, 10)} · {session.start_time.slice(0, 5)}–
                      {session.end_time.slice(0, 5)}
                    </TableCell>
                    <TableCell className="capitalize">{session.session_type}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[session.status]}>
                        {session.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{session.payment_status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(session)}>
                        <Pencil className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setEditForm(null);
          }
        }}
      >
        <DialogContent>
          {editForm && (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Session</DialogTitle>
                <DialogDescription>
                  {editing?.trainer?.user?.name} with {editing?.member?.user?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="session_date">Date</Label>
                    <Input
                      id="session_date"
                      type="date"
                      value={editForm.session_date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, session_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="start_time">Start</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={editForm.start_time}
                      onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end_time">End</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={editForm.end_time}
                      onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={editForm.status}
                      onValueChange={(v: TrainingSession["status"]) =>
                        setEditForm({ ...editForm, status: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no_show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment status</Label>
                    <Select
                      value={editForm.payment_status}
                      onValueChange={(v: TrainingSession["payment_status"]) =>
                        setEditForm({ ...editForm, payment_status: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fee">Fee</Label>
                  <Input
                    id="fee"
                    type="number"
                    step="0.01"
                    value={editForm.fee}
                    onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trainer_notes">Trainer notes</Label>
                  <Textarea
                    id="trainer_notes"
                    value={editForm.trainer_notes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, trainer_notes: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="animate-spin" />}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
