"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import type { Paginated, Review } from "@/lib/types";
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

const STATUS_VARIANT: Record<Review["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

export default function PortalReceivedReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/portal/received-reviews?per_page=30");
        const data: Paginated<Review> = await res.json();
        setReviews(data.data ?? []);
      } catch {
        crudToast.error("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Reviews members have written about you. Only approved reviews show on your public profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Received Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No reviews yet.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.member.user.name}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        {review.rating}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{review.comment ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[review.status]}>{review.status}</Badge>
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
