import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce.js";

/** State for server-side tables: page, debounced search, sort and filters. */
export function useTableParams({ sort: initialSort = "", limit = 10, filters: initialFilters = {} } = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearchRaw] = useState("");
  const [sort, setSortRaw] = useState(initialSort);
  const [filters, setFiltersRaw] = useState(initialFilters);
  const debouncedSearch = useDebounce(search, 350);

  const params = useMemo(() => {
    const p = { page, limit, ...(sort && { sort }), ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }) };
    for (const [k, v] of Object.entries(filters)) if (v) p[k] = v;
    return p;
  }, [page, limit, sort, debouncedSearch, filters]);

  return {
    params, page, search, sort, filters,
    setPage,
    setSearch: (v) => { setSearchRaw(v); setPage(1); },
    setSort: (v) => { setSortRaw(v); setPage(1); },
    setFilter: (key, value) => { setFiltersRaw((f) => ({ ...f, [key]: value })); setPage(1); },
  };
}
