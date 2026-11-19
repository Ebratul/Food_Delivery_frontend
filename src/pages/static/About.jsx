import { HeartHandshake, Leaf, ShieldCheck, Timer } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { usePublicStats } from "../../hooks/useQueries.js";
import { formatNumber, thumb } from "../../lib/utils.js";

const VALUES = [
  { icon: Timer, title: "Honest delivery times", text: "Every restaurant shows a realistic delivery window, and we would rather arrive early than promise too much." },
  { icon: ShieldCheck, title: "Safety first", text: "Every partner is reviewed before going live, and riders follow temperature and hygiene standards on each order." },
  { icon: HeartHandshake, title: "Fair for partners", text: "Restaurants control their own menus, photos and prices from a dashboard built for small kitchens." },
  { icon: Leaf, title: "Better choices", text: "Vegan filters, clear ingredients and lighter options help you eat well even on busy days." },
];

export default function About() {
  useDocumentTitle("About us");
  const { data } = usePublicStats();
  const s = data?.data;
  return (
    <>
      <PageHeader title="Food That Feels Like" accent="Home" description="FoodDash connects neighbourhood kitchens with the people who love them, one delivery at a time." crumbs={[{ label: "About" }]} />
      <section className="container-x section-y grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading tag="Our story" title="Built for Local" accent="Kitchens" />
          <div className="mt-6 space-y-4 text-lg leading-8 text-muted">
            <p>FoodDash started with a simple frustration: the best biryani in the neighbourhood had no way to reach customers beyond walking distance, and ordering by phone meant guessing prices and waiting without updates.</p>
            <p>Today the platform lists {s ? formatNumber(s.restaurants) : "dozens of"} restaurants across {s ? s.cities.join(", ") : "three cities"}, with live menus, transparent fees and order tracking from kitchen to doorstep.</p>
            <p>Restaurants list themselves for free, manage their own menus and see their orders and revenue in one dashboard. Our team reviews every new listing to keep quality high.</p>
          </div>
          <Button to="/explore" size="lg" className="mt-8">Start exploring</Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={thumb("https://www.themealdb.com/images/media/meals/xrttsx1487339558.jpg")} alt="Lamb biryani" className="aspect-[3/4] w-full rounded-[var(--radius-ui)] object-cover" loading="lazy" />
          <img src={thumb("https://www.themealdb.com/images/media/meals/uwxusv1487344500.jpg")} alt="Tandoori chicken" className="mt-12 aspect-[3/4] w-full rounded-[var(--radius-ui)] object-cover" loading="lazy" />
        </div>
      </section>
      <section className="container-x pb-16 lg:pb-24">
        <div className="dot-grid rounded-[var(--radius-section)] bg-ink px-6 py-16 text-white sm:px-12 lg:py-24">
          <SectionHeading dark align="center" tag="What we value" title="Principles Behind Every" accent="Order" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-[var(--radius-ui)] border border-white/10 bg-white/[0.04] p-6">
                <v.icon className="h-8 w-8 text-brand-300" />
                <h3 className="t-h4 mt-4">{v.title}</h3>
                <p className="mt-2 text-white/60">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
