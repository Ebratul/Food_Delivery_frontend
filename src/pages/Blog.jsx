import { useState } from "react";
import { FileText } from "lucide-react";
import PostCard from "../components/blog/PostCard.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { usePaged } from "../hooks/useQueries.js";
import { cn } from "../lib/utils.js";

export default function Blog() {
  useDocumentTitle("Blog");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaged(["blog"], "/blog", { page, limit: 6, ...(tag && { tag }) });
  const tags = data?.meta?.tags ?? [];

  return (
    <>
      <PageHeader title="The FoodDash" accent="Journal" description="Cuisine guides, healthy-ordering tips and a look behind the scenes of food delivery." crumbs={[{ label: "Blog" }]} />
      <section className="container-x section-y pt-12">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by topic">
          {["", ...tags].map((t) => (
            <button key={t || "all"} type="button" onClick={() => { setTag(t); setPage(1); }} aria-pressed={tag === t}
              className={cn("shrink-0 rounded-[var(--radius-ui)] border px-4 py-2 text-sm font-medium transition-colors", tag === t ? "border-brand-500 bg-brand-500 text-white" : "border-ui hover:border-brand-300")}>
              {t || "All topics"}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-96" />) : data?.data?.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
        {!isLoading && !data?.data?.length && <EmptyState icon={FileText} title="No articles yet" description="Check back soon for new stories." />}
        <Pagination meta={data?.meta} onPageChange={setPage} className="mt-12" />
      </section>
    </>
  );
}
