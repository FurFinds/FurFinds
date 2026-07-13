"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export function ReviewForm({
  businessName,
  businessSlug,
}: {
  businessName: string;
  businessSlug: string;
}) {
  const { user, loading: userLoading } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");
    const { error } = await supabase.from("site_reviews").insert({
      user_id: user.id,
      author_name: (user.user_metadata?.full_name as string) || null,
      business_slug: businessSlug,
      business_name: businessName,
      rating,
      comment,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-bg-blue/50 p-6 text-center">
        <p className="font-medium text-black">Thank you for your review!</p>
        <p className="mt-1 text-sm text-black/70">
          Your feedback helps other pet parents find great places like {businessName}.
        </p>
      </div>
    );
  }

  if (!userLoading && !user) {
    return (
      <div className="rounded-2xl bg-bg-blue/40 p-6 text-center">
        <p className="text-sm text-black/70">
          <Link href="/login" className="font-medium text-dark-blue hover:underline">
            Log in
          </Link>{" "}
          to leave a review for {businessName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-bg-blue/40 p-6">
      <h3 className="font-display text-lg font-medium text-black">Leave a Review</h3>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-black">Your rating</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const filled = value <= (hoverRating || rating);
            return (
              <button
                type="button"
                key={value}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(value)}
              >
                <Star size={26} fill={filled ? "#FFC107" : "none"} stroke="#FFC107" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-black">
          Your review
        </label>
        <textarea
          id="review-comment"
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell other pet parents about your visit..."
          className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-dark-blue"
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="mt-5 w-full rounded-full bg-light-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-blue disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
