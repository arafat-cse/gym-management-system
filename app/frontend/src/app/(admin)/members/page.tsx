"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import type { Branch, Member, Paginated } from "@/lib/types";
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
  phone: string;
  address: string;
  branch_id: string;
  gender: "male" | "female" | "other" | "";
  date_of_birth: string;
  blood_group: string;
  religion: string;
  nid_number: string;
  birth_certificate_number: string;
  emergency_contact_number: string;
  joining_date: string;
};

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  branch_id: "",
  gender: "",
  date_of_birth: "",
  blood_group: "",
  religion: "",
  nid_number: "",
  birth_certificate_number: "",
  emergency_contact_number: "",
  joining_date: "",
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState<Member | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [membersRes, branchesRes] = await Promise.all([
        fetch("/api/admin/members?per_page=50"),
        fetch("/api/admin/branches?per_page=100"),
      ]);
      const membersData: Paginated<Member> = await membersRes.json();
      const branchesData: Paginated<Branch> = await branchesRes.json();
      setMembers(membersData.data ?? []);
      setBranches(branchesData.data ?? []);
    } catch {
      crudToast.error("Failed to load members.");
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

  function openEdit(member: Member) {
    setEditing(member);
    setForm({
      first_name: member.user.first_name,
      last_name: member.user.last_name,
      email: member.user.email,
      password: "",
      phone: member.phone ?? "",
      address: member.address ?? "",
      branch_id: member.branch_id ? String(member.branch_id) : "",
      gender: member.user.gender ?? "",
      date_of_birth: member.user.date_of_birth ?? "",
      blood_group: member.user.blood_group ?? "",
      religion: member.user.religion ?? "",
      nid_number: member.user.nid_number ?? "",
      birth_certificate_number: member.user.birth_certificate_number ?? "",
      emergency_contact_number: member.user.emergency_contact_number ?? "",
      joining_date: member.user.joining_date ?? "",
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
        phone: form.phone || null,
        address: form.address || null,
        branch_id: form.branch_id ? Number(form.branch_id) : null,
        gender: form.gender || null,
        date_of_birth: form.date_of_birth || null,
        blood_group: form.blood_group || null,
        religion: form.religion || null,
        nid_number: form.nid_number || null,
        birth_certificate_number: form.birth_certificate_number || null,
        emergency_contact_number: form.emergency_contact_number || null,
        joining_date: form.joining_date || null,
      };
      if (form.password) payload.password = form.password;

      const url = editing ? `/api/admin/members/${editing.id}` : "/api/admin/members";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save member.");
        return;
      }
      if (editing) {
        crudToast.updated("Member");
      } else {
        crudToast.created("Member");
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
      const res = await fetch(`/api/admin/members/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete member.");
        return;
      }
      crudToast.deleted("Member");
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
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-sm text-muted-foreground">Manage gym members</p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Branch</TableHead>
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
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No members yet.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.user.name}</TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>{member.phone ?? "—"}</TableCell>
                    <TableCell>
                      {member.branch ? (
                        <Badge variant="secondary">{member.branch.name}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setViewTarget(member)}>
                        <Eye className="size-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(member)}>
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
              <DialogTitle>{editing ? "Edit Member" : "New Member"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update member details." : "Register a new gym member."}
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
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
                  <Label>Gender</Label>
                  <Select
                    value={form.gender || "none"}
                    onValueChange={(v: "male" | "female" | "other" | "none") =>
                      setForm({ ...form, gender: v === "none" ? "" : v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unspecified</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={form.blood_group || "none"}
                    onValueChange={(v) => setForm({ ...form, blood_group: v === "none" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unspecified</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Religion</Label>
                  <Select
                    value={form.religion || "none"}
                    onValueChange={(v) => setForm({ ...form, religion: v === "none" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unspecified</SelectItem>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Hinduism">Hinduism</SelectItem>
                      <SelectItem value="Christianity">Christianity</SelectItem>
                      <SelectItem value="Buddhism">Buddhism</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nid_number">NID Number</Label>
                  <Input
                    id="nid_number"
                    placeholder="13-digit NID number"
                    value={form.nid_number}
                    onChange={(e) => setForm({ ...form, nid_number: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birth_certificate_number">Birth Certificate Number</Label>
                  <Input
                    id="birth_certificate_number"
                    placeholder="Birth certificate number"
                    value={form.birth_certificate_number}
                    onChange={(e) => setForm({ ...form, birth_certificate_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="emergency_contact_number">Emergency Contact</Label>
                  <Input
                    id="emergency_contact_number"
                    placeholder="Emergency contact number"
                    value={form.emergency_contact_number}
                    onChange={(e) => setForm({ ...form, emergency_contact_number: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="joining_date">Joining Date</Label>
                  <Input
                    id="joining_date"
                    type="date"
                    value={form.joining_date}
                    onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete member?"
        description={`This will permanently delete "${deleteTarget?.user.name}" and their account. This cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>
              Full profile information for {viewTarget?.user.name}.
            </DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">First Name</span>
                  <span className="text-foreground font-medium text-base">{viewTarget.user.first_name}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Last Name</span>
                  <span className="text-foreground font-medium text-base">{viewTarget.user.last_name}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Email Address</span>
                  <span className="text-foreground">{viewTarget.user.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Phone</span>
                  <span className="text-foreground">{viewTarget.phone || viewTarget.user.phone || "—"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Gender</span>
                  <span className="text-foreground capitalize">{viewTarget.user.gender || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Date of Birth</span>
                  <span className="text-foreground">{viewTarget.user.date_of_birth || "—"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Branch</span>
                  <span className="text-foreground">{viewTarget.branch?.name || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Joining Date</span>
                  <span className="text-foreground">{viewTarget.user.joining_date || "—"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Blood Group</span>
                  <span className="text-foreground uppercase">{viewTarget.user.blood_group || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Religion</span>
                  <span className="text-foreground capitalize">{viewTarget.user.religion || "—"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">NID Number</span>
                  <span className="text-foreground">{viewTarget.user.nid_number || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Birth Certificate</span>
                  <span className="text-foreground">{viewTarget.user.birth_certificate_number || "—"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div className="col-span-2">
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Home Address</span>
                  <span className="text-foreground">{viewTarget.address || "—"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Emergency Contact</span>
                  <span className="text-foreground">{viewTarget.user.emergency_contact_number || "—"}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setViewTarget(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
