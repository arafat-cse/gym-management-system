"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import type { LeadInquiry, Paginated } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const STATUS_VARIANT: Record<LeadInquiry["status"], "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  contacted: "secondary",
  converted: "outline",
  closed: "destructive",
};

type FilterStatus = LeadInquiry["status"] | "all";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<LeadInquiry[]>([]);
  const [status, setStatus] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LeadInquiry | null>(null);
  const [editStatus, setEditStatus] = useState<LeadInquiry["status"]>("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const qs = status === "all" ? "" : `&status=${status}`;
      const res = await fetch(`/api/admin/inquiries?per_page=50${qs}`);
      const data: Paginated<LeadInquiry> = await res.json();
      setInquiries(data.data ?? []);
    } catch {
      crudToast.error("Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function openEdit(inquiry: LeadInquiry) {
    setEditing(inquiry);
    setEditStatus(inquiry.status);
    setNotes(inquiry.notes ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, notes: notes || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to update inquiry.");
        return;
      }
      crudToast.updated("Inquiry");
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Inquiries</h1>
        <p className="text-sm text-muted-foreground">Leads submitted via the public contact form</p>
      </div>

      <Tabs value={status} onValueChange={(v) => setStatus(v as FilterStatus)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Interested Plan</TableHead>
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
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No inquiries.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.phone}</TableCell>
                    <TableCell>{inquiry.membership_plan?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[inquiry.status]}>{inquiry.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(inquiry)}>
                        <Pencil className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Update Inquiry</DialogTitle>
              <DialogDescription>{editing?.name} — {editing?.email}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={editStatus} onValueChange={(v: LeadInquiry["status"]) => setEditStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              {editing?.message && (
                <div className="grid gap-1 rounded-lg border p-3 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Original message
                  </span>
                  <span>{editing.message}</span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
