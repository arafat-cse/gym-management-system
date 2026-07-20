"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Star } from "lucide-react";

import type { Paginated, Review, Trainer } from "@/lib/types";
import { crudToast } from "@/lib/crud-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PortalTrainerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trainerId = params.id as string;

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [trainerRes, reviewsRes] = await Promise.all([
        fetch(`/api/portal/trainers/${trainerId}`),
        fetch(`/api/portal/trainers/${trainerId}/reviews`),
      ]);
      setTrainer(await trainerRes.json());
      const reviewsData: Paginated<Review> = await reviewsRes.json();
      setReviews(reviewsData.data ?? []);
    } catch {
      crudToast.error("Failed to load trainer.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainer_id: Number(trainerId), rating, comment: comment || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        crudToast.error(data.message ?? "Failed to submit review.");
        return;
      }
      crudToast.action("Review submitted — pending approval.");
      setComment("");
      setRating(5);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (!trainer) {
    return <p className="text-sm text-muted-foreground">Trainer not found.</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/portal/trainers")}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{trainer.user.name}</h1>
          <p className="text-sm text-muted-foreground">
            {trainer.specialization ?? "Trainer"} {trainer.branch ? `· ${trainer.branch.name}` : ""}
          </p>
        </div>
        <Badge className="ml-auto">{trainer.status}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p className="text-muted-foreground">{trainer.bio ?? "No bio provided."}</p>
            <p>Experience: {trainer.experience_years} years</p>
            <p>Session rate: ৳{trainer.session_rate ?? "—"}</p>
            <p className="flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {trainer.rating_avg ?? "—"} ({trainer.total_sessions} sessions)
            </p>
            {(trainer.specializations ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {trainer.specializations?.map((spec) => (
                  <Badge key={spec.id} variant="secondary">
                    {spec.specialization_name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {(trainer.schedules ?? []).filter((s) => s.is_available).length === 0 ? (
              <p className="text-muted-foreground">No published schedule yet.</p>
            ) : (
              trainer.schedules
                ?.filter((s) => s.is_available)
                .map((s) => (
                  <div key={s.id} className="flex justify-between border-b pb-1 last:border-0">
                    <span>{DAY_NAMES[s.day_of_week]}</span>
                    <span className="text-muted-foreground">
                      {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}
                    </span>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reviews</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.member.user.name}</span>
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {review.rating}
                  </span>
                </div>
                {review.comment && <p className="mt-1 text-muted-foreground">{review.comment}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitReview} className="grid gap-3">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)}>
                  <Star
                    className={`size-6 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Share your experience with this trainer (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" disabled={submitting} className="w-fit">
              {submitting && <Loader2 className="animate-spin" />}
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
