import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import Skeleton from "../../components/ui/Skeleton.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import { useCategories } from "../../hooks/useQueries.js";
import { thumb } from "../../lib/utils.js";

export default function Cuisines() {
  const { data, isLoading } = useCategories();
  return (
    <section className="container-x section-y">
      <SectionHeading tag="Cuisines" title="Explore Food by" accent="Cuisine" description="Eight cuisines, cooked by specialist kitchens. Pick a mood and we'll show you who does it best." />
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
          : data?.data?.map((c) => (
              <Link key={c.id} to={`/explore?category=${c.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-ui)]">
                <img src={thumb(c.image)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white">
                  <div>
                    <h3 className="t-h4">{c.name}</h3>
                    <p className="text-sm text-white/70">{c.restaurantCount} restaurants</p>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-ui)] bg-white/15 backdrop-blur transition-colors group-hover:bg-brand-500"><ArrowUpRight className="h-4 w-4" /></span>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
