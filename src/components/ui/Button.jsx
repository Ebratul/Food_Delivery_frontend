import { Link } from "react-router";
import { cn } from "../../lib/utils.js";
import Spinner from "./Spinner.jsx";

const variants = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)] disabled:bg-brand-500/60",
  accent: "bg-accent-500 text-white hover:bg-accent-600 disabled:bg-accent-500/60",
  secondary: "bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border)]",
  outline: "border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-300",
  ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/60",
  light: "bg-white text-ink hover:bg-brand-50",
};

const sizes = {
  sm: "h-9 px-4 text-sm gap-2",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-14 px-8 text-base gap-3",
  icon: "h-10 w-10 justify-center",
};

export default function Button({ as, to, href, variant = "primary", size = "md", loading = false, className, children, disabled, type = "button", ...props }) {
  const classes = cn(
    "inline-flex select-none items-center justify-center rounded-[var(--radius-ui)] font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed",
    variants[variant], sizes[size], className,
  );
  const content = (
    <>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </>
  );
  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{content}</a>;
  const Comp = as ?? "button";
  return (
    <Comp type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {content}
    </Comp>
  );
}
