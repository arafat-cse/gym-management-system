"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Star, Trash2, X } from "lucide-react";

import type { Paginated, Review } from "@/lib/types";
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
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

const STATUS_VARIANT: Record<Review["status"], "default" | "secondary" | "destructive"> = {
  pending: "default",
  approved: "secondary",
  rejected: "destructive",
};

type FilterStatus = Review["status"] | "all";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<FilterStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const qs = status === "all" ? "" : `&status=${status}`;
      const res = await fetch(`/api/admin/reviews?per_page=50${qs}`);
      const data: Paginated<Review> = await res.json();
      setReviews(data.data ?? []);
    } catch {
      crudToast.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function setReviewStatus(review: Review, next: "approved" | "rejected") {
    setActingId(review.id);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to update review.");
        return;
      }
      crudToast.action(`Review ${next}.`);
      load();
    } finally {
      setActingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        crudToast.error("Failed to delete review.");
        return;
      }
      crudToast.deleted("Review");
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Moderate member reviews before they show on trainer profiles
        </p>
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
          <CardTitle className="text-base">Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
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
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No reviews.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.member.user.name}</TableCell>
                    <TableCell>{review.trainer.user.name}</TableCell>
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
                    <TableCell className="text-right">
                      {review.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actingId === review.id}
                            onClick={() => setReviewStatus(review, "approved")}
                          >
                            {actingId === review.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Check className="size-4 text-primary" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actingId === review.id}
                            onClick={() => setReviewStatus(review, "rejected")}
                          >
                            <X className="size-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(review)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete review?"
        description="This will permanently delete this review. This cannot be undone."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
