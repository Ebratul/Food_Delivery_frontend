import { cn } from "../../lib/utils.js";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("surface flex flex-col items-center rounded-[var(--radius-ui)] px-6 py-16 text-center", className)}>
      {Icon && <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius-ui)] bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"><Icon className="h-7 w-7" /></span>}
      <h3 className="t-h4">{title}</h3>
      {description && <p className="mt-2 max-w-md text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
