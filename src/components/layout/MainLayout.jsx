import { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import PageLoader from "./PageLoader.jsx";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[var(--radius-ui)] focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
