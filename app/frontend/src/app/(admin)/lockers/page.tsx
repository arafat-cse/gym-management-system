"use client";

import { useEffect, useState } from "react";
import { Loader2, LogOut, Pencil, Plus, Trash2 } from "lucide-react";

import type { Branch, Locker, Member, MemberLocker, Paginated } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const STATUS_VARIANT: Record<Locker["status"], "default" | "secondary" | "destructive"> = {
  available: "default",
  occupied: "secondary",
  maintenance: "destructive",
};

type LockerForm = {
  branch_id: string;
  number: string;
  size: Locker["size"];
  status: Locker["status"];
};

const EMPTY_LOCKER_FORM: LockerForm = { branch_id: "", number: "", size: "medium", status: "available" };

export default function LockersPage() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [assignments, setAssignments] = useState<MemberLocker[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Locker | null>(null);
  const [form, setForm] = useState<LockerForm>(EMPTY_LOCKER_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Locker | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignMemberId, setAssignMemberId] = useState("");
  const [assignLockerId, setAssignLockerId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [releasingId, setReleasingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [lockerRes, assignRes, branchRes, memberRes] = await Promise.all([
        fetch("/api/admin/lockers?per_page=50"),
        fetch("/api/admin/member-lockers?per_page=50"),
        fetch("/api/admin/branches?per_page=100"),
        fetch("/api/admin/members?per_page=100"),
      ]);
      const lockerData: Paginated<Locker> = await lockerRes.json();
      const assignData: Paginated<MemberLocker> = await assignRes.json();
      const branchData: Paginated<Branch> = await branchRes.json();
      const memberData: Paginated<Member> = await memberRes.json();
      setLockers(lockerData.data ?? []);
      setAssignments(assignData.data ?? []);
      setBranches(branchData.data ?? []);
      setMembers(memberData.data ?? []);
    } catch {
      crudToast.error("Failed to load lockers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_LOCKER_FORM);
    setDialogOpen(true);
  }

  function openEdit(locker: Locker) {
    setEditing(locker);
    setForm({
      branch_id: locker.branch_id ? String(locker.branch_id) : "",
      number: locker.number,
      size: locker.size,
      status: locker.status,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        branch_id: form.branch_id ? Number(form.branch_id) : null,
        number: form.number,
        size: form.size,
        status: form.status,
      };
      const url = editing ? `/api/admin/lockers/${editing.id}` : "/api/admin/lockers";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save locker.");
        return;
      }
      crudToast[editing ? "updated" : "created"]("Locker");
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
      const res = await fetch(`/api/admin/lockers/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete locker.");
        return;
      }
      crudToast.deleted("Locker");
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  }

  function openAssign() {
    setAssignMemberId("");
    setAssignLockerId("");
    setAssignOpen(true);
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    setAssigning(true);
    try {
      const res = await fetch("/api/admin/member-lockers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: Number(assignMemberId),
          locker_id: Number(assignLockerId),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to assign locker.");
        return;
      }
      crudToast.action("Locker assigned.");
      setAssignOpen(false);
      load();
    } finally {
      setAssigning(false);
    }
  }

  async function handleRelease(assignment: MemberLocker) {
    setReleasingId(assignment.id);
    try {
      const res = await fetch(`/api/admin/member-lockers/${assignment.id}/release`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to release locker.");
        return;
      }
      crudToast.action("Locker released.");
      load();
    } finally {
      setReleasingId(null);
    }
  }

  const availableLockers = lockers.filter((l) => l.status === "available");

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Lockers</h1>
        <p className="text-sm text-muted-foreground">Locker inventory and member assignments</p>
      </div>

      <Tabs defaultValue="lockers">
        <TabsList>
          <TabsTrigger value="lockers">Lockers</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="lockers">
          <div className="mb-4 flex justify-end">
            <Button onClick={openCreate}>
              <Plus /> New Locker
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Lockers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Size</TableHead>
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
                  ) : lockers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No lockers yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    lockers.map((locker) => (
                      <TableRow key={locker.id}>
                        <TableCell className="font-medium">{locker.number}</TableCell>
                        <TableCell>{locker.branch?.name ?? "—"}</TableCell>
                        <TableCell className="capitalize">{locker.size}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[locker.status]}>{locker.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(locker)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(locker)}>
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
              <Plus /> Assign Locker
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Locker</TableHead>
                    <TableHead>Assigned At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No active assignments.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.member.user.name}</TableCell>
                        <TableCell>{assignment.locker.number}</TableCell>
                        <TableCell>{new Date(assignment.assigned_at).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={releasingId === assignment.id}
                            onClick={() => handleRelease(assignment)}
                          >
                            {releasingId === assignment.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <LogOut className="size-4 text-destructive" />
                            )}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Locker" : "New Locker"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update this locker." : "Add a new locker."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="number">Number</Label>
                <Input
                  id="number"
                  required
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Size</Label>
                  <Select
                    value={form.size}
                    onValueChange={(v: Locker["size"]) => setForm({ ...form, size: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v: Locker["status"]) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create locker"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <form onSubmit={handleAssign}>
            <DialogHeader>
              <DialogTitle>Assign Locker</DialogTitle>
              <DialogDescription>Assign an available locker to a member.</DialogDescription>
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
                <Label>Locker</Label>
                <Select value={assignLockerId} onValueChange={setAssignLockerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select available locker" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLockers.map((locker) => (
                      <SelectItem key={locker.id} value={String(locker.id)}>
                        {locker.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={assigning || !assignMemberId || !assignLockerId}>
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
        title="Delete locker?"
        description={`This will permanently delete locker "${deleteTarget?.number}". This cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
