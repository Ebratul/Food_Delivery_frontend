import { cn } from "../../lib/utils.js";

const tones = {
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200",
  accent: "bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-200",
  success: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  neutral: "bg-[var(--surface-2)] text-[var(--text-muted)]",
  danger: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  dark: "bg-ink/80 text-white backdrop-blur",
};

export const STATUS_TONE = {
  PENDING: "accent", CONFIRMED: "brand", PREPARING: "brand", OUT_FOR_DELIVERY: "brand", DELIVERED: "success",
  CANCELLED: "danger", APPROVED: "success", REJECTED: "danger", NEW: "accent", READ: "neutral", RESOLVED: "success",
  ADMIN: "brand", USER: "neutral",
};

export default function Badge({ tone = "neutral", className, children, ...props }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-[var(--radius-ui)] px-2.5 py-1 text-xs font-medium", tones[tone], className)} {...props}>
      {children}
    </span>
  );
}
