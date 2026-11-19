import { cn } from "../../lib/utils.js";

/** Small pill tag + display heading. `accent` renders in italic, like "Popular *Cuisines*". */
export default function SectionHeading({ tag, title, accent, description, align = "left", dark = false, className, action }) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {tag && (
          <span className={cn("mb-4 inline-flex rounded-[var(--radius-ui)] border px-3 py-1 text-xs font-medium",
            dark ? "border-white/15 bg-white/5 text-brand-200" : "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200")}>
            {tag}
          </span>
        )}
        <h2 className={cn("t-h2", dark && "text-white")}>
          {title} {accent && <span className="accent-italic text-brand-500 dark:text-brand-300">{accent}</span>}
        </h2>
        {description && <p className={cn("mt-4 text-base", dark ? "text-white/60" : "text-muted")}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
