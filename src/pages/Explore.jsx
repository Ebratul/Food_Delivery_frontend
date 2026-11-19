import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { RotateCcw, Search, SearchX, SlidersHorizontal } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import { RestaurantGrid } from "../components/restaurant/RestaurantCard.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { Checkbox, Select } from "../components/ui/Field.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import { useDebounce } from "../hooks/useDebounce.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useCategories, useRestaurants } from "../hooks/useQueries.js";
import { cn } from "../lib/utils.js";
import { CITIES } from "../lib/validation.js";

const SORT_OPTIONS = [
  ["rating:desc", "Top rated"],
  ["popular:desc", "Most reviewed"],
  ["deliveryTime:asc", "Fastest delivery"],
  ["price:asc", "Price: low to high"],
  ["price:desc", "Price: high to low"],
  ["newest:desc", "Newest"],
  ["name:asc", "Name A–Z"],
];

const FILTER_KEYS = ["category", "city", "minRating", "priceLevel", "maxDeliveryTime", "vegan"];

export default function Explore() {
  useDocumentTitle("Explore restaurants");
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 400);
  const { data: categories } = useCategories();

  const query = useMemo(() => {
    const q = Object.fromEntries(params.entries());
    return { limit: 12, sort: "rating:desc", ...q };
  }, [params]);

  const { data, isLoading, isFetching, isError, refetch } = useRestaurants(query);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v === "" || v === undefined || v === null || v === false) next.delete(k);
      else next.set(k, String(v));
    }
    if (!("page" in changes)) next.delete("page");
    setParams(next, { replace: true });
  };

  // sync debounced search box -> URL
  useEffect(() => {
    if ((params.get("search") ?? "") !== debouncedSearch.trim()) update({ search: debouncedSearch.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const activeFilters = FILTER_KEYS.filter((k) => params.get(k)).length;
  const reset = () => { setSearch(""); setParams(new URLSearchParams(), { replace: true }); };
  const onPage = (page) => { update({ page }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <PageHeader title="Explore" accent="Restaurants" description="Search by restaurant, dish or area, then narrow it down by cuisine, city, rating, price and delivery time." crumbs={[{ label: "Explore" }]} />

      <section className="container-x section-y pt-12">
        {/* toolbar */}
        <div className="surface rounded-[var(--radius-ui)] p-4 lg:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label htmlFor="explore-search" className="mb-2 block text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input id="explore-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Restaurant, dish or area (e.g. pho, Banani)"
                  className="h-12 w-full rounded-[var(--radius-ui)] border border-ui bg-[var(--surface)] pl-12 pr-4 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15" />
              </div>
            </div>
            <Select label="Sort by" className="md:w-56" value={query.sort} onChange={(e) => update({ sort: e.target.value })}>
              {SORT_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
            <Button variant="outline" className="h-12 md:hidden" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} aria-controls="explore-filters">
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilters > 0 && `(${activeFilters})`}
            </Button>
          </div>

          <div id="explore-filters" className={cn("mt-4 grid-cols-2 gap-3 border-t border-ui pt-4 md:grid lg:grid-cols-6", showFilters ? "grid" : "hidden")}>
            <Select label="Cuisine" value={params.get("category") ?? ""} onChange={(e) => update({ category: e.target.value })}>
              <option value="">All cuisines</option>
              {categories?.data?.map((c) => <option key={c.id} value={c.slug}>{c.name} ({c.restaurantCount})</option>)}
            </Select>
            <Select label="City" value={params.get("city") ?? ""} onChange={(e) => update({ city: e.target.value })}>
              <option value="">All cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Rating" value={params.get("minRating") ?? ""} onChange={(e) => update({ minRating: e.target.value })}>
              <option value="">Any rating</option>
              <option value="4.5">4.5 ★ and up</option>
              <option value="4">4.0 ★ and up</option>
              <option value="3.5">3.5 ★ and up</option>
            </Select>
            <Select label="Price" value={params.get("priceLevel") ?? ""} onChange={(e) => update({ priceLevel: e.target.value })}>
              <option value="">Any price</option>
              <option value="1">৳ Budget</option>
              <option value="2">৳৳ Moderate</option>
              <option value="3">৳৳৳ Premium</option>
            </Select>
            <Select label="Delivery time" value={params.get("maxDeliveryTime") ?? ""} onChange={(e) => update({ maxDeliveryTime: e.target.value })}>
              <option value="">Any time</option>
              <option value="30">Under 30 min</option>
              <option value="40">Under 40 min</option>
              <option value="50">Under 50 min</option>
            </Select>
            <div className="flex flex-col justify-end gap-3 pb-1">
              <Checkbox label="Vegan friendly" checked={params.get("vegan") === "true"} onChange={(e) => update({ vegan: e.target.checked ? "true" : "" })} />
              {(activeFilters > 0 || params.get("search")) && (
                <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-left text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* results */}
        <div className="mt-8 flex items-center justify-between gap-4" aria-live="polite">
          <p className="text-muted">
            {isLoading ? "Loading restaurants…" : <><b className="text-[var(--text)]">{data?.meta?.total ?? 0}</b> restaurants found{params.get("search") && <> for “{params.get("search")}”</>}</>}
          </p>
          {isFetching && !isLoading && <span className="text-sm text-muted">Updating…</span>}
        </div>

        <div className={cn("mt-6 transition-opacity", isFetching && !isLoading && "opacity-60")}>
          {isError ? (
            <EmptyState icon={SearchX} title="Couldn't load restaurants" description="Please check your connection and try again." action={<Button onClick={() => refetch()}>Try again</Button>} />
          ) : !isLoading && !data?.data?.length ? (
            <EmptyState icon={SearchX} title="No restaurants match your filters" description="Try a different search term or remove some filters." action={<Button onClick={reset}>Clear filters</Button>} />
          ) : (
            <RestaurantGrid restaurants={data?.data} loading={isLoading} count={12} />
          )}
        </div>

        <Pagination meta={data?.meta} onPageChange={onPage} className="mt-12" />
      </section>
    </>
  );
}
