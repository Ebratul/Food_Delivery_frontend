import { Link } from "react-router";
import { cn } from "../../lib/utils.js";

export default function Logo({ className, light = false }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight", light ? "text-white" : "text-[var(--text)]", className)} aria-label="FoodDash home">
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#7D40FF" />
        <path d="M18 40c0-8 6.3-14 14-14s14 6 14 14" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <path d="M14 44h36" stroke="#FF6A2B" strokeWidth="5" strokeLinecap="round" />
        <circle cx="32" cy="21" r="3" fill="#fff" />
      </svg>
      <span>food<span className="accent-italic text-brand-500 dark:text-brand-300">dash</span></span>
    </Link>
  );
}
