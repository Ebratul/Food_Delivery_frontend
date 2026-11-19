import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../../components/blog/PostCard.jsx";
import Button from "../../components/ui/Button.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { get } from "../../lib/api.js";

export default function BlogPreview() {
  const { data, isLoading } = useQuery({ queryKey: ["blog", { limit: 3 }], queryFn: () => get("/blog", { limit: 3 }) });
  return (
    <section className="container-x section-y pt-0">
      <SectionHeading tag="From the blog" title="Stories, Guides &" accent="Food Tips"
        action={<Button to="/blog" variant="outline" className="shrink-0">All articles <ArrowRight className="h-4 w-4" /></Button>} />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {isLoading ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-96" />) : data?.data?.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </section>
  );
}
