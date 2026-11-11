import { Star } from "lucide-react";
import { cn } from "../lib/utils.js";

export function StarRating({ rating, reviews, className }) {
  const rounded = Math.round(rating);
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn("size-3.5", i < rounded ? "fill-cta text-cta" : "fill-muted text-muted-foreground/40")}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {Number(rating).toFixed(1)}
        {typeof reviews === "number" && ` (${reviews.toLocaleString()})`}
      </span>
      <span className="sr-only">
        Rated {Number(rating).toFixed(1)} out of 5{typeof reviews === "number" ? ` from ${reviews} reviews` : ""}
      </span>
    </div>
  );
}
