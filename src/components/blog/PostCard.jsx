import { Link } from "react-router";
import { Clock } from "lucide-react";
import { formatDate, thumb } from "../../lib/utils.js";
import Badge from "../ui/Badge.jsx";

export default function PostCard({ post }) {
  return (
    <article className="surface group flex h-full flex-col overflow-hidden rounded-[var(--radius-ui)]">
      <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <img src={thumb(post.coverImage)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Badge tone="brand">{post.tags?.[0]}</Badge>
          <span>{formatDate(post.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readMinutes} min read</span>
        </div>
        <h3 className="t-h4 mt-4 line-clamp-2"><Link to={`/blog/${post.slug}`} className="hover:text-brand-600 dark:hover:text-brand-300">{post.title}</Link></h3>
        <p className="mt-2 line-clamp-3 flex-1 text-muted">{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="mt-4 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300" aria-label={`Read ${post.title}`}>Read article →</Link>
      </div>
    </article>
  );
}
