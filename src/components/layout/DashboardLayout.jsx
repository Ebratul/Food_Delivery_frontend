import { Suspense, useState } from "react";
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router";
import {
  ArrowLeft, ClipboardList, FolderTree, LayoutDashboard, LogOut, Mail, Menu, MessageSquareText, Package, PlusCircle, Settings, Store, Users, X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { cn } from "../../lib/utils.js";
import Avatar from "../ui/Avatar.jsx";
import Logo from "./Logo.jsx";
import { ThemeToggle } from "./Navbar.jsx";
import PageLoader from "./PageLoader.jsx";

const USER_NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/orders", label: "My Orders", icon: Package },
  { to: "/dashboard/restaurants", label: "My Restaurants", icon: Store, end: true },
  { to: "/dashboard/restaurants/new", label: "Add Restaurant", icon: PlusCircle },
  { to: "/dashboard/reviews", label: "My Reviews", icon: MessageSquareText },
  { to: "/dashboard/profile", label: "Profile & Settings", icon: Settings },
];

const ADMIN_NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { to: "/dashboard/admin/restaurants", label: "Manage Restaurants", icon: Store },
  { to: "/dashboard/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/dashboard/admin/categories", label: "Cuisines", icon: FolderTree },
  { to: "/dashboard/admin/messages", label: "Messages", icon: Mail },
  { to: "/dashboard/restaurants/new", label: "Add Restaurant", icon: PlusCircle },
  { to: "/dashboard/profile", label: "Profile & Settings", icon: Settings },
];

function Sidebar({ onNavigate }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const items = isAdmin ? ADMIN_NAV : USER_NAV;
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center px-6"><Logo /></div>
      <div className="px-4">
        <div className="surface flex items-center gap-3 rounded-[var(--radius-ui)] p-3">
          <Avatar user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted">{isAdmin ? "Administrator" : "Member"}</p>
          </div>
        </div>
      </div>
      <nav className="mt-6 flex-1 overflow-y-auto px-4" aria-label="Dashboard">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted">{isAdmin ? "Admin" : "Menu"}</p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} onClick={onNavigate}
                className={({ isActive }) => cn("flex items-center gap-3 rounded-[var(--radius-ui)] px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-brand-500 text-white" : "text-[var(--text)]/80 hover:bg-[var(--surface-2)] hover:text-[var(--text)]")}>
                <item.icon className="h-5 w-5" /> {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-ui p-4">
        <Link to="/" className="flex items-center gap-3 rounded-[var(--radius-ui)] px-3 py-2.5 text-sm text-muted hover:bg-[var(--surface-2)]"><ArrowLeft className="h-5 w-5" /> Back to site</Link>
        <button type="button" onClick={() => { logout(); navigate("/"); }} className="flex w-full items-center gap-3 rounded-[var(--radius-ui)] px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
          <LogOut className="h-5 w-5" /> Log out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  // close the drawer whenever the route changes (state adjusted during render, no effect needed)
  const [path, setPath] = useState(location.pathname);
  if (path !== location.pathname) { setPath(location.pathname); setOpen(false); }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-ui bg-[var(--surface)] lg:block"><Sidebar /></aside>

      {/* mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
        <div className={cn("absolute inset-0 bg-ink/50 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <aside className={cn("absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-[var(--surface)] shadow-xl transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
          <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-[var(--radius-ui)] p-2 hover:bg-[var(--surface-2)]" aria-label="Close menu"><X className="h-5 w-5" /></button>
          <Sidebar onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between gap-4 border-b border-ui bg-[var(--bg)]/85 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setOpen(true)} className="rounded-[var(--radius-ui)] p-2 hover:bg-[var(--surface-2)] lg:hidden" aria-label="Open dashboard menu" aria-expanded={open}><Menu className="h-6 w-6" /></button>
            <span className="lg:hidden"><Logo /></span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/explore" className="hidden text-sm text-muted hover:text-[var(--text)] sm:inline">Order food</Link>
            <ThemeToggle />
          </div>
        </header>
        <main id="main" className="flex-1 px-4 py-8 sm:px-8 lg:py-10">
          <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
        </main>
      </div>
      <ScrollRestoration />
    </div>
  );
}
