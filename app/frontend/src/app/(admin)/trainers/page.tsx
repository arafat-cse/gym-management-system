"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";

import type { Branch, Paginated, Trainer } from "@/lib/types";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  branch_id: string;
  employee_id: string;
  specialization: string;
  experience_years: string;
  hourly_rate: string;
  session_rate: string;
  bio: string;
  status: "active" | "on_leave" | "inactive";
};

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  branch_id: "",
  employee_id: "",
  specialization: "",
  experience_years: "",
  hourly_rate: "",
  session_rate: "",
  bio: "",
  status: "active",
};

const STATUS_VARIANT: Record<Trainer["status"], "default" | "secondary" | "outline"> = {
  active: "default",
  inactive: "secondary",
  on_leave: "outline",
};

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Trainer | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [trainersRes, branchesRes] = await Promise.all([
        fetch("/api/admin/trainers?per_page=50"),
        fetch("/api/admin/branches?per_page=100"),
      ]);
      const trainersData: Paginated<Trainer> = await trainersRes.json();
      const branchesData: Paginated<Branch> = await branchesRes.json();
      setTrainers(trainersData.data ?? []);
      setBranches(branchesData.data ?? []);
    } catch {
      crudToast.error("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(trainer: Trainer) {
    setEditing(trainer);
    setForm({
      first_name: trainer.user.first_name,
      last_name: trainer.user.last_name,
      email: trainer.user.email,
      password: "",
      branch_id: trainer.branch_id ? String(trainer.branch_id) : "",
      employee_id: trainer.employee_id ?? "",
      specialization: trainer.specialization ?? "",
      experience_years: String(trainer.experience_years ?? 0),
      hourly_rate: trainer.hourly_rate ?? "",
      session_rate: trainer.session_rate ?? "",
      bio: trainer.bio ?? "",
      status: trainer.status,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        branch_id: form.branch_id ? Number(form.branch_id) : null,
        employee_id: form.employee_id || null,
        specialization: form.specialization || null,
        experience_years: form.experience_years ? Number(form.experience_years) : 0,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
        session_rate: form.session_rate ? Number(form.session_rate) : null,
        bio: form.bio || null,
        status: form.status,
      };
      if (form.password) payload.password = form.password;

      const url = editing ? `/api/admin/trainers/${editing.id}` : "/api/admin/trainers";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save trainer.");
        return;
      }
      if (editing) {
        crudToast.updated("Trainer");
      } else {
        crudToast.created("Trainer");
      }
      setDialogOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/trainers/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete trainer.");
        return;
      }
      crudToast.deleted("Trainer");
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Trainers</h1>
          <p className="text-sm text-muted-foreground">Manage trainer profiles</p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New Trainer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Trainers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Rating</TableHead>
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
              ) : trainers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No trainers yet.
                  </TableCell>
                </TableRow>
              ) : (
                trainers.map((trainer) => (
                  <TableRow key={trainer.id}>
                    <TableCell className="font-medium">
                      <Link href={`/trainers/${trainer.id}`} className="hover:underline">
                        {trainer.user.name}
                      </Link>
                    </TableCell>
                    <TableCell>{trainer.specialization ?? "—"}</TableCell>
                    <TableCell>
                      {trainer.branch ? (
                        <Badge variant="secondary">{trainer.branch.name}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Star className="size-3.5 fill-current text-yellow-500" />
                        {trainer.rating_avg ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[trainer.status]}>{trainer.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(trainer)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(trainer)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Trainer" : "New Trainer"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update trainer profile." : "Add a new trainer."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Password {editing && <span className="text-muted-foreground">(leave blank to keep unchanged)</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  required={!editing}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={form.employee_id}
                    onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="experience">Experience (yrs)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hourly_rate">Hourly rate</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    step="0.01"
                    value={form.hourly_rate}
                    onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="session_rate">Session rate</Label>
                  <Input
                    id="session_rate"
                    type="number"
                    step="0.01"
                    value={form.session_rate}
                    onChange={(e) => setForm({ ...form, session_rate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Branch</Label>
                  <Select
                    value={form.branch_id || "none"}
                    onValueChange={(v) => setForm({ ...form, branch_id: v === "none" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v: "active" | "on_leave" | "inactive") =>
                      setForm({ ...form, status: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create trainer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete trainer?"
        description={`This will permanently delete "${deleteTarget?.user.name}" and their account. This cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
