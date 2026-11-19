import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils.js";

export default function Alert({ type = "error", children, className }) {
  if (!children) return null;
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div role={type === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-[var(--radius-ui)] border px-4 py-3 text-sm",
        type === "success" ? "border-success-500/30 bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400" : "border-red-500/30 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300", className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
