import { cn } from "../../lib/utils.js";

export default function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-[var(--radius-ui)] bg-[var(--surface-2)]", className)} aria-hidden="true" />;
}
