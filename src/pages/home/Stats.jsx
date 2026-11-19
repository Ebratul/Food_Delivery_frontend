import SectionHeading from "../../components/ui/SectionHeading.jsx";
import { useCountUp } from "../../hooks/useCountUp.js";
import { usePublicStats } from "../../hooks/useQueries.js";
import { formatNumber } from "../../lib/utils.js";

function Stat({ value, label, decimals = 0, suffix = "" }) {
  const [ref, current] = useCountUp(value);
  return (
    <div ref={ref} className="surface rounded-[var(--radius-ui)] p-6 text-center lg:p-8">
      <p className="font-display text-4xl font-bold text-brand-600 dark:text-brand-300 lg:text-5xl">
        {decimals ? current.toFixed(decimals) : formatNumber(Math.round(current))}{suffix}
      </p>
      <p className="mt-2 text-muted">{label}</p>
    </div>
  );
}

export default function Stats() {
  const { data } = usePublicStats();
  const s = data?.data;
  return (
    <section className="container-x section-y">
      <SectionHeading align="center" tag="FoodDash in numbers" title="Growing With Every" accent="Order" description="Live figures straight from our platform, updated with every order and review." />
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        <Stat value={s?.restaurants ?? 0} label="Partner restaurants" />
        <Stat value={s?.ordersDelivered ?? 0} label="Orders delivered" suffix="+" />
        <Stat value={s?.dishes ?? 0} label="Dishes on the menu" />
        <Stat value={s?.averageRating ?? 0} decimals={1} label={`Average rating (${s?.reviews ?? 0} reviews)`} suffix="★" />
      </div>
    </section>
  );
}
