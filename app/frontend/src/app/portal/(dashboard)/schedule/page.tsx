"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import type { TrainerSchedule } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

type ScheduleRow = {
  day_of_week: number;
  is_available: boolean;
  start_time: string;
  end_time: string;
  max_sessions: string;
  notes: string;
};

function defaultScheduleRows(existing: TrainerSchedule[]): ScheduleRow[] {
  return DAYS.map((day) => {
    const found = existing.find((s) => s.day_of_week === day.value);
    return {
      day_of_week: day.value,
      is_available: found?.is_available ?? false,
      start_time: found?.start_time?.slice(0, 5) ?? "09:00",
      end_time: found?.end_time?.slice(0, 5) ?? "17:00",
      max_sessions: String(found?.max_sessions ?? 1),
      notes: found?.notes ?? "",
    };
  });
}

export default function PortalSchedulePage() {
  const [rows, setRows] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/my-schedule");
      const data: TrainerSchedule[] = await res.json();
      setRows(defaultScheduleRows(data ?? []));
    } catch {
      crudToast.error("Failed to load schedule.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateRow(day: number, patch: Partial<ScheduleRow>) {
    setRows((prev) => prev.map((row) => (row.day_of_week === day ? { ...row, ...patch } : row)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        schedules: rows.map((row) => ({
          day_of_week: row.day_of_week,
          start_time: row.start_time,
          end_time: row.end_time,
          is_available: row.is_available,
          max_sessions: Number(row.max_sessions) || 1,
          notes: row.notes || null,
        })),
      };
      const res = await fetch("/api/portal/my-schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to save schedule.");
        return;
      }
      crudToast.saved("Schedule");
      setRows(defaultScheduleRows(data));
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
        <h1 className="text-2xl font-semibold">My Schedule</h1>
        <p className="text-sm text-muted-foreground">Set your weekly availability for session bookings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Availability</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {rows.map((row) => (
            <div
              key={row.day_of_week}
              className="grid grid-cols-[120px_auto_1fr_1fr_100px_1fr] items-center gap-3 border-b pb-3 last:border-0"
            >
              <span className="text-sm font-medium">
                {DAYS.find((d) => d.value === row.day_of_week)?.label}
              </span>
              <Switch
                checked={row.is_available}
                onCheckedChange={(checked) => updateRow(row.day_of_week, { is_available: checked })}
              />
              <Input
                type="time"
                value={row.start_time}
                disabled={!row.is_available}
                onChange={(e) => updateRow(row.day_of_week, { start_time: e.target.value })}
              />
              <Input
                type="time"
                value={row.end_time}
                disabled={!row.is_available}
                onChange={(e) => updateRow(row.day_of_week, { end_time: e.target.value })}
              />
              <Input
                type="number"
                min="1"
                placeholder="Max"
                value={row.max_sessions}
                disabled={!row.is_available}
                onChange={(e) => updateRow(row.day_of_week, { max_sessions: e.target.value })}
              />
              <Input
                placeholder="Notes"
                value={row.notes}
                disabled={!row.is_available}
                onChange={(e) => updateRow(row.day_of_week, { notes: e.target.value })}
              />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              Save schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
