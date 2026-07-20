"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";

import type { HealthInfo, Member, Paginated } from "@/lib/types";
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

type FormState = {
  member_id: string;
  height: string;
  weight: string;
  blood_type: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergency_contact: string;
};

const EMPTY_FORM: FormState = {
  member_id: "",
  height: "",
  weight: "",
  blood_type: "",
  allergies: "",
  conditions: "",
  medications: "",
  emergency_contact: "",
};

export default function HealthInfoPage() {
  const [records, setRecords] = useState<HealthInfo[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HealthInfo | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [recRes, memRes] = await Promise.all([
        fetch("/api/admin/health-info?per_page=50"),
        fetch("/api/admin/members?per_page=100"),
      ]);
      const recData: Paginated<HealthInfo> = await recRes.json();
      const memData: Paginated<Member> = await memRes.json();
      setRecords(recData.data ?? []);
      setMembers(memData.data ?? []);
    } catch {
      crudToast.error("Failed to load health records.");
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

  function openEdit(record: HealthInfo) {
    setEditing(record);
    setForm({
      member_id: String(record.member_id),
      height: record.height ?? "",
      weight: record.weight ?? "",
      blood_type: record.blood_type ?? "",
      allergies: record.allergies ?? "",
      conditions: record.conditions ?? "",
      medications: record.medications ?? "",
      emergency_contact: record.emergency_contact ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        blood_type: form.blood_type || null,
        allergies: form.allergies || null,
        conditions: form.conditions || null,
        medications: form.medications || null,
        emergency_contact: form.emergency_contact || null,
      };
      if (!editing) payload.member_id = Number(form.member_id);

      const url = editing ? `/api/admin/health-info/${editing.id}` : "/api/admin/health-info";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save health record.");
        return;
      }
      crudToast[editing ? "updated" : "created"]("Health record");
      setDialogOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Health Info</h1>
          <p className="text-sm text-muted-foreground">Member health records (height, weight, BMI, conditions)</p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> New Record
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Height</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>BMI</TableHead>
                <TableHead>Blood Type</TableHead>
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
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No health records yet.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.member.user.name}</TableCell>
                    <TableCell>{record.height ? `${record.height} cm` : "—"}</TableCell>
                    <TableCell>{record.weight ? `${record.weight} kg` : "—"}</TableCell>
                    <TableCell>
                      {record.bmi ? <Badge variant="secondary">{record.bmi}</Badge> : "—"}
                    </TableCell>
                    <TableCell>{record.blood_type ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(record)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Health Record" : "New Health Record"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update this member&apos;s health record." : "Create a health record for a member."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!editing && (
                <div className="grid gap-2">
                  <Label>Member</Label>
                  <Select value={form.member_id} onValueChange={(v) => setForm({ ...form, member_id: v })}>
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
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="blood_type">Blood Type</Label>
                <Input
                  id="blood_type"
                  placeholder="e.g. O+"
                  value={form.blood_type}
                  onChange={(e) => setForm({ ...form, blood_type: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={form.allergies}
                  onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="conditions">Medical Conditions</Label>
                <Textarea
                  id="conditions"
                  value={form.conditions}
                  onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="medications">Medications</Label>
                <Textarea
                  id="medications"
                  value={form.medications}
                  onChange={(e) => setForm({ ...form, medications: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={form.emergency_contact}
                  onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving || (!editing && !form.member_id)}>
                {saving && <Loader2 className="animate-spin" />}
                {editing ? "Save changes" : "Create record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
