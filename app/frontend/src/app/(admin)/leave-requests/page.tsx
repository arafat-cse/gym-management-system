"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import type { LeaveRequest, Paginated } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_VARIANT: Record<LeaveRequest["status"], "default" | "secondary" | "destructive"> = {
  pending: "default",
  approved: "secondary",
  rejected: "destructive",
};

type FilterStatus = LeaveRequest["status"] | "all";

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [status, setStatus] = useState<FilterStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const qs = status === "all" ? "" : `&status=${status}`;
      const res = await fetch(`/api/admin/leave-requests?per_page=50${qs}`);
      const data: Paginated<LeaveRequest> = await res.json();
      setRequests(data.data ?? []);
    } catch {
      crudToast.error("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function setRequestStatus(request: LeaveRequest, next: "approved" | "rejected") {
    setActingId(request.id);
    try {
      const res = await fetch(`/api/admin/leave-requests/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to update leave request.");
        return;
      }
      crudToast.action(`Leave request ${next}.`);
      load();
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Leave Requests</h1>
        <p className="text-sm text-muted-foreground">Staff leave requests</p>
      </div>

      <Tabs value={status} onValueChange={(v) => setStatus(v as FilterStatus)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Reason</TableHead>
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
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No leave requests.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.staff.user.name}</TableCell>
                    <TableCell className="capitalize">{request.leave_type}</TableCell>
                    <TableCell>{request.start_date}</TableCell>
                    <TableCell>{request.end_date}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.reason ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[request.status]}>{request.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actingId === request.id}
                            onClick={() => setRequestStatus(request, "approved")}
                          >
                            {actingId === request.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Check className="size-4 text-primary" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actingId === request.id}
                            onClick={() => setRequestStatus(request, "rejected")}
                          >
                            <X className="size-4 text-destructive" />
                          </Button>
                        </>
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
