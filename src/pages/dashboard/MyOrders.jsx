import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import PageTitle from "../../components/dashboard/PageTitle.jsx";
import TableToolbar, { FilterSelect } from "../../components/dashboard/TableToolbar.jsx";
import Badge, { STATUS_TONE } from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import Table from "../../components/ui/Table.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { usePaged } from "../../hooks/useQueries.js";
import { useTableParams } from "../../hooks/useTableParams.js";
import { errorMessage, patch } from "../../lib/api.js";
import { formatDateTime, formatPrice, PAYMENT_LABELS, STATUS_LABELS, thumb } from "../../lib/utils.js";

export const ORDER_STATUS_OPTIONS = [["", "All statuses"], ...Object.entries(STATUS_LABELS).slice(0, 6)];

export default function MyOrders() {
  useDocumentTitle("My orders");
  const table = useTableParams({ sort: "date:desc", filters: { status: "" } });
  const { data, isLoading } = usePaged(["me", "orders"], "/orders/mine", table.params);
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = useState(null);

  const cancel = useMutation({
    mutationFn: (id) => patch(`/orders/${id}/cancel`),
    onSuccess: (res) => { toast.success(res.message); setCancelling(null); queryClient.invalidateQueries({ queryKey: ["me", "orders"] }); queryClient.invalidateQueries({ queryKey: ["dashboard"] }); },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const columns = [
    { key: "orderNumber", header: "Order", sortKey: "number", render: (o) => <span className="font-medium">{o.orderNumber}</span> },
    { key: "restaurant", header: "Restaurant", render: (o) => (
      <Link to={`/restaurants/${o.restaurant.slug}`} className="flex items-center gap-3 hover:underline">
        <img src={thumb(o.restaurant.images?.[0], "small")} alt="" className="h-9 w-9 rounded-[var(--radius-ui)] object-cover" loading="lazy" />{o.restaurant.name}
      </Link>
    ) },
    { key: "createdAt", header: "Placed", sortKey: "date", render: (o) => formatDateTime(o.createdAt) },
    { key: "items", header: "Items", render: (o) => o.itemCount },
    { key: "payment", header: "Payment", render: (o) => PAYMENT_LABELS[o.paymentMethod] },
    { key: "total", header: "Total", sortKey: "total", render: (o) => <b>{formatPrice(o.total)}</b> },
    { key: "status", header: "Status", sortKey: "status", render: (o) => <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABELS[o.status]}</Badge> },
    { key: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", render: (o) => (
      <div className="flex justify-end gap-2">
        <Button to={`/dashboard/orders/${o.id}`} size="sm" variant="outline" aria-label={`View order ${o.orderNumber}`}><Eye className="h-4 w-4" /> View</Button>
        {o.status === "PENDING" && <Button size="sm" variant="ghost" className="text-red-600 dark:text-red-400" onClick={() => setCancelling(o)} aria-label={`Cancel order ${o.orderNumber}`}><XCircle className="h-4 w-4" /> Cancel</Button>}
      </div>
    ) },
  ];

  return (
    <>
      <PageTitle title="My orders" description="Track current orders and review your order history." action={<Button to="/explore">New order</Button>} />
      <TableToolbar search={table.search} onSearch={table.setSearch} placeholder="Search by order number or restaurant">
        <FilterSelect label="Filter by status" value={table.filters.status} onChange={(v) => table.setFilter("status", v)} options={ORDER_STATUS_OPTIONS} />
        <FilterSelect label="Sort" value={table.sort} onChange={table.setSort} options={[["date:desc", "Newest first"], ["date:asc", "Oldest first"], ["total:desc", "Highest total"], ["total:asc", "Lowest total"]]} />
      </TableToolbar>
      <Table columns={columns} rows={data?.data} loading={isLoading} sort={table.sort} onSortChange={table.setSort} empty="No orders match your filters." caption="My orders" />
      <Pagination meta={data?.meta} onPageChange={table.setPage} className="mt-6" />
      <ConfirmDialog open={Boolean(cancelling)} onClose={() => setCancelling(null)} onConfirm={() => cancel.mutate(cancelling.id)} loading={cancel.isPending}
        title="Cancel this order?" confirmLabel="Cancel order" description={`Order ${cancelling?.orderNumber} from ${cancelling?.restaurant.name} will be cancelled. This cannot be undone.`} />
    </>
  );
}
