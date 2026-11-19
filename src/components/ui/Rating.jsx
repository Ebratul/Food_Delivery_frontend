import { Star } from "lucide-react";
import { cn } from "../../lib/utils.js";

export function Stars({ value = 0, size = "h-4 w-4", className }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(size, i <= Math.round(value) ? "fill-accent-500 text-accent-500" : "text-[var(--border)]")} aria-hidden="true" />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange, error }) {
  return (
    <div>
      <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} star${i > 1 ? "s" : ""}`} onClick={() => onChange(i)}
            className="rounded-md p-1 transition-transform hover:scale-110">
            <Star className={cn("h-7 w-7", i <= value ? "fill-accent-500 text-accent-500" : "text-[var(--border)]")} />
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
