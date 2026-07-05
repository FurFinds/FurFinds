"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function ReviewForm({ businessName }: { businessName: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

      <div className="mt-4">
        <label htmlFor="review-photo" className="mb-2 block text-sm font-medium text-black">
          Add a photo (optional)
        </label>
        <input
          id="review-photo"
          type="file"
          accept="image/*"
          className="w-full text-sm text-black/70 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-dark-blue"
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0}
        className="mt-5 w-full rounded-full bg-light-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-blue disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit Review
      </button>
    </form>
  );
}
