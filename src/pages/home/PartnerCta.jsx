import { CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { thumb } from "../../lib/utils.js";

const POINTS = ["List your restaurant in under 10 minutes", "Manage menus, photos and prices yourself", "Track orders and revenue on your dashboard"];
const IMG = "https://www.themealdb.com/images/media/meals/xrttsx1487339558.jpg";

export default function PartnerCta() {
  return (
    <section className="container-x section-y">
      <div className="grid overflow-hidden rounded-[var(--radius-section)] bg-gradient-to-br from-brand-600 to-brand-900 text-white lg:grid-cols-2">
        <div className="p-8 sm:p-12 lg:p-16">
          <span className="inline-flex rounded-[var(--radius-ui)] border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">For restaurants</span>
          <h2 className="t-h2 mt-4">Grow Your Kitchen With <span className="accent-italic text-accent-300">FoodDash</span></h2>
          <p className="mt-4 text-lg text-white/75">Reach hungry customers across your city without building your own delivery fleet. Submit your listing and our team reviews it within one working day.</p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((p) => <li key={p} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-success-400" />{p}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/dashboard/restaurants/new" variant="light" size="lg">List your restaurant</Button>
            <Button to="/blog/taking-your-restaurant-online-a-partner-checklist" variant="ghost" size="lg" className="text-white hover:bg-white/10">Read the partner guide</Button>
          </div>
        </div>
        <div className="relative min-h-72">
          <img src={thumb(IMG, "large")} alt="Biryani served in a restaurant kitchen" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
