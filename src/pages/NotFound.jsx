import Button from "../components/ui/Button.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

export default function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <section className="container-x section-y flex flex-col items-center text-center">
      <p className="font-display text-8xl font-bold text-brand-500">404</p>
      <h1 className="t-h2 mt-4">This plate is <span className="accent-italic text-accent-500">empty</span></h1>
      <p className="mt-4 max-w-md text-muted">The page you are looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex gap-3"><Button to="/">Go home</Button><Button to="/explore" variant="outline">Explore restaurants</Button></div>
    </section>
  );
}
