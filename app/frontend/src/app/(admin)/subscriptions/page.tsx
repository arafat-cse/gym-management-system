"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import type { Member, MembershipPlan, Paginated, Subscription } from "@/lib/types";
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

type CreateForm = {
  member_id: string;
  membership_plan_id: string;
  start_date: string;
  price_paid: string;
  notes: string;
};

type EditForm = {
  status: Subscription["status"];
  start_date: string;
  end_date: string;
  price_paid: string;
  notes: string;
};

const EMPTY_CREATE: CreateForm = {
  member_id: "",
  membership_plan_id: "",
  start_date: "",
  price_paid: "",
  notes: "",
};

const STATUS_VARIANT: Record<Subscription["status"], "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  pending: "outline",
  expired: "secondary",
  cancelled: "destructive",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(EMPTY_CREATE);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<Subscription | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [subsRes, membersRes, plansRes] = await Promise.all([
        fetch("/api/admin/subscriptions?per_page=50"),
        fetch("/api/admin/members?per_page=100"),
        fetch("/api/admin/plans?per_page=100"),
      ]);
      const subsData: Paginated<Subscription> = await subsRes.json();
      const membersData: Paginated<Member> = await membersRes.json();
      const plansData: Paginated<MembershipPlan> = await plansRes.json();
      setSubscriptions(subsData.data ?? []);
      setMembers(membersData.data ?? []);
      setPlans(plansData.data ?? []);
    } catch {
      crudToast.error("Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setCreateForm(EMPTY_CREATE);
    setCreateOpen(true);
  }

  function openEdit(sub: Subscription) {
    setEditing(sub);
    setEditForm({
      status: sub.status,
      start_date: sub.start_date.slice(0, 10),
      end_date: sub.end_date.slice(0, 10),
      price_paid: sub.price_paid,
      notes: sub.notes ?? "",
    });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        member_id: Number(createForm.member_id),
        membership_plan_id: Number(createForm.membership_plan_id),
        start_date: createForm.start_date || null,
        notes: createForm.notes || null,
      };
      if (createForm.price_paid) payload.price_paid = Number(createForm.price_paid);

      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to create subscription.");
        return;
      }
      crudToast.created("Subscription");
      setCreateOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editForm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/subscriptions/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editForm.status,
          start_date: editForm.start_date,
          end_date: editForm.end_date,
          price_paid: Number(editForm.price_paid),
          notes: editForm.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to update subscription.");
        return;
      }
      crudToast.updated("Subscription");
      setEditing(null);
      setEditForm(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/subscriptions/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete subscription.");
        return;
      }
      crudToast.deleted("Subscription");
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
          <h1 className="text-2xl font-semibold">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">Manage member subscriptions</p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New Subscription
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead>Period</TableHead>
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
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No subscriptions yet.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.member?.user?.name}</TableCell>
                    <TableCell>{sub.membership_plan?.name}</TableCell>
                    <TableCell>৳{sub.price_paid}</TableCell>
                    <TableCell>
                      {sub.start_date?.slice(0, 10)} → {sub.end_date?.slice(0, 10)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[sub.status]}>{sub.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(sub)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(sub)}>
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>New Subscription</DialogTitle>
              <DialogDescription>Enroll a member into a plan.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Member</Label>
                <Select
                  value={createForm.member_id}
                  onValueChange={(v) => setCreateForm({ ...createForm, member_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Plan</Label>
                <Select
                  value={createForm.membership_plan_id}
                  onValueChange={(v) => setCreateForm({ ...createForm, membership_plan_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name} — ৳{p.price} / {p.duration_in_days}d
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={createForm.start_date}
                    onChange={(e) => setCreateForm({ ...createForm, start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price_paid">Price paid</Label>
                  <Input
                    id="price_paid"
                    type="number"
                    step="0.01"
                    placeholder="Defaults to plan price"
                    value={createForm.price_paid}
                    onChange={(e) => setCreateForm({ ...createForm, price_paid: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={saving || !createForm.member_id || !createForm.membership_plan_id}
              >
                {saving && <Loader2 className="animate-spin" />}
                Create subscription
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setEditForm(null);
          }
        }}
      >
        <DialogContent>
          {editForm && (
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit Subscription</DialogTitle>
                <DialogDescription>
                  {editing?.member?.user?.name} — {editing?.membership_plan?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(v: Subscription["status"]) =>
                      setEditForm({ ...editForm, status: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit_start">Start date</Label>
                    <Input
                      id="edit_start"
                      type="date"
                      value={editForm.start_date}
                      onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit_end">End date</Label>
                    <Input
                      id="edit_end"
                      type="date"
                      value={editForm.end_date}
                      onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_price">Price paid</Label>
                  <Input
                    id="edit_price"
                    type="number"
                    step="0.01"
                    value={editForm.price_paid}
                    onChange={(e) => setEditForm({ ...editForm, price_paid: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_notes">Notes</Label>
                  <Textarea
                    id="edit_notes"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="animate-spin" />}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete subscription?"
        description="This will permanently delete this subscription record. This cannot be undone."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
