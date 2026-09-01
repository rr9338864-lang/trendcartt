import { Star } from "lucide-react";

interface Props {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, reviewCount, size = 13, className = "" }: Props) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label={`Rated ${rating} out of 5`}>
      <span className="flex text-gold">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            strokeWidth={1.6}
            className={i < rounded ? "fill-current" : "text-ink-muted"}
          />
        ))}
      </span>
      <span className="text-[11px] text-ink-muted tabular-nums">
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount.toLocaleString("en-US")})`}
      </span>
    </div>
  );
}
