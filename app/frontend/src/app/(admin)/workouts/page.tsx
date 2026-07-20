"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import type { Exercise, Member, MemberWorkout, Paginated, Trainer } from "@/lib/types";
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
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

type ExerciseForm = {
  name: string;
  category: Exercise["category"];
  muscle_group: string;
  equipment_needed: string;
  description: string;
};

const EMPTY_EXERCISE_FORM: ExerciseForm = {
  name: "",
  category: "strength",
  muscle_group: "",
  equipment_needed: "",
  description: "",
};

type WorkoutExerciseRow = { exercise_id: string; sets: string; reps: string; weight: string };

type WorkoutForm = {
  member_id: string;
  trainer_id: string;
  date: string;
  duration_minutes: string;
  type: MemberWorkout["type"];
  intensity: MemberWorkout["intensity"];
  notes: string;
  exercises: WorkoutExerciseRow[];
};

const EMPTY_WORKOUT_FORM: WorkoutForm = {
  member_id: "",
  trainer_id: "",
  date: new Date().toISOString().slice(0, 10),
  duration_minutes: "",
  type: "personal",
  intensity: "medium",
  notes: "",
  exercises: [],
};

export default function WorkoutsPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<MemberWorkout[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState<ExerciseForm>(EMPTY_EXERCISE_FORM);
  const [savingExercise, setSavingExercise] = useState(false);
  const [deleteExerciseTarget, setDeleteExerciseTarget] = useState<Exercise | null>(null);
  const [deletingExercise, setDeletingExercise] = useState(false);

  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [workoutForm, setWorkoutForm] = useState<WorkoutForm>(EMPTY_WORKOUT_FORM);
  const [savingWorkout, setSavingWorkout] = useState(false);
  const [deleteWorkoutTarget, setDeleteWorkoutTarget] = useState<MemberWorkout | null>(null);
  const [deletingWorkout, setDeletingWorkout] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [exRes, woRes, memRes, trRes] = await Promise.all([
        fetch("/api/admin/exercises?per_page=100"),
        fetch("/api/admin/member-workouts?per_page=50"),
        fetch("/api/admin/members?per_page=100"),
        fetch("/api/admin/trainers?per_page=100"),
      ]);
      const exData: Paginated<Exercise> = await exRes.json();
      const woData: Paginated<MemberWorkout> = await woRes.json();
      const memData: Paginated<Member> = await memRes.json();
      const trData: Paginated<Trainer> = await trRes.json();
      setExercises(exData.data ?? []);
      setWorkouts(woData.data ?? []);
      setMembers(memData.data ?? []);
      setTrainers(trData.data ?? []);
    } catch {
      crudToast.error("Failed to load workout data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreateExercise() {
    setEditingExercise(null);
    setExerciseForm(EMPTY_EXERCISE_FORM);
    setExerciseDialogOpen(true);
  }

  function openEditExercise(exercise: Exercise) {
    setEditingExercise(exercise);
    setExerciseForm({
      name: exercise.name,
      category: exercise.category,
      muscle_group: exercise.muscle_group ?? "",
      equipment_needed: exercise.equipment_needed ?? "",
      description: exercise.description ?? "",
    });
    setExerciseDialogOpen(true);
  }

  async function handleExerciseSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingExercise(true);
    try {
      const payload = {
        name: exerciseForm.name,
        category: exerciseForm.category,
        muscle_group: exerciseForm.muscle_group || null,
        equipment_needed: exerciseForm.equipment_needed || null,
        description: exerciseForm.description || null,
      };
      const url = editingExercise
        ? `/api/admin/exercises/${editingExercise.id}`
        : "/api/admin/exercises";
      const res = await fetch(url, {
        method: editingExercise ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save exercise.");
        return;
      }
      crudToast[editingExercise ? "updated" : "created"]("Exercise");
      setExerciseDialogOpen(false);
      load();
    } finally {
      setSavingExercise(false);
    }
  }

  async function handleDeleteExercise() {
    if (!deleteExerciseTarget) return;
    setDeletingExercise(true);
    try {
      const res = await fetch(`/api/admin/exercises/${deleteExerciseTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete exercise.");
        return;
      }
      crudToast.deleted("Exercise");
      setDeleteExerciseTarget(null);
      load();
    } finally {
      setDeletingExercise(false);
    }
  }

  function openCreateWorkout() {
    setWorkoutForm(EMPTY_WORKOUT_FORM);
    setWorkoutDialogOpen(true);
  }

  function addExerciseRow() {
    setWorkoutForm({
      ...workoutForm,
      exercises: [...workoutForm.exercises, { exercise_id: "", sets: "", reps: "", weight: "" }],
    });
  }

  function updateExerciseRow(index: number, patch: Partial<WorkoutExerciseRow>) {
    const next = [...workoutForm.exercises];
    next[index] = { ...next[index], ...patch };
    setWorkoutForm({ ...workoutForm, exercises: next });
  }

  function removeExerciseRow(index: number) {
    setWorkoutForm({
      ...workoutForm,
      exercises: workoutForm.exercises.filter((_, i) => i !== index),
    });
  }

  async function handleWorkoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingWorkout(true);
    try {
      const payload = {
        member_id: Number(workoutForm.member_id),
        trainer_id: workoutForm.trainer_id ? Number(workoutForm.trainer_id) : null,
        date: workoutForm.date,
        duration_minutes: workoutForm.duration_minutes ? Number(workoutForm.duration_minutes) : null,
        type: workoutForm.type,
        intensity: workoutForm.intensity,
        notes: workoutForm.notes || null,
        exercises: workoutForm.exercises
          .filter((row) => row.exercise_id)
          .map((row) => ({
            exercise_id: Number(row.exercise_id),
            sets: row.sets ? Number(row.sets) : null,
            reps: row.reps ? Number(row.reps) : null,
            weight: row.weight ? Number(row.weight) : null,
          })),
      };
      const res = await fetch("/api/admin/member-workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to create workout.");
        return;
      }
      crudToast.created("Workout");
      setWorkoutDialogOpen(false);
      load();
    } finally {
      setSavingWorkout(false);
    }
  }

  async function handleDeleteWorkout() {
    if (!deleteWorkoutTarget) return;
    setDeletingWorkout(true);
    try {
      const res = await fetch(`/api/admin/member-workouts/${deleteWorkoutTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete workout.");
        return;
      }
      crudToast.deleted("Workout");
      setDeleteWorkoutTarget(null);
      load();
    } finally {
      setDeletingWorkout(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Workouts</h1>
        <p className="text-sm text-muted-foreground">Exercise library and member workout sessions</p>
      </div>

      <Tabs defaultValue="workouts">
        <TabsList>
          <TabsTrigger value="workouts">Member Workouts</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts">
          <div className="mb-4 flex justify-end">
            <Button onClick={openCreateWorkout}>
              <Plus /> New Workout
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
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
                  ) : workouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No workouts yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    workouts.map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell className="font-medium">{workout.member.user.name}</TableCell>
                        <TableCell>{workout.trainer?.user.name ?? "—"}</TableCell>
                        <TableCell>{workout.date}</TableCell>
                        <TableCell className="capitalize">{workout.type}</TableCell>
                        <TableCell>
                          <Badge variant={workout.status === "completed" ? "default" : "secondary"}>
                            {workout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteWorkoutTarget(workout)}
                          >
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

        <TabsContent value="exercises">
          <div className="mb-4 flex justify-end">
            <Button onClick={openCreateExercise}>
              <Plus /> New Exercise
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exercise Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Muscle Group</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exercises.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No exercises yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    exercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-medium">{exercise.name}</TableCell>
                        <TableCell className="capitalize">{exercise.category}</TableCell>
                        <TableCell>{exercise.muscle_group ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditExercise(exercise)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteExerciseTarget(exercise)}
                          >
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

      <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
        <DialogContent>
          <form onSubmit={handleExerciseSubmit}>
            <DialogHeader>
              <DialogTitle>{editingExercise ? "Edit Exercise" : "New Exercise"}</DialogTitle>
              <DialogDescription>
                {editingExercise ? "Update this exercise." : "Add a new exercise to the library."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ex_name">Name</Label>
                <Input
                  id="ex_name"
                  required
                  value={exerciseForm.name}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={exerciseForm.category}
                    onValueChange={(v: Exercise["category"]) =>
                      setExerciseForm({ ...exerciseForm, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="balance">Balance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="muscle_group">Muscle Group</Label>
                  <Input
                    id="muscle_group"
                    value={exerciseForm.muscle_group}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, muscle_group: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="equipment_needed">Equipment Needed</Label>
                <Input
                  id="equipment_needed"
                  value={exerciseForm.equipment_needed}
                  onChange={(e) =>
                    setExerciseForm({ ...exerciseForm, equipment_needed: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ex_description">Description</Label>
                <Textarea
                  id="ex_description"
                  value={exerciseForm.description}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={savingExercise}>
                {savingExercise && <Loader2 className="animate-spin" />}
                {editingExercise ? "Save changes" : "Create exercise"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={workoutDialogOpen} onOpenChange={setWorkoutDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <form onSubmit={handleWorkoutSubmit}>
            <DialogHeader>
              <DialogTitle>New Workout</DialogTitle>
              <DialogDescription>Log a workout session for a member.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Member</Label>
                  <Select
                    value={workoutForm.member_id}
                    onValueChange={(v) => setWorkoutForm({ ...workoutForm, member_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={String(member.id)}>
                          {member.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Trainer (optional)</Label>
                  <Select
                    value={workoutForm.trainer_id || "none"}
                    onValueChange={(v) =>
                      setWorkoutForm({ ...workoutForm, trainer_id: v === "none" ? "" : v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={String(trainer.id)}>
                          {trainer.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="wo_date">Date</Label>
                  <Input
                    id="wo_date"
                    type="date"
                    required
                    value={workoutForm.date}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={workoutForm.duration_minutes}
                    onChange={(e) =>
                      setWorkoutForm({ ...workoutForm, duration_minutes: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={workoutForm.type}
                    onValueChange={(v: MemberWorkout["type"]) =>
                      setWorkoutForm({ ...workoutForm, type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Intensity</Label>
                  <Select
                    value={workoutForm.intensity}
                    onValueChange={(v: MemberWorkout["intensity"]) =>
                      setWorkoutForm({ ...workoutForm, intensity: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <Label>Exercises</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addExerciseRow}>
                    <Plus className="size-4" /> Add
                  </Button>
                </div>
                {workoutForm.exercises.map((row, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2">
                    <Select
                      value={row.exercise_id}
                      onValueChange={(v) => updateExerciseRow(index, { exercise_id: v })}
                    >
                      <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        {exercises.map((exercise) => (
                          <SelectItem key={exercise.id} value={String(exercise.id)}>
                            {exercise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Sets"
                      value={row.sets}
                      onChange={(e) => updateExerciseRow(index, { sets: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={row.reps}
                      onChange={(e) => updateExerciseRow(index, { reps: e.target.value })}
                    />
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        placeholder="Weight"
                        value={row.weight}
                        onChange={(e) => updateExerciseRow(index, { weight: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExerciseRow(index)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="wo_notes">Notes</Label>
                <Textarea
                  id="wo_notes"
                  value={workoutForm.notes}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={savingWorkout || !workoutForm.member_id}>
                {savingWorkout && <Loader2 className="animate-spin" />}
                Create workout
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteExerciseTarget}
        onOpenChange={(open) => !open && setDeleteExerciseTarget(null)}
        title="Delete exercise?"
        description={`This will permanently delete "${deleteExerciseTarget?.name}". This cannot be undone.`}
        onConfirm={handleDeleteExercise}
        loading={deletingExercise}
      />

      <DeleteConfirmDialog
        open={!!deleteWorkoutTarget}
        onOpenChange={(open) => !open && setDeleteWorkoutTarget(null)}
        title="Delete workout?"
        description="This will permanently delete this workout session. This cannot be undone."
        onConfirm={handleDeleteWorkout}
        loading={deletingWorkout}
      />
    </div>
  );
}
