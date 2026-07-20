"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import type { HealthInfo } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormState = {
  height: string;
  weight: string;
  blood_type: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergency_contact: string;
};

const EMPTY_FORM: FormState = {
  height: "",
  weight: "",
  blood_type: "",
  allergies: "",
  conditions: "",
  medications: "",
  emergency_contact: "",
};

export default function PortalHealthInfoPage() {
  const [record, setRecord] = useState<HealthInfo | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/health-info");
      if (res.status === 200) {
        const data: HealthInfo = await res.json();
        setRecord(data);
        setForm({
          height: data.height ?? "",
          weight: data.weight ?? "",
          blood_type: data.blood_type ?? "",
          allergies: data.allergies ?? "",
          conditions: data.conditions ?? "",
          medications: data.medications ?? "",
          emergency_contact: data.emergency_contact ?? "",
        });
      }
    } catch {
      crudToast.error("Failed to load health info.");
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
      const res = await fetch("/api/portal/health-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: form.height ? Number(form.height) : null,
          weight: form.weight ? Number(form.weight) : null,
          blood_type: form.blood_type || null,
          allergies: form.allergies || null,
          conditions: form.conditions || null,
          medications: form.medications || null,
          emergency_contact: form.emergency_contact || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save health info.");
        return;
      }
      crudToast.saved("Health info");
      setRecord(data);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Health Info</h1>
          <p className="text-sm text-muted-foreground">Your health record on file at the gym</p>
        </div>
        {record?.bmi && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">BMI</p>
            <p className="text-2xl font-bold">{record.bmi}</p>
          </div>
        )}
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Update Health Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
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
            <Button type="submit" disabled={saving} className="w-fit">
              {saving && <Loader2 className="animate-spin" />}
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
