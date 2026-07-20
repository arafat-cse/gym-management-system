"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

import type { Paginated, Subscription } from "@/lib/types";
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

const STATUS_VARIANT: Record<Subscription["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  active: "default",
  expired: "secondary",
  cancelled: "destructive",
};

export default function SubscriptionPage() {
  const [current, setCurrent] = useState<Subscription | null>(null);
  const [history, setHistory] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [currentRes, historyRes] = await Promise.all([
          fetch("/api/portal/subscription"),
          fetch("/api/portal/subscription/history?per_page=20"),
        ]);
        setCurrent(currentRes.status === 200 ? await currentRes.json() : null);
        const historyData: Paginated<Subscription> = await historyRes.json();
        setHistory(historyData.data ?? []);
      } catch {
        crudToast.error("Failed to load subscription.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Subscription</h1>
        <p className="text-sm text-muted-foreground">Current membership and billing history</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : current ? (
        <Card className="max-w-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="size-4" /> {current.membership_plan.name}
            </CardTitle>
            <Badge variant={STATUS_VARIANT[current.status]}>{current.status}</Badge>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm text-muted-foreground">
            <p>Price paid: ৳{current.price_paid}</p>
            <p>Start: {current.start_date}</p>
            <p>Ends: {current.end_date}</p>
            {current.notes && <p>Notes: {current.notes}</p>}
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-lg">
          <CardContent className="py-6 text-sm text-muted-foreground">
            No active subscription. Visit the front desk or register for a plan.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No subscription history.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.membership_plan.name}</TableCell>
                    <TableCell>৳{sub.price_paid}</TableCell>
                    <TableCell>{sub.start_date}</TableCell>
                    <TableCell>{sub.end_date}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[sub.status]}>{sub.status}</Badge>
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
