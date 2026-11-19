import { useState } from "react";
import { Link } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth.js";
import { usePaged } from "../../hooks/useQueries.js";
import { errorMessage, fieldErrors, post } from "../../lib/api.js";
import { formatDate } from "../../lib/utils.js";
import { reviewSchema } from "../../lib/validation.js";
import Alert from "../ui/Alert.jsx";
import Avatar from "../ui/Avatar.jsx";
import Button from "../ui/Button.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import { Textarea } from "../ui/Field.jsx";
import Pagination from "../ui/Pagination.jsx";
import { StarInput, Stars } from "../ui/Rating.jsx";

function ReviewForm({ restaurant }) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const { control, register, handleSubmit, reset, setError, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, comment: "" },
  });
  const mutation = useMutation({
    mutationFn: (values) => post(`/restaurants/${restaurant.id}/reviews`, values),
    onSuccess: (res) => {
      toast.success(res.message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["restaurant", restaurant.slug] });
      queryClient.invalidateQueries({ queryKey: ["reviews", restaurant.id] });
    },
    onError: (err) => {
      Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m }));
      setServerError(errorMessage(err));
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => { setServerError(""); mutation.mutate(v); })} noValidate className="surface space-y-4 rounded-[var(--radius-ui)] p-6">
      <h3 className="t-h4">Write a review</h3>
      <Alert>{serverError}</Alert>
      <div>
        <p className="mb-2 text-sm font-medium" id="rating-label">Your rating <span className="text-accent-600">*</span></p>
        <Controller control={control} name="rating" render={({ field }) => <StarInput value={field.value} onChange={field.onChange} error={errors.rating?.message} />} />
      </div>
      <Textarea label="Your review" required rows={4} placeholder="How was the food, packaging and delivery?" error={errors.comment?.message} {...register("comment")} />
      <Button type="submit" loading={mutation.isPending}>Post review</Button>
    </form>
  );
}

export default function Reviews({ restaurant }) {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaged(["reviews", restaurant.id], `/restaurants/${restaurant.id}/reviews`, { page, limit: 5 });
  const total = restaurant.reviewCount;
  const canReview = isAuthenticated && user.id !== restaurant.ownerId;

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <div className="space-y-6">
        <div className="surface rounded-[var(--radius-ui)] p-6">
          <p className="font-display text-5xl font-bold">{restaurant.rating.toFixed(1)}</p>
          <Stars value={restaurant.rating} className="mt-2" />
          <p className="mt-1 text-sm text-muted">Based on {total} review{total === 1 ? "" : "s"}</p>
          <ul className="mt-6 space-y-2">
            {restaurant.ratingDistribution.map(({ star, count }) => (
              <li key={star} className="flex items-center gap-3 text-sm">
                <span className="w-6 shrink-0">{star}★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <span className="block h-full rounded-full bg-accent-500" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                </span>
                <span className="w-6 shrink-0 text-right text-muted">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        {canReview ? <ReviewForm restaurant={restaurant} /> : !isAuthenticated && (
          <div className="surface rounded-[var(--radius-ui)] p-6 text-sm text-muted">
            <Link to="/login" state={{ from: `/restaurants/${restaurant.slug}` }} className="font-semibold text-brand-600 hover:underline dark:text-brand-300">Log in</Link> to share your experience.
          </div>
        )}
      </div>
      <div>
        {!isLoading && !data?.data?.length ? (
          <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to review this restaurant." />
        ) : (
          <ul className="space-y-4">
            {(data?.data ?? restaurant.reviews).map((r) => (
              <li key={r.id} className="surface rounded-[var(--radius-ui)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={r.user} />
                    <div><p className="font-semibold">{r.user.name}</p><p className="text-sm text-muted">{formatDate(r.createdAt)}</p></div>
                  </div>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-4 leading-7">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
        <Pagination meta={data?.meta} onPageChange={setPage} className="mt-6" />
      </div>
    </div>
  );
}
