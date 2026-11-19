import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";
import Skeleton from "../../components/ui/Skeleton.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import { get } from "../../lib/api.js";
import { formatPrice, thumb } from "../../lib/utils.js";

export default function PopularDishes() {
  const { data, isLoading } = useQuery({ queryKey: ["dishes", "popular", 8], queryFn: () => get("/menu-items/popular", { limit: 8 }) });
  return (
    <section className="container-x section-y pt-0">
      <SectionHeading tag="Most ordered" title="Dishes Everyone Is" accent="Ordering" description="The most-ordered dishes across FoodDash this season. Tap one to see the full menu." />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-6">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-28" />)
          : data?.data?.map((d) => (
              <Link key={d.id} to={`/restaurants/${d.restaurant.slug}`} className="surface group flex gap-4 rounded-[var(--radius-ui)] p-3 transition-colors hover:border-brand-300">
                <img src={thumb(d.image, "small")} alt="" loading="lazy" className="h-24 w-24 shrink-0 rounded-[var(--radius-ui)] object-cover" />
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-bold leading-6 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-300">{d.name}</h3>
                    <span className="shrink-0 font-semibold">{formatPrice(d.price)}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">{d.description}</p>
                  <p className="mt-2 flex items-center gap-1 text-sm text-accent-600 dark:text-accent-400"><Flame className="h-4 w-4" /> {d.restaurant.name} · {d.restaurant.category.name}</p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
