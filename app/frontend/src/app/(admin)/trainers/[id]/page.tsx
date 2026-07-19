"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";

import type { Trainer, TrainerSchedule, TrainerSpecialization } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

type ScheduleRow = {
  day_of_week: number;
  is_available: boolean;
  start_time: string;
  end_time: string;
  max_sessions: string;
  notes: string;
};

function defaultScheduleRows(existing: TrainerSchedule[]): ScheduleRow[] {
  return DAYS.map((day) => {
    const found = existing.find((s) => s.day_of_week === day.value);
    return {
      day_of_week: day.value,
      is_available: found?.is_available ?? false,
      start_time: found?.start_time?.slice(0, 5) ?? "09:00",
      end_time: found?.end_time?.slice(0, 5) ?? "17:00",
      max_sessions: String(found?.max_sessions ?? 1),
      notes: found?.notes ?? "",
    };
  });
}

export default function TrainerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trainerId = params.id as string;

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([]);
  const [specializations, setSpecializations] = useState<TrainerSpecialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [specDialogOpen, setSpecDialogOpen] = useState(false);
  const [specForm, setSpecForm] = useState({
    specialization_name: "",
    certification_level: "" as "" | TrainerSpecialization["certification_level"],
    certification_date: "",
    expiry_date: "",
    issuing_authority: "",
  });
  const [savingSpec, setSavingSpec] = useState(false);
  const [deleteSpec, setDeleteSpec] = useState<TrainerSpecialization | null>(null);
  const [deletingSpec, setDeletingSpec] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [trainerRes, scheduleRes, specRes] = await Promise.all([
        fetch(`/api/admin/trainers/${trainerId}`),
        fetch(`/api/admin/trainers/${trainerId}/schedule`),
        fetch(`/api/admin/trainers/${trainerId}/specializations`),
      ]);
      const trainerData: Trainer = await trainerRes.json();
      const scheduleData: TrainerSchedule[] = await scheduleRes.json();
      const specData: TrainerSpecialization[] = await specRes.json();
      setTrainer(trainerData);
      setScheduleRows(defaultScheduleRows(scheduleData ?? []));
      setSpecializations(specData ?? []);
    } catch {
      crudToast.error("Failed to load trainer.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId]);

  function updateRow(day: number, patch: Partial<ScheduleRow>) {
    setScheduleRows((rows) =>
      rows.map((row) => (row.day_of_week === day ? { ...row, ...patch } : row))
    );
  }

  async function handleSaveSchedule() {
    setSavingSchedule(true);
    try {
      const payload = {
        schedules: scheduleRows.map((row) => ({
          day_of_week: row.day_of_week,
          start_time: row.start_time,
          end_time: row.end_time,
          is_available: row.is_available,
          max_sessions: Number(row.max_sessions) || 1,
          notes: row.notes || null,
        })),
      };
      const res = await fetch(`/api/admin/trainers/${trainerId}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save schedule.");
        return;
      }
      crudToast.saved("Schedule");
      setScheduleRows(defaultScheduleRows(data));
    } finally {
      setSavingSchedule(false);
    }
  }

  async function handleAddSpecialization(e: React.FormEvent) {
    e.preventDefault();
    setSavingSpec(true);
    try {
      const res = await fetch(`/api/admin/trainers/${trainerId}/specializations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialization_name: specForm.specialization_name,
          certification_level: specForm.certification_level || null,
          certification_date: specForm.certification_date || null,
          expiry_date: specForm.expiry_date || null,
          issuing_authority: specForm.issuing_authority || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to add specialization.");
        return;
      }
      crudToast.created("Specialization");
      setSpecDialogOpen(false);
      setSpecForm({
        specialization_name: "",
        certification_level: "",
        certification_date: "",
        expiry_date: "",
        issuing_authority: "",
      });
      setSpecializations((prev) => [...prev, data]);
    } finally {
      setSavingSpec(false);
    }
  }

  async function handleDeleteSpec() {
    if (!deleteSpec) return;
    setDeletingSpec(true);
    try {
      const res = await fetch(
        `/api/admin/trainers/${trainerId}/specializations/${deleteSpec.id}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to remove specialization.");
        return;
      }
      crudToast.deleted("Specialization");
      setSpecializations((prev) => prev.filter((s) => s.id !== deleteSpec.id));
      setDeleteSpec(null);
    } finally {
      setDeletingSpec(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (!trainer) {
    return <p className="text-sm text-muted-foreground">Trainer not found.</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/trainers")}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{trainer.user.name}</h1>
          <p className="text-sm text-muted-foreground">
            {trainer.specialization ?? "Trainer"} {trainer.branch ? `· ${trainer.branch.name}` : ""}
          </p>
        </div>
        <Badge className="ml-auto">{trainer.status}</Badge>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="specializations">Specializations</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {scheduleRows.map((row) => (
                <div
                  key={row.day_of_week}
                  className="grid grid-cols-[120px_auto_1fr_1fr_100px_1fr] items-center gap-3 border-b pb-3 last:border-0"
                >
                  <span className="text-sm font-medium">
                    {DAYS.find((d) => d.value === row.day_of_week)?.label}
                  </span>
                  <Switch
                    checked={row.is_available}
                    onCheckedChange={(checked) => updateRow(row.day_of_week, { is_available: checked })}
                  />
                  <Input
                    type="time"
                    value={row.start_time}
                    disabled={!row.is_available}
                    onChange={(e) => updateRow(row.day_of_week, { start_time: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={row.end_time}
                    disabled={!row.is_available}
                    onChange={(e) => updateRow(row.day_of_week, { end_time: e.target.value })}
                  />
                  <Input
                    type="number"
                    min="1"
                    placeholder="Max"
                    value={row.max_sessions}
                    disabled={!row.is_available}
                    onChange={(e) => updateRow(row.day_of_week, { max_sessions: e.target.value })}
                  />
                  <Input
                    placeholder="Notes"
                    value={row.notes}
                    disabled={!row.is_available}
                    onChange={(e) => updateRow(row.day_of_week, { notes: e.target.value })}
                  />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveSchedule} disabled={savingSchedule}>
                  {savingSchedule && <Loader2 className="animate-spin" />}
                  Save schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specializations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Specializations</CardTitle>
              <Button size="sm" onClick={() => setSpecDialogOpen(true)}>
                <Plus /> Add
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Certified</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specializations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No specializations yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    specializations.map((spec) => (
                      <TableRow key={spec.id}>
                        <TableCell className="font-medium">{spec.specialization_name}</TableCell>
                        <TableCell>
                          {spec.certification_level ? (
                            <Badge variant="secondary">{spec.certification_level}</Badge>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>{spec.certification_date?.slice(0, 10) ?? "—"}</TableCell>
                        <TableCell>{spec.expiry_date?.slice(0, 10) ?? "—"}</TableCell>
                        <TableCell>{spec.issuing_authority ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setDeleteSpec(spec)}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
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

      <Dialog open={specDialogOpen} onOpenChange={setSpecDialogOpen}>
        <DialogContent>
          <form onSubmit={handleAddSpecialization}>
            <DialogHeader>
              <DialogTitle>Add Specialization</DialogTitle>
              <DialogDescription>Add a certification or specialty for this trainer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="spec_name">Specialization name</Label>
                <Input
                  id="spec_name"
                  required
                  value={specForm.specialization_name}
                  onChange={(e) =>
                    setSpecForm({ ...specForm, specialization_name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Certification level</Label>
                <Select
                  value={specForm.certification_level || "none"}
                  onValueChange={(v) =>
                    setSpecForm({
                      ...specForm,
                      certification_level:
                        v === "none" ? "" : (v as TrainerSpecialization["certification_level"]),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unspecified</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cert_date">Certification date</Label>
                  <Input
                    id="cert_date"
                    type="date"
                    value={specForm.certification_date}
                    onChange={(e) =>
                      setSpecForm({ ...specForm, certification_date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiry_date">Expiry date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={specForm.expiry_date}
                    onChange={(e) => setSpecForm({ ...specForm, expiry_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issuing_authority">Issuing authority</Label>
                <Input
                  id="issuing_authority"
                  value={specForm.issuing_authority}
                  onChange={(e) =>
                    setSpecForm({ ...specForm, issuing_authority: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={savingSpec}>
                {savingSpec && <Loader2 className="animate-spin" />}
                Add specialization
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteSpec}
        onOpenChange={(open) => !open && setDeleteSpec(null)}
        title="Remove specialization?"
        description={`This will remove "${deleteSpec?.specialization_name}" from this trainer.`}
        onConfirm={handleDeleteSpec}
        loading={deletingSpec}
      />
    </div>
  );
}
