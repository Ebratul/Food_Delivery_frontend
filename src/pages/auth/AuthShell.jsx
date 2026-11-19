import { Link } from "react-router";
import Logo from "../../components/layout/Logo.jsx";
import { thumb } from "../../lib/utils.js";

const IMG = "https://www.themealdb.com/images/media/meals/xrttsx1487339558.jpg";

export default function AuthShell({ title, accent, subtitle, children, footer }) {
  return (
    <div className="container-x grid min-h-[calc(100vh-72px)] gap-8 py-8 lg:grid-cols-2 lg:py-12">
      <div className="dot-grid relative hidden overflow-hidden rounded-[var(--radius-section)] bg-[radial-gradient(110%_90%_at_50%_0%,#4b22b8_0%,#1d0d52_50%,#0a0a0a_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo light />
        <div>
          <img src={thumb(IMG)} alt="Lamb biryani served in a bowl" className="mb-8 aspect-[4/3] w-full max-w-md rounded-[var(--radius-ui)] object-cover shadow-2xl" />
          <p className="font-display text-3xl font-bold leading-tight">Your favourite local kitchens, <span className="accent-italic text-brand-300">one tap</span> away.</p>
          <p className="mt-4 text-white/60">Order, track and review, or list your own restaurant from the same account.</p>
        </div>
        <p className="text-sm text-white/40">Need help? <Link to="/help" className="underline hover:text-white">Visit the help center</Link></p>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="t-h2">{title} <span className="accent-italic text-brand-500 dark:text-brand-300">{accent}</span></h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        </div>
      </div>
    </div>
  );
}
