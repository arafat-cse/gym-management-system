"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Star, X } from "lucide-react";

import type { Paginated, Trainer, TrainingSession } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

const SESSION_STATUS_VARIANT: Record<
  TrainingSession["status"],
  "default" | "secondary" | "destructive"
> = {
  pending: "secondary",
  confirmed: "default",
  completed: "default",
  cancelled: "destructive",
  no_show: "destructive",
};

export default function PortalTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookTarget, setBookTarget] = useState<Trainer | null>(null);
  const [bookForm, setBookForm] = useState({
    session_date: "",
    start_time: "",
    end_time: "",
    session_type: "personal" as "personal" | "group" | "online",
    notes: "",
  });
  const [booking, setBooking] = useState(false);

  const [ratingTarget, setRatingTarget] = useState<TrainingSession | null>(null);
  const [rating, setRating] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [trainersRes, sessionsRes] = await Promise.all([
        fetch("/api/portal/trainers"),
        fetch("/api/portal/training-sessions?per_page=30"),
      ]);
      const trainersData: Trainer[] = await trainersRes.json();
      setTrainers(trainersData ?? []);
      const sessionsData: Paginated<TrainingSession> = await sessionsRes.json();
      setSessions(sessionsData.data ?? []);
    } catch {
      crudToast.error("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openBook(trainer: Trainer) {
    setBookTarget(trainer);
    setBookForm({ session_date: "", start_time: "", end_time: "", session_type: "personal", notes: "" });
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!bookTarget) return;
    setBooking(true);
    try {
      const res = await fetch("/api/portal/training-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainer_id: bookTarget.id,
          session_date: bookForm.session_date,
          start_time: bookForm.start_time,
          end_time: bookForm.end_time,
          session_type: bookForm.session_type,
          notes: bookForm.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to book session.");
        return;
      }
      crudToast.action("Session booked. Awaiting trainer confirmation.");
      setBookTarget(null);
      load();
    } finally {
      setBooking(false);
    }
  }

  async function handleCancel(session: TrainingSession) {
    setCancellingId(session.id);
    try {
      const res = await fetch(`/api/portal/training-sessions/${session.id}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to cancel session.");
        return;
      }
      crudToast.action("Session cancelled.");
      load();
    } finally {
      setCancellingId(null);
    }
  }

  async function handleRate(e: React.FormEvent) {
    e.preventDefault();
    if (!ratingTarget) return;
    setSubmittingRating(true);
    try {
      const res = await fetch(`/api/portal/training-sessions/${ratingTarget.id}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_rating: rating }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to submit rating.");
        return;
      }
      crudToast.action("Rating submitted.");
      setRatingTarget(null);
      load();
    } finally {
      setSubmittingRating(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Trainers</h1>
        <p className="text-sm text-muted-foreground">Browse trainers and manage your sessions</p>
      </div>

      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trainers.map((trainer) => (
                <Card key={trainer.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Link href={`/portal/trainers/${trainer.id}`} className="hover:underline">
                        {trainer.user.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {trainer.specialization ?? "General Trainer"}
                    </p>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <p className="flex items-center gap-1 text-sm">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {trainer.rating_avg ?? "—"} · {trainer.total_sessions} sessions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ৳{trainer.session_rate ?? "—"} / session
                    </p>
                    <Button size="sm" onClick={() => openBook(trainer)}>
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">My Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No sessions booked yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.trainer.user.name}</TableCell>
                        <TableCell>{session.session_date}</TableCell>
                        <TableCell>
                          {session.start_time}–{session.end_time}
                        </TableCell>
                        <TableCell>
                          <Badge variant={SESSION_STATUS_VARIANT[session.status]}>
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {["pending", "confirmed"].includes(session.status) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={cancellingId === session.id}
                              onClick={() => handleCancel(session)}
                            >
                              {cancellingId === session.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <X className="size-4 text-destructive" />
                              )}
                            </Button>
                          )}
                          {session.status === "completed" && !session.member_rating && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setRatingTarget(session);
                                setRating(5);
                              }}
                            >
                              <Star className="size-4 text-amber-400" />
                            </Button>
                          )}
                          {session.member_rating && (
                            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {session.member_rating}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!bookTarget} onOpenChange={(open) => !open && setBookTarget(null)}>
        <DialogContent>
          <form onSubmit={handleBook}>
            <DialogHeader>
              <DialogTitle>Book Session with {bookTarget?.user.name}</DialogTitle>
              <DialogDescription>Fee: ৳{bookTarget?.session_rate ?? "—"} per session</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="session_date">Date</Label>
                <Input
                  id="session_date"
                  type="date"
                  required
                  value={bookForm.session_date}
                  onChange={(e) => setBookForm({ ...bookForm, session_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_time">Start time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    required
                    value={bookForm.start_time}
                    onChange={(e) => setBookForm({ ...bookForm, start_time: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_time">End time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    required
                    value={bookForm.end_time}
                    onChange={(e) => setBookForm({ ...bookForm, end_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Session Type</Label>
                <Select
                  value={bookForm.session_type}
                  onValueChange={(v: "personal" | "group" | "online") =>
                    setBookForm({ ...bookForm, session_type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={bookForm.notes}
                  onChange={(e) => setBookForm({ ...bookForm, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={booking}>
                {booking && <Loader2 className="animate-spin" />}
                Book Session
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!ratingTarget} onOpenChange={(open) => !open && setRatingTarget(null)}>
        <DialogContent>
          <form onSubmit={handleRate}>
            <DialogHeader>
              <DialogTitle>Rate Your Session</DialogTitle>
              <DialogDescription>With {ratingTarget?.trainer.user.name}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center gap-2 py-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)}>
                  <Star
                    className={`size-8 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submittingRating}>
                {submittingRating && <Loader2 className="animate-spin" />}
                Submit Rating
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
