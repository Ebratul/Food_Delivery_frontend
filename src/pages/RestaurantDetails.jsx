import { Link, useParams } from "react-router";
import { Bike, Clock, Leaf, MapPin, Phone, ShoppingBag, Star, Store, Timer, Wallet } from "lucide-react";
import Gallery from "../components/restaurant/Gallery.jsx";
import MenuSection from "../components/restaurant/MenuSection.jsx";
import RestaurantCard from "../components/restaurant/RestaurantCard.jsx";
import Reviews from "../components/restaurant/Reviews.jsx";
import Badge, { STATUS_TONE } from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { useCart } from "../hooks/useCart.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useRestaurant } from "../hooks/useQueries.js";
import { formatDate, formatPrice, priceLevelLabel, STATUS_LABELS } from "../lib/utils.js";

function DetailsSkeleton() {
  return (
    <div className="container-x py-8">
      <Skeleton className="h-8 w-64" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="aspect-[16/10]" />
        <div className="space-y-4"><Skeleton className="h-12 w-3/4" /><Skeleton className="h-24" /><Skeleton className="h-48" /></div>
      </div>
    </div>
  );
}

export default function RestaurantDetails() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useRestaurant(slug);
  const r = data?.data;
  const cart = useCart();
  useDocumentTitle(r?.name ?? "Restaurant");

  if (isLoading) return <DetailsSkeleton />;
  if (isError || !r) {
    return (
      <div className="container-x section-y">
        <EmptyState icon={Store} title="Restaurant not found" description="It may have been removed or is waiting for approval." action={<Button to="/explore">Explore restaurants</Button>} />
      </div>
    );
  }

  const specs = [
    { icon: Clock, label: "Delivery time", value: `${r.deliveryTimeMin}–${r.deliveryTimeMax} min` },
    { icon: Bike, label: "Delivery fee", value: formatPrice(r.deliveryFee) },
    { icon: ShoppingBag, label: "Minimum order", value: formatPrice(r.minOrder) },
    { icon: Wallet, label: "Average main", value: `${formatPrice(r.avgMealPrice)} · ${priceLevelLabel(r.priceLevel)}` },
    { icon: Timer, label: "Opening hours", value: r.openingHours },
    { icon: Phone, label: "Phone", value: <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="hover:underline">{r.phone}</a> },
    { icon: MapPin, label: "Address", value: r.address },
    { icon: Leaf, label: "Vegan options", value: r.isVeganFriendly ? "Yes, clearly marked" : "Limited" },
  ];
  const cartHere = cart.restaurant?.id === r.id && cart.count > 0;

  return (
    <article className="pb-16 lg:pb-24">
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link to="/" className="hover:text-[var(--text)]">Home</Link> / <Link to="/explore" className="hover:text-[var(--text)]">Explore</Link> /{" "}
          <Link to={`/explore?category=${r.category.slug}`} className="hover:text-[var(--text)]">{r.category.name}</Link> / <span aria-current="page" className="text-[var(--text)]">{r.name}</span>
        </nav>

        {r.status !== "APPROVED" && (
          <div className="mt-4 rounded-[var(--radius-ui)] border border-accent-300 bg-accent-50 px-4 py-3 text-sm text-accent-700 dark:bg-accent-500/10 dark:text-accent-200">
            This listing is <b>{STATUS_LABELS[r.status].toLowerCase()}</b> and only visible to you and administrators.
          </div>
        )}

        {/* media + summary */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <Gallery images={r.images} name={r.name} />
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              <Badge tone="brand">{r.category.name}</Badge>
              {r.isFeatured && <Badge tone="accent">Featured</Badge>}
              {r.isVeganFriendly && <Badge tone="success"><Leaf className="h-3 w-3" /> Vegan friendly</Badge>}
              {r.status !== "APPROVED" && <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABELS[r.status]}</Badge>}
            </div>
            <h1 className="t-h2 mt-4">{r.name}</h1>
            <p className="mt-2 text-lg text-muted">{r.tagline}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold"><Star className="h-5 w-5 fill-accent-500 text-accent-500" /> {r.rating.toFixed(1)} <span className="font-normal text-muted">({r.reviewCount} reviews)</span></span>
              <span className="inline-flex items-center gap-1 text-muted"><MapPin className="h-4 w-4" /> {r.area}, {r.city}</span>
              <span className="text-muted">Listed {formatDate(r.createdAt, { month: "long", year: "numeric" })}</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {specs.slice(0, 4).map((s) => (
                <div key={s.label} className="surface rounded-[var(--radius-ui)] p-4">
                  <s.icon className="h-5 w-5 text-brand-500" />
                  <p className="mt-2 text-xs uppercase tracking-wider text-muted">{s.label}</p>
                  <p className="font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-auto lg:pt-6">
              <Button href="#menu" size="lg" className="flex-1">Browse menu</Button>
              {cartHere && <Button to="/cart" size="lg" variant="accent" className="flex-1">View cart ({cart.count})</Button>}
            </div>
          </div>
        </div>
      </div>

      {/* overview + key information */}
      <section className="container-x mt-16 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12" aria-labelledby="overview-heading">
        <div>
          <h2 id="overview-heading" className="t-h3">Overview</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{r.description}</p>
          {r.owner && <p className="mt-4 text-sm text-muted">Managed by <b className="text-[var(--text)]">{r.owner.name}</b></p>}
        </div>
        <div>
          <h2 className="t-h3">Key information</h2>
          <dl className="surface mt-4 divide-y divide-[var(--border)] rounded-[var(--radius-ui)]">
            {specs.map((s) => (
              <div key={s.label} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
                <dt className="flex items-center gap-2 text-muted"><s.icon className="h-4 w-4" />{s.label}</dt>
                <dd className="text-right font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="menu" className="container-x mt-16 scroll-mt-24" aria-labelledby="menu-heading">
        <h2 id="menu-heading" className="t-h3">Menu <span className="text-base font-normal text-muted">({r.menuItems.length} dishes)</span></h2>
        <div className="mt-6"><MenuSection restaurant={r} /></div>
      </section>

      <section className="container-x mt-16" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="t-h3">Ratings &amp; reviews</h2>
        <div className="mt-6"><Reviews restaurant={r} /></div>
      </section>

      {r.related.length > 0 && (
        <section className="container-x mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="t-h3">More {r.category.name} <span className="accent-italic text-brand-500 dark:text-brand-300">restaurants</span></h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {r.related.map((x) => <RestaurantCard key={x.id} restaurant={x} />)}
          </div>
        </section>
      )}
    </article>
  );
}
