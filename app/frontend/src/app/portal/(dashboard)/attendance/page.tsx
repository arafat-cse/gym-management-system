"use client";

import { useEffect, useState } from "react";

import type { Attendance, Paginated } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function PortalAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/portal/attendance?per_page=50");
        const data: Paginated<Attendance> = await res.json();
        setRecords(data.data ?? []);
      } catch {
        crudToast.error("Failed to load attendance.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Attendance</h1>
        <p className="text-sm text-muted-foreground">Your gym check-in / check-out history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No attendance recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.branch?.name ?? "—"}</TableCell>
                    <TableCell>{formatDateTime(record.check_in)}</TableCell>
                    <TableCell>
                      {record.check_out ? (
                        formatDateTime(record.check_out)
                      ) : (
                        <Badge>Checked in</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
