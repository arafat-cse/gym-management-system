"use client";

import { useEffect, useState } from "react";
import { LogOut, Loader2, Plus } from "lucide-react";

import type { Attendance, Branch, Member, Paginated } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOutId, setCheckingOutId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [attRes, memRes, branchRes] = await Promise.all([
        fetch("/api/admin/attendance?per_page=50"),
        fetch("/api/admin/members?per_page=100"),
        fetch("/api/admin/branches?per_page=100"),
      ]);
      const attData: Paginated<Attendance> = await attRes.json();
      const memData: Paginated<Member> = await memRes.json();
      const branchData: Paginated<Branch> = await branchRes.json();
      setRecords(attData.data ?? []);
      setMembers(memData.data ?? []);
      setBranches(branchData.data ?? []);
    } catch {
      crudToast.error("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCheckIn() {
    setMemberId("");
    setBranchId("");
    setDialogOpen(true);
  }

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();
    setCheckingIn(true);
    try {
      const res = await fetch("/api/admin/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: Number(memberId),
          branch_id: branchId ? Number(branchId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to check in.");
        return;
      }
      crudToast.action("Member checked in.");
      setDialogOpen(false);
      load();
    } finally {
      setCheckingIn(false);
    }
  }

  async function handleCheckOut(record: Attendance) {
    setCheckingOutId(record.id);
    try {
      const res = await fetch(`/api/admin/attendance/${record.id}/check-out`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to check out.");
        return;
      }
      crudToast.action("Member checked out.");
      load();
    } finally {
      setCheckingOutId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-muted-foreground">Member check-in / check-out log</p>
        </div>
        <Button onClick={openCheckIn}>
          <Plus /> Check In
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
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
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No attendance records yet.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.member.user.name}</TableCell>
                    <TableCell>{record.branch?.name ?? "—"}</TableCell>
                    <TableCell>{formatDateTime(record.check_in)}</TableCell>
                    <TableCell>
                      {record.check_out ? (
                        formatDateTime(record.check_out)
                      ) : (
                        <Badge variant="default">Checked in</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!record.check_out && (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={checkingOutId === record.id}
                          onClick={() => handleCheckOut(record)}
                        >
                          {checkingOutId === record.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <LogOut className="size-4 text-destructive" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCheckIn}>
            <DialogHeader>
              <DialogTitle>Check In Member</DialogTitle>
              <DialogDescription>Record a member&apos;s arrival at the gym.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Member</Label>
                <Select value={memberId} onValueChange={setMemberId}>
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
                <Label>Branch (optional)</Label>
                <Select
                  value={branchId || "none"}
                  onValueChange={(v) => setBranchId(v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Member&apos;s default branch</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={checkingIn || !memberId}>
                {checkingIn && <Loader2 className="animate-spin" />}
                Check In
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
