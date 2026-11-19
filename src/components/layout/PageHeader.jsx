import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

/** Dark rounded banner used at the top of inner pages. */
export default function PageHeader({ title, accent, description, crumbs = [] }) {
  return (
    <section className="container-x pt-4">
      <div className="dot-grid relative overflow-hidden rounded-[var(--radius-section)] bg-[radial-gradient(120%_120%_at_50%_0%,#3b1d8f_0%,#160a3a_45%,#0a0a0a_100%)] px-6 py-16 text-center text-white sm:px-12 lg:py-24">
        <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-white/60">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1"><ChevronRight className="h-4 w-4" />{c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span aria-current="page" className="text-white">{c.label}</span>}</li>
            ))}
          </ol>
        </nav>
        <h1 className="t-display mx-auto max-w-4xl">{title} {accent && <span className="accent-italic text-brand-300">{accent}</span>}</h1>
        {description && <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">{description}</p>}
      </div>
    </section>
  );
}
