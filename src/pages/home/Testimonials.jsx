import { useRef } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Avatar from "../../components/ui/Avatar.jsx";
import { Stars } from "../../components/ui/Rating.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { get } from "../../lib/api.js";
import { formatDate } from "../../lib/utils.js";

export default function Testimonials() {
  const { data, isLoading } = useQuery({ queryKey: ["reviews", "top"], queryFn: () => get("/reviews/top") });
  const track = useRef(null);
  const scroll = (dir) => track.current?.scrollBy({ left: dir * (track.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <section className="bg-brand-50 dark:bg-brand-500/[0.06]">
      <div className="container-x section-y">
        <SectionHeading
          tag="Reviews" title="Real Orders," accent="Real Opinions"
          description="Recent five-star reviews written by FoodDash customers after their orders were delivered."
          action={
            <div className="flex gap-2">
              <button type="button" onClick={() => scroll(-1)} className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-ui)] border border-ui bg-[var(--surface)] hover:border-brand-400" aria-label="Previous reviews"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => scroll(1)} className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-ui)] bg-brand-500 text-white hover:bg-brand-600" aria-label="Next reviews"><ChevronRight className="h-5 w-5" /></button>
            </div>
          }
        />
        <div ref={track} className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
          {isLoading
            ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-64 w-[85%] shrink-0 sm:w-[48%] lg:w-[32%]" />)
            : data?.data?.map((r) => (
                <figure key={r.id} className="surface flex w-[85%] shrink-0 snap-start flex-col rounded-[var(--radius-ui)] p-6 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <Quote className="h-8 w-8 text-brand-300" aria-hidden="true" />
                  <Stars value={r.rating} className="mt-4" />
                  <blockquote className="mt-4 flex-1 text-lg leading-7">“{r.comment}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-ui pt-4">
                    <Avatar user={r.user} />
                    <div className="min-w-0">
                      <p className="font-semibold">{r.user.name}</p>
                      <p className="truncate text-sm text-muted">
                        Ordered from <Link to={`/restaurants/${r.restaurant.slug}`} className="text-brand-600 hover:underline dark:text-brand-300">{r.restaurant.name}</Link> · {formatDate(r.createdAt, { month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
        </div>
      </div>
    </section>
  );
}
