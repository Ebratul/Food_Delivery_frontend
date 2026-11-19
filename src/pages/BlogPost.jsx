import { Fragment } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import PostCard from "../components/blog/PostCard.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { get } from "../lib/api.js";
import { formatDate, imageSrc } from "../lib/utils.js";

/** Renders article content: paragraphs separated by blank lines, "## " for subheadings. */
function ArticleBody({ content }) {
  return (
    <div className="prose-fd">
      {content.split(/\n\s*\n/).map((block, i) => {
        const lines = block.trim().split("\n");
        return (
          <Fragment key={i}>
            {lines.map((line, j) => (line.startsWith("## ")
              ? <h2 key={j}>{line.slice(3)}</h2>
              : <p key={j}>{line}</p>))}
          </Fragment>
        );
      })}
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({ queryKey: ["post", slug], queryFn: () => get(`/blog/${slug}`) });
  const post = data?.data;
  useDocumentTitle(post?.title ?? "Article");

  if (isLoading) return <div className="container-x max-w-3xl py-12"><Skeleton className="h-10 w-3/4" /><Skeleton className="mt-6 aspect-[16/9]" /><Skeleton className="mt-6 h-64" /></div>;
  if (isError || !post) return <div className="container-x section-y"><EmptyState icon={FileText} title="Article not found" action={<Button to="/blog">Back to the blog</Button>} /></div>;

  return (
    <article className="pb-16 lg:pb-24">
      <header className="container-x max-w-4xl pt-8 text-center">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted hover:text-[var(--text)]"><ArrowLeft className="h-4 w-4" /> All articles</Link>
        <div className="mt-6 flex flex-wrap justify-center gap-2">{post.tags.map((t) => <Badge key={t} tone="brand">{t}</Badge>)}</div>
        <h1 className="t-h2 mt-4">{post.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{post.excerpt}</p>
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted">
          <Avatar user={post.author} size="h-9 w-9" />
          <span><b className="text-[var(--text)]">{post.author.name}</b> · {formatDate(post.publishedAt)} · <Clock className="inline h-3.5 w-3.5" /> {post.readMinutes} min read</span>
        </div>
      </header>
      <div className="container-x mt-10 max-w-5xl">
        <img src={imageSrc(post.coverImage)} alt="" className="aspect-[16/8] w-full rounded-[var(--radius-section)] object-cover" />
      </div>
      <div className="container-x mt-12 max-w-3xl text-lg"><ArticleBody content={post.content} /></div>
      {post.related.length > 0 && (
        <section className="container-x mt-16">
          <h2 className="t-h3">Keep <span className="accent-italic text-brand-500 dark:text-brand-300">reading</span></h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">{post.related.map((p) => <PostCard key={p.id} post={p} />)}</div>
        </section>
      )}
    </article>
  );
}
