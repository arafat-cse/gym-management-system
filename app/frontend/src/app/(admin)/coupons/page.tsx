"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import type { Coupon, Discount, Paginated } from "@/lib/types";
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

type FormState = {
  code: string;
  type: "percentage" | "fixed";
  discount: string;
  min_order: string;
  max_uses: string;
  expires_at: string;
  status: "active" | "inactive";
};

const EMPTY_FORM: FormState = {
  code: "",
  type: "percentage",
  discount: "",
  min_order: "",
  max_uses: "",
  expires_at: "",
  status: "active",
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [couponsRes, discountsRes] = await Promise.all([
        fetch("/api/admin/coupons?per_page=50"),
        fetch("/api/admin/discounts?per_page=50"),
      ]);
      const couponsData: Paginated<Coupon> = await couponsRes.json();
      const discountsData: Paginated<Discount> = await discountsRes.json();
      setCoupons(couponsData.data ?? []);
      setDiscounts(discountsData.data ?? []);
    } catch {
      crudToast.error("Failed to load coupons.");
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

  function openEdit(coupon: Coupon) {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount,
      min_order: coupon.min_order ?? "",
      max_uses: coupon.max_uses ? String(coupon.max_uses) : "",
      expires_at: coupon.expires_at ?? "",
      status: coupon.status,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code,
        type: form.type,
        discount: Number(form.discount),
        min_order: form.min_order ? Number(form.min_order) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
        status: form.status,
      };

      const url = editing ? `/api/admin/coupons/${editing.id}` : "/api/admin/coupons";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save coupon.");
        return;
      }
      if (editing) {
        crudToast.updated("Coupon");
      } else {
        crudToast.created("Coupon");
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
      const res = await fetch(`/api/admin/coupons/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete coupon.");
        return;
      }
      crudToast.deleted("Coupon");
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
          <h1 className="text-2xl font-semibold">Coupons</h1>
          <p className="text-sm text-muted-foreground">Discount codes for registration payments</p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New Coupon
        </Button>
      </div>

      <Tabs defaultValue="coupons">
        <TabsList>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="usage">Usage Log</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Coupons</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min Order</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : coupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No coupons yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-medium">{coupon.code}</TableCell>
                        <TableCell>
                          {coupon.type === "percentage" ? `${coupon.discount}%` : coupon.discount}
                        </TableCell>
                        <TableCell>{coupon.min_order ?? "—"}</TableCell>
                        <TableCell>
                          {coupon.used_count}
                          {coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                        </TableCell>
                        <TableCell>{coupon.expires_at ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={coupon.status === "active" ? "default" : "secondary"}>
                            {coupon.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(coupon)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(coupon)}>
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

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Redemptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Discount Amount</TableHead>
                    <TableHead>Used At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No redemptions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    discounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">{discount.coupon.code}</TableCell>
                        <TableCell>
                          {discount.member_registration.first_name} {discount.member_registration.last_name}
                        </TableCell>
                        <TableCell>{discount.amount}</TableCell>
                        <TableCell>{new Date(discount.used_at).toLocaleString()}</TableCell>
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
              <DialogTitle>{editing ? "Edit Coupon" : "New Coupon"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update this coupon." : "Create a new discount coupon."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v: "percentage" | "fixed") => setForm({ ...form, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount">
                    Discount {form.type === "percentage" ? "(%)" : "(amount)"}
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    required
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="min_order">Min order (optional)</Label>
                  <Input
                    id="min_order"
                    type="number"
                    min="0"
                    value={form.min_order}
                    onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max_uses">Max uses (optional)</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expires_at">Expires (optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v: "active" | "inactive") => setForm({ ...form, status: v })}
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
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete coupon?"
        description={`This will permanently delete "${deleteTarget?.code}" and its usage history. This cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
