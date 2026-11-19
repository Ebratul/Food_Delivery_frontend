import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";
import PageTitle from "../../components/dashboard/PageTitle.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { Stars } from "../../components/ui/Rating.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { get } from "../../lib/api.js";
import { formatDate, thumb } from "../../lib/utils.js";

export default function MyReviews() {
  useDocumentTitle("My reviews");
  const { data, isLoading } = useQuery({ queryKey: ["me", "reviews"], queryFn: () => get("/users/me/reviews") });
  return (
    <>
      <PageTitle title="My reviews" description="Reviews you have written for restaurants." />
      {isLoading ? <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-40" />)}</div>
        : !data?.data?.length ? <EmptyState icon={MessageSquareText} title="No reviews yet" description="After an order, open the restaurant page to leave a review." action={<Button to="/dashboard/orders">See my orders</Button>} />
        : (
          <ul className="grid gap-4 md:grid-cols-2">
            {data.data.map((r) => (
              <li key={r.id} className="surface rounded-[var(--radius-ui)] p-6">
                <div className="flex items-center gap-3">
                  <img src={thumb(r.restaurant.images?.[0], "small")} alt="" className="h-12 w-12 rounded-[var(--radius-ui)] object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/restaurants/${r.restaurant.slug}`} className="font-semibold hover:underline">{r.restaurant.name}</Link>
                    <p className="text-sm text-muted">{formatDate(r.createdAt)}</p>
                  </div>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-4 text-muted">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
    </>
  );
}
