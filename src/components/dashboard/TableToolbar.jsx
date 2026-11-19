import { Search } from "lucide-react";

/** Search box + filter slots above a data table. */
export default function TableToolbar({ search, onSearch, placeholder = "Search…", children }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <label htmlFor="table-search" className="sr-only">{placeholder}</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input id="table-search" type="search" value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder}
          className="h-11 w-full rounded-[var(--radius-ui)] border border-ui bg-[var(--surface)] pl-11 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15" />
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

export function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}
        className="h-11 cursor-pointer rounded-[var(--radius-ui)] border border-ui bg-[var(--surface)] px-3 text-sm focus:border-brand-500 focus:outline-none">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
