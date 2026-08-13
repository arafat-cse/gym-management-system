"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import type { TrainerSpecialization } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

const EMPTY_FORM = {
  specialization_name: "",
  certification_level: "" as "" | TrainerSpecialization["certification_level"],
  certification_date: "",
  expiry_date: "",
  issuing_authority: "",
};

export default function PortalSpecializationsPage() {
  const [specializations, setSpecializations] = useState<TrainerSpecialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TrainerSpecialization | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/my-specializations");
      const data: TrainerSpecialization[] = await res.json();
      setSpecializations(data ?? []);
    } catch {
      crudToast.error("Failed to load specializations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/portal/my-specializations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialization_name: form.specialization_name,
          certification_level: form.certification_level || null,
          certification_date: form.certification_date || null,
          expiry_date: form.expiry_date || null,
          issuing_authority: form.issuing_authority || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to add specialization.");
        return;
      }
      crudToast.created("Specialization");
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/portal/my-specializations/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to remove specialization.");
        return;
      }
      crudToast.deleted("Specialization");
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
          <h1 className="text-2xl font-semibold">Specializations</h1>
          <p className="text-sm text-muted-foreground">Your certifications and expertise areas</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus /> Add
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Specializations</CardTitle>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : specializations.length === 0 ? (
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
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(spec)}>
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
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Specialization</DialogTitle>
              <DialogDescription>Add a certification or specialty to your profile.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="spec_name">Specialization name</Label>
                <Input
                  id="spec_name"
                  required
                  value={form.specialization_name}
                  onChange={(e) => setForm({ ...form, specialization_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Certification level</Label>
                <Select
                  value={form.certification_level || "none"}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
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
                    value={form.certification_date}
                    onChange={(e) => setForm({ ...form, certification_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiry_date">Expiry date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={form.expiry_date}
                    onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issuing_authority">Issuing authority</Label>
                <Input
                  id="issuing_authority"
                  value={form.issuing_authority}
                  onChange={(e) => setForm({ ...form, issuing_authority: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                Add specialization
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove specialization?"
        description={`This will remove "${deleteTarget?.specialization_name}" from your profile.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
