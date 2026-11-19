import { cn } from "../../lib/utils.js";
import Skeleton from "../ui/Skeleton.jsx";

const tones = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
  accent: "bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300",
  success: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
};

export default function StatCard({ icon: Icon, label, value, hint, tone = "brand", loading }) {
  return (
    <div className="surface rounded-[var(--radius-ui)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted">{label}</p>
          {loading ? <Skeleton className="mt-2 h-9 w-24" /> : <p className="mt-2 font-display text-3xl font-bold">{value}</p>}
        </div>
        <span className={cn("inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-ui)]", tones[tone])}><Icon className="h-6 w-6" /></span>
      </div>
      {hint && <p className="mt-3 text-sm text-muted">{hint}</p>}
    </div>
  );
}
