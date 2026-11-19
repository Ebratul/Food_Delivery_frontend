import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils.js";

function pages(current, total) {
  const set = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => { if (i && p - sorted[i - 1] > 1) out.push("…"); out.push(p); });
  return out;
}

export default function Pagination({ meta, onPageChange, className }) {
  if (!meta || meta.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  const btn = "inline-flex h-10 min-w-10 items-center justify-center rounded-[var(--radius-ui)] border border-ui px-3 text-sm transition-colors disabled:opacity-40";
  return (
    <nav className={cn("flex flex-col items-center justify-between gap-4 sm:flex-row", className)} aria-label="Pagination">
      <p className="text-sm text-muted">Showing <b className="text-[var(--text)]">{from}–{to}</b> of {total}</p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={cn(btn, "hover:border-brand-400")} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages(page, totalPages).map((p, i) =>
          p === "…" ? <span key={`e${i}`} className="px-1 text-muted">…</span> : (
            <button key={p} type="button" onClick={() => onPageChange(p)} aria-current={p === page ? "page" : undefined}
              className={cn(btn, p === page ? "border-brand-500 bg-brand-500 text-white" : "hover:border-brand-400")}>{p}</button>
          ))}
        <button type="button" className={cn(btn, "hover:border-brand-400")} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
