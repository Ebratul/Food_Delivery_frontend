import { Bike, Search, ShoppingBag, Utensils } from "lucide-react";
import SectionHeading from "../../components/ui/SectionHeading.jsx";

const STEPS = [
  { icon: Search, title: "Find your craving", text: "Search by dish or cuisine, then filter by rating, price, delivery time and vegan options." },
  { icon: ShoppingBag, title: "Build your order", text: "Add dishes from one kitchen to your cart. Prices are confirmed by the restaurant's live menu." },
  { icon: Utensils, title: "Kitchen gets cooking", text: "The restaurant confirms in minutes and cooks fresh. Crispy items are made last so they stay crunchy." },
  { icon: Bike, title: "Track to your door", text: "Follow every step from Confirmed to Delivered in your dashboard and pay how you prefer." },
];

export default function HowItWorks() {
  return (
    <section className="container-x">
      <div className="dot-grid rounded-[var(--radius-section)] bg-ink px-6 py-16 text-white sm:px-12 lg:py-24">
        <SectionHeading dark align="center" tag="How it works" title="From Craving to Doorstep in" accent="4 Steps" description="A simple flow built around speed and food quality." />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-[var(--radius-ui)] border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-brand-400/50">
              <span className="absolute right-6 top-6 font-display text-5xl font-bold text-white/10">0{i + 1}</span>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-ui)] bg-brand-500"><s.icon className="h-6 w-6" /></span>
              <h3 className="t-h4 mt-6">{s.title}</h3>
              <p className="mt-2 text-white/60">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
