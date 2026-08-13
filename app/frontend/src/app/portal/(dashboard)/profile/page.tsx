"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import type { AuthUser } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormState = {
  first_name: string;
  last_name: string;
  phone: string;
  gender: "male" | "female" | "other" | "";
  blood_group: string;
  religion: string;
  nid_number: string;
  birth_certificate_number: string;
  emergency_contact_number: string;
  date_of_birth: string;
  address: string;
  password: string;
};

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  phone: "",
  gender: "",
  blood_group: "",
  religion: "",
  nid_number: "",
  birth_certificate_number: "",
  emergency_contact_number: "",
  date_of_birth: "",
  address: "",
  password: "",
};

export default function PortalProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/profile");
      const data: AuthUser = await res.json();
      setUser(data);
      setForm({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone ?? "",
        gender: data.gender ?? "",
        blood_group: data.blood_group ?? "",
        religion: data.religion ?? "",
        nid_number: data.nid_number ?? "",
        birth_certificate_number: data.birth_certificate_number ?? "",
        emergency_contact_number: data.emergency_contact_number ?? "",
        date_of_birth: data.date_of_birth ?? "",
        address: data.member?.address ?? "",
        password: "",
      });
    } catch {
      crudToast.error("Failed to load profile.");
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
      const payload: Record<string, unknown> = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || null,
        gender: form.gender || null,
        blood_group: form.blood_group || null,
        religion: form.religion || null,
        nid_number: form.nid_number || null,
        birth_certificate_number: form.birth_certificate_number || null,
        emergency_contact_number: form.emergency_contact_number || null,
        date_of_birth: form.date_of_birth || null,
      };
      if (user?.role === "member") payload.address = form.address || null;
      if (form.password) payload.password = form.password;

      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to update profile.");
        return;
      }
      crudToast.saved("Profile");
      setForm((prev) => ({ ...prev, password: "" }));
      setUser(data);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
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
            {user?.role === "member" && (
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
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
              <div className="grid gap-2">
                <Label htmlFor="blood_group">Blood group</Label>
                <Input
                  id="blood_group"
                  value={form.blood_group}
                  onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nid_number">NID Number</Label>
                <Input
                  id="nid_number"
                  value={form.nid_number}
                  onChange={(e) => setForm({ ...form, nid_number: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emergency_contact_number">Emergency Contact</Label>
                <Input
                  id="emergency_contact_number"
                  value={form.emergency_contact_number}
                  onChange={(e) =>
                    setForm({ ...form, emergency_contact_number: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">New password (leave blank to keep unchanged)</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={saving} className="mt-2 w-fit">
              {saving && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
