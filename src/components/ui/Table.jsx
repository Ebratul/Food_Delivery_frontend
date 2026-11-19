import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "../../lib/utils.js";
import Skeleton from "./Skeleton.jsx";

/**
 * Data table with server-side sorting.
 * columns: [{ key, header, sortKey?, render?(row), className? }]
 * sort: "field:asc|desc", onSortChange(nextSort)
 */
export default function Table({ columns, rows, loading, sort, onSortChange, rowKey = "id", empty = "No records found", caption }) {
  const [sortField, sortDir] = (sort ?? "").split(":");

  const toggleSort = (key) => {
    if (!onSortChange) return;
    onSortChange(sortField === key && sortDir === "desc" ? `${key}:asc` : `${key}:desc`);
  };

  return (
    <div className="surface overflow-hidden rounded-[var(--radius-ui)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-[var(--surface-2)] text-xs uppercase tracking-wider text-muted">
            <tr>
              {columns.map((col) => {
                const active = col.sortKey && sortField === col.sortKey;
                return (
                  <th key={col.key} scope="col" className={cn("px-4 py-3 font-semibold", col.className)} aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}>
                    {col.sortKey ? (
                      <button type="button" onClick={() => toggleSort(col.sortKey)} className="inline-flex items-center gap-1 uppercase hover:text-[var(--text)]">
                        {col.header}
                        {active ? (sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                      </button>
                    ) : col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading
              ? Array.from({ length: 6 }, (_, i) => (
                  <tr key={i}>{columns.map((c) => <td key={c.key} className="px-4 py-4"><Skeleton className="h-5 w-full max-w-40" /></td>)}</tr>
                ))
              : rows?.length
                ? rows.map((row) => (
                    <tr key={row[rowKey]} className="transition-colors hover:bg-[var(--surface-2)]/60">
                      {columns.map((col) => <td key={col.key} className={cn("px-4 py-3 align-middle", col.className)}>{col.render ? col.render(row) : row[col.key]}</td>)}
                    </tr>
                  ))
                : (
                  <tr><td colSpan={columns.length} className="px-4 py-16 text-center text-muted">{empty}</td></tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
