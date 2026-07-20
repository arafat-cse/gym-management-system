"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Utensils } from "lucide-react";

import type {
  DietMeal,
  DietPlan,
  DietProgress,
  Member,
  MemberDiet,
  Paginated,
} from "@/lib/types";
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

type PlanForm = {
  name: string;
  description: string;
  duration_in_days: string;
  type: DietPlan["type"];
  calories: string;
  status: DietPlan["status"];
};

const EMPTY_PLAN_FORM: PlanForm = {
  name: "",
  description: "",
  duration_in_days: "",
  type: "general",
  calories: "",
  status: "active",
};

type MealForm = {
  meal_type: DietMeal["meal_type"];
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
};

const EMPTY_MEAL_FORM: MealForm = {
  meal_type: "breakfast",
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
};

export default function DietPlansPage() {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [assignments, setAssignments] = useState<MemberDiet[]>([]);
  const [progress, setProgress] = useState<DietProgress[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);
  const [planForm, setPlanForm] = useState<PlanForm>(EMPTY_PLAN_FORM);
  const [savingPlan, setSavingPlan] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DietPlan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [mealsTarget, setMealsTarget] = useState<DietPlan | null>(null);
  const [meals, setMeals] = useState<DietMeal[]>([]);
  const [mealForm, setMealForm] = useState<MealForm>(EMPTY_MEAL_FORM);
  const [addingMeal, setAddingMeal] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignMemberId, setAssignMemberId] = useState("");
  const [assignPlanId, setAssignPlanId] = useState("");
  const [assignStartDate, setAssignStartDate] = useState("");
  const [assigning, setAssigning] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [plansRes, assignRes, progressRes, membersRes] = await Promise.all([
        fetch("/api/admin/diet-plans?per_page=50"),
        fetch("/api/admin/member-diets?per_page=50"),
        fetch("/api/admin/diet-progress?per_page=50"),
        fetch("/api/admin/members?per_page=100"),
      ]);
      const plansData: Paginated<DietPlan> = await plansRes.json();
      const assignData: Paginated<MemberDiet> = await assignRes.json();
      const progressData: Paginated<DietProgress> = await progressRes.json();
      const membersData: Paginated<Member> = await membersRes.json();
      setPlans(plansData.data ?? []);
      setAssignments(assignData.data ?? []);
      setProgress(progressData.data ?? []);
      setMembers(membersData.data ?? []);
    } catch {
      crudToast.error("Failed to load diet data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreatePlan() {
    setEditingPlan(null);
    setPlanForm(EMPTY_PLAN_FORM);
    setPlanDialogOpen(true);
  }

  function openEditPlan(plan: DietPlan) {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description ?? "",
      duration_in_days: String(plan.duration_in_days),
      type: plan.type,
      calories: plan.calories ? String(plan.calories) : "",
      status: plan.status,
    });
    setPlanDialogOpen(true);
  }

  async function handlePlanSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingPlan(true);
    try {
      const payload = {
        name: planForm.name,
        description: planForm.description || null,
        duration_in_days: Number(planForm.duration_in_days),
        type: planForm.type,
        calories: planForm.calories ? Number(planForm.calories) : null,
        status: planForm.status,
      };
      const url = editingPlan ? `/api/admin/diet-plans/${editingPlan.id}` : "/api/admin/diet-plans";
      const res = await fetch(url, {
        method: editingPlan ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save diet plan.");
        return;
      }
      crudToast[editingPlan ? "updated" : "created"]("Diet plan");
      setPlanDialogOpen(false);
      load();
    } finally {
      setSavingPlan(false);
    }
  }

  async function handleDeletePlan() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/diet-plans/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete diet plan.");
        return;
      }
      crudToast.deleted("Diet plan");
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  }

  async function openMeals(plan: DietPlan) {
    setMealsTarget(plan);
    setMealForm(EMPTY_MEAL_FORM);
    const res = await fetch(`/api/admin/diet-plans/${plan.id}/meals`);
    const data: DietMeal[] = await res.json();
    setMeals(data ?? []);
  }

  async function handleAddMeal(e: React.FormEvent) {
    e.preventDefault();
    if (!mealsTarget) return;
    setAddingMeal(true);
    try {
      const payload = {
        meal_type: mealForm.meal_type,
        name: mealForm.name,
        calories: mealForm.calories ? Number(mealForm.calories) : null,
        protein: mealForm.protein ? Number(mealForm.protein) : null,
        carbs: mealForm.carbs ? Number(mealForm.carbs) : null,
        fats: mealForm.fats ? Number(mealForm.fats) : null,
      };
      const res = await fetch(`/api/admin/diet-plans/${mealsTarget.id}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to add meal.");
        return;
      }
      crudToast.created("Meal");
      setMealForm(EMPTY_MEAL_FORM);
      openMeals(mealsTarget);
      load();
    } finally {
      setAddingMeal(false);
    }
  }

  async function handleRemoveMeal(meal: DietMeal) {
    if (!mealsTarget) return;
    const res = await fetch(`/api/admin/diet-plans/${mealsTarget.id}/meals/${meal.id}`, {
      method: "DELETE",
    });
    if (!res.ok && res.status !== 204) {
      crudToast.error("Failed to remove meal.");
      return;
    }
    crudToast.deleted("Meal");
    openMeals(mealsTarget);
    load();
  }

  function openAssign() {
    setAssignMemberId("");
    setAssignPlanId("");
    setAssignStartDate(new Date().toISOString().slice(0, 10));
    setAssignOpen(true);
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    setAssigning(true);
    try {
      const res = await fetch("/api/admin/member-diets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: Number(assignMemberId),
          diet_plan_id: Number(assignPlanId),
          start_date: assignStartDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to assign diet plan.");
        return;
      }
      crudToast.action("Diet plan assigned.");
      setAssignOpen(false);
      load();
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Diet Plans</h1>
        <p className="text-sm text-muted-foreground">Nutrition plans, meals, and member assignments</p>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="mb-4 flex justify-end">
            <Button onClick={openCreatePlan}>
              <Plus /> New Plan
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Calories</TableHead>
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
                  ) : plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No diet plans yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell className="capitalize">{plan.type.replace("_", " ")}</TableCell>
                        <TableCell>{plan.duration_in_days} days</TableCell>
                        <TableCell>{plan.calories ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openMeals(plan)}>
                            <Utensils className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditPlan(plan)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(plan)}>
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

        <TabsContent value="assignments">
          <div className="mb-4 flex justify-end">
            <Button onClick={openAssign}>
              <Plus /> Assign Plan
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Member Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No assignments yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.member.user.name}</TableCell>
                        <TableCell>{assignment.diet_plan.name}</TableCell>
                        <TableCell>{assignment.start_date}</TableCell>
                        <TableCell>{assignment.end_date ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={assignment.status === "active" ? "default" : "secondary"}>
                            {assignment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progress.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No progress entries yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    progress.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {entry.member_diet.member.user.name}
                        </TableCell>
                        <TableCell>{entry.member_diet.diet_plan.name}</TableCell>
                        <TableCell>{entry.weight} kg</TableCell>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.notes ?? "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <form onSubmit={handlePlanSubmit}>
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Plan" : "New Diet Plan"}</DialogTitle>
              <DialogDescription>
                {editingPlan ? "Update this diet plan." : "Create a new diet plan."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    required
                    value={planForm.duration_in_days}
                    onChange={(e) => setPlanForm({ ...planForm, duration_in_days: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calories">Target Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    value={planForm.calories}
                    onChange={(e) => setPlanForm({ ...planForm, calories: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={planForm.type}
                    onValueChange={(v: DietPlan["type"]) => setPlanForm({ ...planForm, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={planForm.status}
                    onValueChange={(v: DietPlan["status"]) => setPlanForm({ ...planForm, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={savingPlan}>
                {savingPlan && <Loader2 className="animate-spin" />}
                {editingPlan ? "Save changes" : "Create plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!mealsTarget} onOpenChange={(open) => !open && setMealsTarget(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Meals — {mealsTarget?.name}</DialogTitle>
            <DialogDescription>Add or remove meals for this plan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            {meals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No meals added yet.</p>
            ) : (
              meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div>
                    <span className="font-medium capitalize">{meal.meal_type}</span> — {meal.name}
                    <div className="text-xs text-muted-foreground">
                      {meal.calories ?? 0} kcal · P{meal.protein ?? 0} · C{meal.carbs ?? 0} · F
                      {meal.fats ?? 0}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveMeal(meal)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleAddMeal} className="grid gap-3 border-t pt-4">
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={mealForm.meal_type}
                onValueChange={(v: DietMeal["meal_type"]) => setMealForm({ ...mealForm, meal_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Meal name"
                required
                value={mealForm.name}
                onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Input
                type="number"
                placeholder="kcal"
                value={mealForm.calories}
                onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Protein"
                value={mealForm.protein}
                onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Carbs"
                value={mealForm.carbs}
                onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Fats"
                value={mealForm.fats}
                onChange={(e) => setMealForm({ ...mealForm, fats: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={addingMeal}>
              {addingMeal && <Loader2 className="animate-spin" />}
              Add Meal
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <form onSubmit={handleAssign}>
            <DialogHeader>
              <DialogTitle>Assign Diet Plan</DialogTitle>
              <DialogDescription>Assign a diet plan to a member.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Member</Label>
                <Select value={assignMemberId} onValueChange={setAssignMemberId}>
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
                <Label>Diet Plan</Label>
                <Select value={assignPlanId} onValueChange={setAssignPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={String(plan.id)}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  required
                  value={assignStartDate}
                  onChange={(e) => setAssignStartDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={assigning || !assignMemberId || !assignPlanId}>
                {assigning && <Loader2 className="animate-spin" />}
                Assign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete diet plan?"
        description={`This will permanently delete "${deleteTarget?.name}". This cannot be undone.`}
        onConfirm={handleDeletePlan}
        loading={deleting}
      />
    </div>
  );
}
