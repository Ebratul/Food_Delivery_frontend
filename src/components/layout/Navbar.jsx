import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import {
  ChevronDown, LayoutDashboard, LogOut, Menu, Moon, Package, ShoppingBag, Sun, User, UtensilsCrossed, X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useCart } from "../../hooks/useCart.js";
import { useCategories } from "../../hooks/useQueries.js";
import { useTheme } from "../../hooks/useTheme.js";
import { cn, thumb } from "../../lib/utils.js";
import Avatar from "../ui/Avatar.jsx";
import Button from "../ui/Button.jsx";
import Dropdown, { DropdownItem } from "../ui/Dropdown.jsx";
import Logo from "./Logo.jsx";

const PUBLIC_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore", mega: true },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const PRIVATE_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore", mega: true },
  { to: "/blog", label: "Blog" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/orders", label: "My Orders" },
];

const linkClass = ({ isActive }) =>
  cn("rounded-[var(--radius-ui)] px-3 py-2 text-[15px] transition-colors", isActive ? "text-brand-600 dark:text-brand-300" : "text-[var(--text)]/80 hover:text-[var(--text)]");

/** Mega menu: cuisines loaded from the API. */
function ExploreMenu() {
  const { data } = useCategories();
  return (
    <Dropdown
      align="left"
      panelClassName="w-[min(640px,90vw)] p-4"
      trigger={(open, props) => (
        <button type="button" {...props} className="inline-flex items-center gap-1 rounded-[var(--radius-ui)] px-3 py-2 text-[15px] text-[var(--text)]/80 hover:text-[var(--text)]">
          Explore <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) => (
        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div>
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted">Browse by cuisine</p>
            <div className="grid grid-cols-2 gap-1">
              {data?.data?.map((c) => (
                <DropdownItem key={c.id} as={Link} to={`/explore?category=${c.slug}`} onClick={close} className="py-2">
                  <img src={thumb(c.image, "small")} alt="" className="h-9 w-9 rounded-[var(--radius-ui)] object-cover" loading="lazy" />
                  <span><span className="block font-medium">{c.name}</span><span className="text-xs text-muted">{c.restaurantCount} restaurants</span></span>
                </DropdownItem>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[var(--radius-ui)] bg-ink p-4 text-white">
            <div>
              <p className="font-display text-lg font-bold">Hungry for <span className="accent-italic text-brand-300">more?</span></p>
              <p className="mt-2 text-sm text-white/60">Filter by rating, price, delivery time and vegan options.</p>
            </div>
            <Button to="/explore" size="sm" className="mt-4" onClick={close}>All restaurants</Button>
          </div>
        </div>
      )}
    </Dropdown>
  );
}

function ProfileMenu() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  return (
    <Dropdown
      trigger={(open, props) => (
        <button type="button" {...props} className="flex items-center gap-2 rounded-[var(--radius-ui)] p-1 pr-2 hover:bg-[var(--surface-2)]" aria-label="Open profile menu">
          <Avatar user={user} size="h-9 w-9" />
          <ChevronDown className={cn("hidden h-4 w-4 transition-transform sm:block", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="mb-2 border-b border-ui px-3 pb-3 pt-1">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
            {isAdmin && <span className="mt-1 inline-block text-xs font-medium text-brand-600 dark:text-brand-300">Administrator</span>}
          </div>
          <DropdownItem as={Link} to="/dashboard" icon={LayoutDashboard} onClick={close}>Dashboard</DropdownItem>
          <DropdownItem as={Link} to="/dashboard/orders" icon={Package} onClick={close}>My orders</DropdownItem>
          <DropdownItem as={Link} to="/dashboard/restaurants" icon={UtensilsCrossed} onClick={close}>My restaurants</DropdownItem>
          <DropdownItem as={Link} to="/dashboard/profile" icon={User} onClick={close}>Profile &amp; settings</DropdownItem>
          <div className="my-2 border-t border-ui" />
          <DropdownItem icon={LogOut} onClick={() => { close(); logout(); navigate("/"); }} className="text-red-600 dark:text-red-400">Log out</DropdownItem>
        </>
      )}
    </Dropdown>
  );
}

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme} className={cn("inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-ui)] hover:bg-[var(--surface-2)]", className)}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

function CartButton() {
  const { count } = useCart();
  return (
    <Link to="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-ui)] hover:bg-[var(--surface-2)]" aria-label={`Cart, ${count} items`}>
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[11px] font-semibold text-white">{count}</span>}
    </Link>
  );
}

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const links = isAuthenticated ? PRIVATE_LINKS : PUBLIC_LINKS;

  // close the mobile menu whenever the route changes
  const [routeKey, setRouteKey] = useState(location.key);
  if (routeKey !== location.key) { setRouteKey(location.key); setOpen(false); }
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b transition-colors duration-300",
      scrolled ? "border-ui bg-[var(--bg)]/85 backdrop-blur-xl" : "border-transparent bg-[var(--bg)]")}>
      <nav className="container-x flex h-[72px] items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>{l.mega ? <ExploreMenu /> : <NavLink to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>}</li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <CartButton />
          {isAuthenticated ? (
            <div className="hidden lg:block"><ProfileMenu /></div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Button to="/login" variant="ghost" size="sm">Log in</Button>
              <Button to="/register" size="sm">Sign up</Button>
            </div>
          )}
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-ui)] hover:bg-[var(--surface-2)] lg:hidden"
            onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <div id="mobile-menu" className={cn("fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-[var(--bg)] transition-[opacity,visibility] duration-200 lg:hidden", open ? "visible opacity-100" : "invisible opacity-0")}>
        <div className="container-x flex flex-col gap-2 py-6">
          {isAuthenticated && (
            <div className="surface mb-2 flex items-center gap-3 rounded-[var(--radius-ui)] p-4">
              <Avatar user={user} />
              <div className="min-w-0"><p className="truncate font-semibold">{user.name}</p><p className="truncate text-sm text-muted">{user.email}</p></div>
            </div>
          )}
          {[...links, ...(isAuthenticated ? [{ to: "/dashboard/profile", label: "Profile" }, { to: "/about", label: "About" }, { to: "/contact", label: "Contact" }] : [])].map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => cn("rounded-[var(--radius-ui)] px-4 py-3 font-display text-xl font-bold", isActive ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200" : "hover:bg-[var(--surface-2)]")}>
              {l.label}
            </NavLink>
          ))}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {isAuthenticated ? (
              <Button variant="outline" className="col-span-2" onClick={() => logout()}><LogOut className="h-4 w-4" /> Log out</Button>
            ) : (
              <><Button to="/login" variant="outline">Log in</Button><Button to="/register">Sign up</Button></>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
