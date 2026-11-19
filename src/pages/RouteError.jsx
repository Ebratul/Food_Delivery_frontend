import { isRouteErrorResponse, useRouteError } from "react-router";

// Rendered when a route throws (e.g. a lazy chunk fails to load after a new deploy).
export default function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-6xl font-bold text-brand-500">{notFound ? "404" : "Oops"}</p>
      <h1 className="t-h3">{notFound ? "Page not found" : "Something went wrong"}</h1>
      <p className="max-w-md text-muted">{notFound ? "The page you're looking for doesn't exist." : "Please refresh the page. If the problem continues, try again in a few minutes."}</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => window.location.reload()} className="h-11 rounded-[var(--radius-ui)] bg-brand-500 px-6 text-sm font-medium text-white hover:bg-brand-600">Reload</button>
        <a href="/" className="inline-flex h-11 items-center rounded-[var(--radius-ui)] border border-[var(--border)] px-6 text-sm font-medium">Go home</a>
      </div>
    </div>
  );
}
