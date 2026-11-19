import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../lib/api.js";
import { formatPrice, thumb } from "../../lib/utils.js";

/** Auto-scrolling strip of popular dishes (pauses on hover/focus). */
export default function DishMarquee() {
  const { data } = useQuery({ queryKey: ["dishes", "popular", 12], queryFn: () => get("/menu-items/popular", { limit: 12 }) });
  const dishes = data?.data ?? [];
  if (!dishes.length) return <div className="h-[232px]" aria-hidden="true" />;
  const loop = [...dishes, ...dishes];
  return (
    <section aria-label="Popular dishes right now" className="group relative -mt-12 overflow-hidden py-4">
      <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        {loop.map((d, i) => (
          <Link key={`${d.id}-${i}`} to={`/restaurants/${d.restaurant.slug}`} tabIndex={i >= dishes.length ? -1 : 0} aria-hidden={i >= dishes.length || undefined}
            className="relative h-[200px] w-[280px] shrink-0 overflow-hidden rounded-[var(--radius-ui)] shadow-lg sm:w-[320px]">
            <img src={thumb(d.image)} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-white">
              <p className="line-clamp-1 font-display font-bold">{d.name}</p>
              <p className="text-sm text-white/70">{d.restaurant.name} · {formatPrice(d.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
