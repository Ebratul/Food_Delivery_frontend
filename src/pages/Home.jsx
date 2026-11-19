import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import BlogPreview from "./home/BlogPreview.jsx";
import Cuisines from "./home/Cuisines.jsx";
import DishMarquee from "./home/DishMarquee.jsx";
import Faq from "./home/Faq.jsx";
import FeaturedRestaurants from "./home/FeaturedRestaurants.jsx";
import Hero from "./home/Hero.jsx";
import HowItWorks from "./home/HowItWorks.jsx";
import Newsletter from "./home/Newsletter.jsx";
import PartnerCta from "./home/PartnerCta.jsx";
import PopularDishes from "./home/PopularDishes.jsx";
import Stats from "./home/Stats.jsx";
import Testimonials from "./home/Testimonials.jsx";

export default function Home() {
  useDocumentTitle();
  return (
    <>
      <Hero />
      <DishMarquee />
      <Cuisines />
      <FeaturedRestaurants />
      <HowItWorks />
      <Stats />
      <PopularDishes />
      <Testimonials />
      <PartnerCta />
      <BlogPreview />
      <Faq />
      <Newsletter />
    </>
  );
}
