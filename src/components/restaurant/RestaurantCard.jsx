import { memo } from "react";
import { Link } from "react-router";
import { Bike, Clock, Leaf, MapPin, Star } from "lucide-react";
import { formatPrice, thumb } from "../../lib/utils.js";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Skeleton from "../ui/Skeleton.jsx";

function RestaurantCard({ restaurant: r }) {
  return (
    <article className="surface group flex h-full flex-col overflow-hidden rounded-[var(--radius-ui)] transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-500/5">
      <Link to={`/restaurants/${r.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--surface-2)]" tabIndex={-1} aria-hidden="true">
        <img src={thumb(r.images?.[0])} alt="" loading="lazy" decoding="async" width="400" height="300"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="dark">{r.category?.name}</Badge>
          {r.isVeganFriendly && <Badge tone="dark"><Leaf className="h-3 w-3 text-success-400" /> Vegan</Badge>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="t-h4 line-clamp-1"><Link to={`/restaurants/${r.slug}`} className="hover:text-brand-600 dark:hover:text-brand-300">{r.name}</Link></h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-accent-500 text-accent-500" aria-hidden="true" />{r.rating?.toFixed(1)}
            <span className="font-normal text-muted">({r.reviewCount})</span>
          </span>
        </div>
        <p className="mt-1 line-clamp-2 min-h-12 text-sm text-muted">{r.tagline}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted">
          <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 shrink-0" /><dt className="sr-only">Location</dt><dd className="truncate">{r.area}, {r.city}</dd></div>
          <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 shrink-0" /><dt className="sr-only">Delivery time</dt><dd>{r.deliveryTimeMin}–{r.deliveryTimeMax} min</dd></div>
          <div className="flex items-center gap-1.5"><Bike className="h-4 w-4 shrink-0" /><dt className="sr-only">Delivery fee</dt><dd>{formatPrice(r.deliveryFee)} delivery</dd></div>
          <div className="flex items-center gap-1.5"><dt className="sr-only">Average price</dt><dd><b className="text-[var(--text)]">{formatPrice(r.avgMealPrice)}</b> avg</dd></div>
        </dl>
        <Button to={`/restaurants/${r.slug}`} variant="outline" className="mt-4 w-full" aria-label={`View details for ${r.name}`}>View Details</Button>
      </div>
    </article>
  );
}

export default memo(RestaurantCard);

export function RestaurantCardSkeleton() {
  return (
    <div className="surface flex h-full flex-col overflow-hidden rounded-[var(--radius-ui)]" aria-hidden="true">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-2 gap-2"><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /><Skeleton className="h-4" /></div>
        <Skeleton className="mt-auto h-11 w-full" />
      </div>
    </div>
  );
}

export function RestaurantGrid({ restaurants, loading, count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading ? Array.from({ length: count }, (_, i) => <RestaurantCardSkeleton key={i} />) : restaurants?.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
    </div>
  );
}
