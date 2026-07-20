"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import type { Exercise, MemberWorkout, Paginated } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PortalWorkoutsPage() {
  const [workouts, setWorkouts] = useState<MemberWorkout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [workoutsRes, exercisesRes] = await Promise.all([
        fetch("/api/portal/my-workouts?per_page=30"),
        fetch("/api/portal/exercises?per_page=100"),
      ]);
      const workoutsData: Paginated<MemberWorkout> = await workoutsRes.json();
      const exercisesData: Paginated<Exercise> = await exercisesRes.json();
      setWorkouts(workoutsData.data ?? []);
      setExercises(exercisesData.data ?? []);
    } catch {
      crudToast.error("Failed to load workouts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleComplete(workout: MemberWorkout) {
    setCompletingId(workout.id);
    try {
      const res = await fetch(`/api/portal/my-workouts/${workout.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to complete workout.");
        return;
      }
      crudToast.action("Workout marked complete.");
      load();
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Workouts</h1>
        <p className="text-sm text-muted-foreground">Scheduled workouts and the exercise library</p>
      </div>

      <Tabs defaultValue="workouts">
        <TabsList>
          <TabsTrigger value="workouts">My Workouts</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
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
                        No workouts logged yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    workouts.map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell className="font-medium">{workout.date}</TableCell>
                        <TableCell>{workout.trainer?.user.name ?? "—"}</TableCell>
                        <TableCell className="capitalize">{workout.type}</TableCell>
                        <TableCell>
                          {workout.duration_minutes ? `${workout.duration_minutes} min` : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={workout.status === "completed" ? "default" : "secondary"}>
                            {workout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {workout.status === "scheduled" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={completingId === workout.id}
                              onClick={() => handleComplete(workout)}
                            >
                              {completingId === workout.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Check className="size-4 text-primary" />
                              )}
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
        </TabsContent>

        <TabsContent value="exercises">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exercises.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No exercises available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    exercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-medium">{exercise.name}</TableCell>
                        <TableCell className="capitalize">{exercise.category}</TableCell>
                        <TableCell>{exercise.muscle_group ?? "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
