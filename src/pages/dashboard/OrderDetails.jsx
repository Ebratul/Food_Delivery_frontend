import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, MapPin, Phone, ReceiptText } from "lucide-react";
import PageTitle from "../../components/dashboard/PageTitle.jsx";
import Badge, { STATUS_TONE } from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { get } from "../../lib/api.js";
import { cn, formatDateTime, formatPrice, PAYMENT_LABELS, STATUS_LABELS, thumb } from "../../lib/utils.js";

const FLOW = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function OrderDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({ queryKey: ["order", id], queryFn: () => get(`/orders/${id}`) });
  const o = data?.data;
  useDocumentTitle(o ? `Order ${o.orderNumber}` : "Order");

  if (isLoading) return <Skeleton className="h-96" />;
  if (isError || !o) return <EmptyState icon={ReceiptText} title="Order not found" action={<Button to="/dashboard/orders">Back to orders</Button>} />;
  const step = FLOW.indexOf(o.status);

  return (
    <>
      <PageTitle title={`Order ${o.orderNumber}`} description={`Placed ${formatDateTime(o.createdAt)}`} action={<Badge tone={STATUS_TONE[o.status]} className="text-sm">{STATUS_LABELS[o.status]}</Badge>} />
      {o.status !== "CANCELLED" ? (
        <ol className="surface mb-6 grid gap-4 rounded-[var(--radius-ui)] p-6 sm:grid-cols-5" aria-label="Order progress">
          {FLOW.map((s, i) => (
            <li key={s} className="flex items-center gap-3 sm:flex-col sm:text-center">
              <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                i <= step ? "border-brand-500 bg-brand-500 text-white" : "border-ui text-muted")}>{i < step || o.status === "DELIVERED" ? <Check className="h-5 w-5" /> : i + 1}</span>
              <span className={cn("text-sm", i <= step ? "font-semibold" : "text-muted")} aria-current={i === step ? "step" : undefined}>{STATUS_LABELS[s]}</span>
            </li>
          ))}
        </ol>
      ) : <p className="mb-6 rounded-[var(--radius-ui)] border border-red-500/30 bg-red-50 p-4 text-red-700 dark:bg-red-500/10 dark:text-red-300">This order was cancelled.</p>}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="surface rounded-[var(--radius-ui)] p-6">
          <div className="flex items-center gap-3">
            <img src={thumb(o.restaurant.images?.[0], "small")} alt="" className="h-12 w-12 rounded-[var(--radius-ui)] object-cover" />
            <div><h2 className="t-h4">{o.restaurant.name}</h2><p className="text-sm text-muted">{o.restaurant.area}, {o.restaurant.city}</p></div>
          </div>
          <ul className="mt-6 divide-y divide-[var(--border)]">
            {o.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 py-3">
                <span><b>{i.quantity}×</b> {i.name} <span className="text-sm text-muted">({formatPrice(i.unitPrice)})</span></span>
                <span className="font-medium">{formatPrice(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-ui pt-4">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(o.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery fee</dt><dd>{formatPrice(o.deliveryFee)}</dd></div>
            <div className="flex justify-between text-lg font-bold"><dt>Total</dt><dd>{formatPrice(o.total)}</dd></div>
          </dl>
        </section>
        <section className="surface space-y-4 rounded-[var(--radius-ui)] p-6">
          <h2 className="t-h4">Delivery</h2>
          <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-brand-500" />{o.deliveryAddress}</p>
          <p className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-brand-500" />{o.phone}</p>
          <p className="text-sm text-muted">Payment: <b className="text-[var(--text)]">{PAYMENT_LABELS[o.paymentMethod]}</b></p>
          {o.note && <p className="rounded-[var(--radius-ui)] bg-[var(--surface-2)] p-3 text-sm">“{o.note}”</p>}
          <p className="text-sm text-muted">Restaurant phone: <a href={`tel:${o.restaurant.phone.replace(/\s/g, "")}`} className="text-brand-600 hover:underline dark:text-brand-300">{o.restaurant.phone}</a></p>
          <Button to={`/restaurants/${o.restaurant.slug}`} variant="outline" className="w-full">Order again</Button>
        </section>
      </div>
    </>
  );
}
