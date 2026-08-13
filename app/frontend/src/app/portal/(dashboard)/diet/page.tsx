"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import type { DietPlan, DietProgress, MemberDiet, Paginated } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function PortalDietPage() {
  const [currentDiet, setCurrentDiet] = useState<MemberDiet | null>(null);
  const [progress, setProgress] = useState<DietProgress[]>([]);
  const [availablePlans, setAvailablePlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ weight: "", date: new Date().toISOString().slice(0, 10), notes: "" });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [dietRes, progressRes, plansRes] = await Promise.all([
        fetch("/api/portal/my-diet"),
        fetch("/api/portal/diet-progress?per_page=30"),
        fetch("/api/portal/diet-plans?per_page=20"),
      ]);
      setCurrentDiet(dietRes.status === 200 ? await dietRes.json() : null);
      const progressData: Paginated<DietProgress> = await progressRes.json();
      setProgress(progressData.data ?? []);
      const plansData: Paginated<DietPlan> = await plansRes.json();
      setAvailablePlans(plansData.data ?? []);
    } catch {
      crudToast.error("Failed to load diet data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleLogProgress(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/diet-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: Number(form.weight),
          date: form.date,
          notes: form.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to log progress.");
        return;
      }
      crudToast.action("Progress logged.");
      setForm({ weight: "", date: new Date().toISOString().slice(0, 10), notes: "" });
      load();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Diet Plan</h1>
        <p className="text-sm text-muted-foreground">Nutrition plan, meals, and weight progress</p>
      </div>

      <Tabs defaultValue="diet">
        <TabsList>
          <TabsTrigger value="diet">My Diet</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="browse">Browse Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="diet">
          {currentDiet ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{currentDiet.diet_plan.name}</CardTitle>
                <Badge>{currentDiet.status}</Badge>
              </CardHeader>
              <CardContent className="grid gap-3">
                <p className="text-sm text-muted-foreground">
                  {currentDiet.diet_plan.description ?? "No description provided."}
                </p>
                <p className="text-sm">
                  {currentDiet.diet_plan.duration_in_days} days ·{" "}
                  {currentDiet.diet_plan.calories ?? "—"} kcal/day target
                </p>
                <div className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Meals
                  </span>
                  {(currentDiet.diet_plan.meals ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No meals added yet.</p>
                  ) : (
                    currentDiet.diet_plan.meals?.map((meal) => (
                      <div key={meal.id} className="rounded-lg border p-3 text-sm">
                        <span className="font-medium capitalize">{meal.meal_type}</span> — {meal.name}
                        <div className="text-xs text-muted-foreground">
                          {meal.calories ?? 0} kcal · P{meal.protein ?? 0} · C{meal.carbs ?? 0} · F
                          {meal.fats ?? 0}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                No diet plan assigned yet. Ask front desk to assign one.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress">
          <div className="grid gap-4 md:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progress Log</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progress.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No entries yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      progress.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell className="font-medium">{entry.weight} kg</TableCell>
                          <TableCell>{entry.notes ?? "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="size-4" /> Log Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogProgress} className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      required
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin" />}
                    Log Entry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Available Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Calories</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availablePlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No plans available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    availablePlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell className="capitalize">{plan.type.replace("_", " ")}</TableCell>
                        <TableCell>{plan.duration_in_days} days</TableCell>
                        <TableCell>{plan.calories ?? "—"}</TableCell>
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
