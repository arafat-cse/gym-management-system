"use client";

import { useEffect, useState } from "react";
import { Check, ImageOff, Loader2, X } from "lucide-react";

import type { Payment, Paginated } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_VARIANT: Record<Payment["status"], "default" | "secondary" | "destructive"> = {
  pending: "default",
  approved: "secondary",
  rejected: "destructive",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Payment | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const qs = status === "all" ? "" : `&status=${status}`;
      const res = await fetch(`/api/admin/payments?per_page=50${qs}`);
      const data: Paginated<Payment> = await res.json();
      setPayments(data.data ?? []);
    } catch {
      crudToast.error("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function handleApprove(payment: Payment) {
    setApprovingId(payment.id);
    try {
      const res = await fetch(`/api/admin/payments/${payment.id}/approve`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to approve payment.");
        return;
      }
      crudToast.action(
        `${payment.member_registration.first_name} ${payment.member_registration.last_name} approved — subscription activated.`
      );
      load();
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject() {
    if (!rejectTarget) return;
    setRejecting(true);
    try {
      const res = await fetch(`/api/admin/payments/${rejectTarget.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejection_reason: rejectReason || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to reject payment.");
        return;
      }
      crudToast.action("Payment rejected.");
      setRejectTarget(null);
      setRejectReason("");
      load();
    } finally {
      setRejecting(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Review bKash/Nagad transaction proof submitted by prospects
        </p>
      </div>

      <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No payments.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.member_registration.first_name} {payment.member_registration.last_name}
                      <div className="text-xs text-muted-foreground">{payment.member_registration.email}</div>
                    </TableCell>
                    <TableCell>{payment.membership_plan.name}</TableCell>
                    <TableCell className="capitalize">{payment.method}</TableCell>
                    <TableCell>{payment.sender_number}</TableCell>
                    <TableCell className="font-mono text-xs">{payment.transaction_id}</TableCell>
                    <TableCell>৳{payment.amount}</TableCell>
                    <TableCell>
                      {payment.screenshot_url ? (
                        <a
                          href={payment.screenshot_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline text-xs"
                        >
                          View
                        </a>
                      ) : (
                        <ImageOff className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[payment.status]}>{payment.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={approvingId === payment.id}
                            onClick={() => handleApprove(payment)}
                          >
                            {approvingId === payment.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Check className="size-4 text-primary" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setRejectTarget(payment)}>
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

      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject payment?</DialogTitle>
            <DialogDescription>
              {rejectTarget?.member_registration.first_name} {rejectTarget?.member_registration.last_name}&apos;s
              payment will be rejected. They can resubmit a corrected payment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Transaction ID not found in statement."
            />
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleReject} disabled={rejecting}>
              {rejecting && <Loader2 className="animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
