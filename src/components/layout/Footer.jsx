import { Link } from "react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo.jsx";

// lucide no longer ships brand logos, so the social icons are inline SVGs
const Social = {
  Facebook: <path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.4V11H7v4h3v9h4v-9h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z" />,
  Instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" /></>,
  LinkedIn: <path d="M4 9h4v12H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm4 6h4v1.7c.6-1 1.9-2 3.9-2 4 0 4.1 2.7 4.1 6V21h-4v-5.6c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21h-3.7z" />,
  YouTube: <path d="M22 8.2s-.2-1.6-.9-2.3c-.8-.9-1.8-.9-2.2-1C15.8 4.7 12 4.7 12 4.7s-3.8 0-6.9.2c-.4.1-1.4.1-2.2 1-.7.7-.9 2.3-.9 2.3S1.8 10 1.8 11.9v1.7c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.1.2 7.1.2s3.8 0 6.9-.2c.4-.1 1.4-.1 2.2-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-1.7C22.2 10 22 8.2 22 8.2ZM10 15.3V8.7l5.6 3.3Z" />,
};

const SOCIAL_LINKS = [
  ["Facebook", "https://www.facebook.com/"],
  ["Instagram", "https://www.instagram.com/"],
  ["LinkedIn", "https://www.linkedin.com/"],
  ["YouTube", "https://www.youtube.com/"],
];

const COLUMNS = [
  { title: "Discover", links: [["Explore restaurants", "/explore"], ["Indian cuisine", "/explore?category=indian"], ["Top rated", "/explore?sort=rating:desc&minRating=4.5"], ["Vegan friendly", "/explore?vegan=true"]] },
  { title: "Company", links: [["About us", "/about"], ["Blog", "/blog"], ["Contact", "/contact"], ["Become a partner", "/dashboard/restaurants/new"]] },
  { title: "Support", links: [["Help center", "/help"], ["Privacy policy", "/privacy"], ["Terms & conditions", "/terms"], ["Track an order", "/dashboard/orders"]] },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:py-24">
        <div className="max-w-sm">
          <Logo light />
          <p className="mt-4 text-white/60">Meals from the best local kitchens in Dhaka, Chattogram and Sylhet, delivered hot and tracked live.</p>
          <ul className="mt-6 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" /> Level 5, House 42, Road 11, Banani, Dhaka 1213</li>
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-brand-300" /><a href="tel:+8809612345678" className="hover:text-white">+880 9612-345678</a></li>
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-brand-300" /><a href="mailto:support@fooddash.app" className="hover:text-white">support@fooddash.app</a></li>
          </ul>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-lg font-bold">{col.title}</h3>
            <ul className="mt-4 space-y-3 text-white/60">
              {col.links.map(([label, to]) => <li key={to}><Link to={to} className="transition-colors hover:text-white">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} FoodDash. All rights reserved.</p>
          <ul className="flex gap-2">
            {SOCIAL_LINKS.map(([name, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`FoodDash on ${name}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-ui)] border border-white/10 text-white/70 transition-colors hover:border-brand-400 hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">{Social[name]}</svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
