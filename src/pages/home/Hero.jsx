import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Search, Star } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { usePublicStats } from "../../hooks/useQueries.js";
import { formatNumber } from "../../lib/utils.js";

const WORDS = ["Biryani", "Ramen", "Pho", "Kebabs", "Pad Thai", "Pasta"];

export default function Hero() {
  const navigate = useNavigate();
  const { data } = usePublicStats();
  const stats = data?.data;
  const [word, setWord] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/explore?search=${encodeURIComponent(query.trim())}` : "/explore");
  };

  return (
    <section className="relative">
      <div className="dot-grid relative flex min-h-[560px] items-center overflow-hidden rounded-b-[var(--radius-section)] bg-[radial-gradient(110%_90%_at_50%_0%,#4b22b8_0%,#1d0d52_45%,#0a0a0a_100%)] text-white lg:h-[68vh] lg:max-h-[760px]">
        <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" aria-hidden="true" />
        <div className="container-x relative flex flex-col items-center py-16 text-center">
          <div className="flex items-center gap-2 text-sm text-white/80 animate-fade-up">
            <span className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />)}</span>
            <span><b className="text-white">{stats?.averageRating ?? "4.5"}</b> from {formatNumber(stats?.reviews ?? 100)}+ verified reviews</span>
          </div>
          <p className="mt-4 font-display text-lg font-bold text-white/90 sm:text-xl">Bangladesh&apos;s neighbourhood food delivery</p>
          <h1 className="t-display mt-4 max-w-5xl">
            <span className="sr-only">Local food delivered fresh</span>
            <span aria-hidden="true">
              Your Favourite{" "}
              <span key={word} className="accent-italic inline-block animate-fade-up text-accent-400">{WORDS[word]}</span>
              <br />
              Delivered <span className="accent-italic">Fresh</span>
            </span>
          </h1>
          <p className="mt-6 inline-flex rounded-[var(--radius-ui)] border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
            {stats ? `${stats.restaurants} restaurants · ${formatNumber(stats.dishes)} dishes · ${stats.cities.join(", ")}` : "Restaurants across Dhaka, Chattogram and Sylhet"}
          </p>

          <form onSubmit={onSearch} className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row" role="search">
            <label htmlFor="hero-search" className="sr-only">Search restaurants or dishes</label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
              <input id="hero-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search biryani, sushi, kebab…"
                className="h-14 w-full rounded-[var(--radius-ui)] border border-white/15 bg-white/10 pl-12 pr-4 text-white placeholder:text-white/50 backdrop-blur focus:border-brand-300 focus:outline-none" />
            </div>
            <Button type="submit" size="lg">Find food <ArrowRight className="h-5 w-5" /></Button>
          </form>
          <Button to="/dashboard/restaurants/new" variant="ghost" className="mt-4 text-white/80 hover:bg-white/10 hover:text-white">Own a restaurant? List it free →</Button>
        </div>
      </div>
    </section>
  );
}
