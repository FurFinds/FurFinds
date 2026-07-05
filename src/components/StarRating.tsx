import { Star, StarHalf } from "lucide-react";

export function StarRating({
  rating,
  reviewCount,
  size = 16,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) {
            return <Star key={i} size={size} fill="#FFC107" stroke="#FFC107" />;
          }
          if (i === full && hasHalf) {
            return <StarHalf key={i} size={size} fill="#FFC107" stroke="#FFC107" />;
          }
          return <Star key={i} size={size} fill="none" stroke="#FFC107" />;
        })}
      </div>
      <span className="text-sm text-black/70">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" && <span> ({reviewCount})</span>}
      </span>
    </div>
  );
}
