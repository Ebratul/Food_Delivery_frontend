import { ArrowRight } from "lucide-react";
import { RestaurantGrid } from "../../components/restaurant/RestaurantCard.jsx";
import Button from "../../components/ui/Button.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import { useRestaurants } from "../../hooks/useQueries.js";

export default function FeaturedRestaurants() {
  const { data, isLoading } = useRestaurants({ featured: "true", sort: "rating:desc", limit: 8 });
  return (
    <section className="container-x section-y pt-0">
      <SectionHeading
        tag="Featured" title="Kitchens Our Customers" accent="Love Most"
        description="Hand-picked partners with consistently high ratings, reliable delivery times and menus that travel well."
        action={<Button to="/explore" variant="outline" className="shrink-0">View all restaurants <ArrowRight className="h-4 w-4" /></Button>}
      />
      <div className="mt-12"><RestaurantGrid restaurants={data?.data} loading={isLoading} count={8} /></div>
    </section>
  );
}
