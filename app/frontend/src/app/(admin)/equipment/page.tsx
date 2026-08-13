"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Wrench } from "lucide-react";

import type { Branch, Equipment, EquipmentMaintenance, Paginated } from "@/lib/types";
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

const STATUS_VARIANT: Record<Equipment["status"], "default" | "secondary" | "destructive"> = {
  operational: "default",
  maintenance: "secondary",
  out_of_service: "destructive",
};

type FormState = {
  name: string;
  type: string;
  branch_id: string;
  status: Equipment["status"];
  purchase_date: string;
  cost: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  type: "",
  branch_id: "",
  status: "operational",
  purchase_date: "",
  cost: "",
};

export default function EquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [maintenanceTarget, setMaintenanceTarget] = useState<Equipment | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<EquipmentMaintenance[]>([]);
  const [maintenanceForm, setMaintenanceForm] = useState({ date: "", cost: "", technician: "", notes: "" });
  const [addingMaintenance, setAddingMaintenance] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [eqRes, branchRes] = await Promise.all([
        fetch("/api/admin/equipment?per_page=50"),
        fetch("/api/admin/branches?per_page=100"),
      ]);
      const eqData: Paginated<Equipment> = await eqRes.json();
      const branchData: Paginated<Branch> = await branchRes.json();
      setItems(eqData.data ?? []);
      setBranches(branchData.data ?? []);
    } catch {
      crudToast.error("Failed to load equipment.");
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

  function openEdit(item: Equipment) {
    setEditing(item);
    setForm({
      name: item.name,
      type: item.type ?? "",
      branch_id: item.branch_id ? String(item.branch_id) : "",
      status: item.status,
      purchase_date: item.purchase_date ?? "",
      cost: item.cost ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        type: form.type || null,
        branch_id: form.branch_id ? Number(form.branch_id) : null,
        status: form.status,
        purchase_date: form.purchase_date || null,
        cost: form.cost ? Number(form.cost) : null,
      };
      const url = editing ? `/api/admin/equipment/${editing.id}` : "/api/admin/equipment";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save equipment.");
        return;
      }
      crudToast[editing ? "updated" : "created"]("Equipment");
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
      const res = await fetch(`/api/admin/equipment/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete equipment.");
        return;
      }
      crudToast.deleted("Equipment");
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  }

  async function openMaintenance(item: Equipment) {
    setMaintenanceTarget(item);
    setMaintenanceForm({ date: new Date().toISOString().slice(0, 10), cost: "", technician: "", notes: "" });
    const res = await fetch(`/api/admin/equipment/${item.id}/maintenance`);
    const data: EquipmentMaintenance[] = await res.json();
    setMaintenanceRecords(data ?? []);
  }

  async function handleAddMaintenance(e: React.FormEvent) {
    e.preventDefault();
    if (!maintenanceTarget) return;
    setAddingMaintenance(true);
    try {
      const payload = {
        date: maintenanceForm.date,
        cost: maintenanceForm.cost ? Number(maintenanceForm.cost) : null,
        technician: maintenanceForm.technician || null,
        notes: maintenanceForm.notes || null,
      };
      const res = await fetch(`/api/admin/equipment/${maintenanceTarget.id}/maintenance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to log maintenance.");
        return;
      }
      crudToast.action("Maintenance logged. Equipment marked under maintenance.");
      setMaintenanceTarget(null);
      load();
    } finally {
      setAddingMaintenance(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Equipment</h1>
          <p className="text-sm text-muted-foreground">Gym equipment inventory and maintenance</p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New Equipment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No equipment yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.type ?? "—"}</TableCell>
                    <TableCell>{item.branch?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[item.status]}>{item.status.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openMaintenance(item)}>
                        <Wrench className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(item)}>
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
              <DialogTitle>{editing ? "Edit Equipment" : "New Equipment"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update this equipment." : "Add new equipment to the inventory."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="eq_name">Name</Label>
                <Input
                  id="eq_name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="eq_type">Type</Label>
                  <Input
                    id="eq_type"
                    placeholder="e.g. Cardio, Strength"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={form.purchase_date}
                    onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v: Equipment["status"]) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="out_of_service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create equipment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!maintenanceTarget} onOpenChange={(open) => !open && setMaintenanceTarget(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Maintenance — {maintenanceTarget?.name}</DialogTitle>
            <DialogDescription>Maintenance history and new record.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            {maintenanceRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground">No maintenance records yet.</p>
            ) : (
              maintenanceRecords.map((record) => (
                <div key={record.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{record.date}</span>
                    <span>{record.cost ?? "—"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {record.technician ?? "Unknown technician"} {record.notes ? `— ${record.notes}` : ""}
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleAddMaintenance} className="grid gap-3 border-t pt-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                required
                value={maintenanceForm.date}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Cost"
                value={maintenanceForm.cost}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })}
              />
            </div>
            <Input
              placeholder="Technician"
              value={maintenanceForm.technician}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, technician: e.target.value })}
            />
            <Input
              placeholder="Notes"
              value={maintenanceForm.notes}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
            />
            <Button type="submit" disabled={addingMaintenance}>
              {addingMaintenance && <Loader2 className="animate-spin" />}
              Log Maintenance
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete equipment?"
        description={`This will permanently delete "${deleteTarget?.name}". This cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
