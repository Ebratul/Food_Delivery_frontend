import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import PageTitle from "../../../components/dashboard/PageTitle.jsx";
import TableToolbar, { FilterSelect } from "../../../components/dashboard/TableToolbar.jsx";
import Badge, { STATUS_TONE } from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Table from "../../../components/ui/Table.jsx";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle.js";
import { usePaged } from "../../../hooks/useQueries.js";
import { useTableParams } from "../../../hooks/useTableParams.js";
import { errorMessage, patch } from "../../../lib/api.js";
import { formatDateTime, formatPrice, PAYMENT_LABELS, STATUS_LABELS } from "../../../lib/utils.js";
import { ORDER_STATUS_OPTIONS } from "../MyOrders.jsx";

const NEXT = { PENDING: ["CONFIRMED", "CANCELLED"], CONFIRMED: ["PREPARING", "CANCELLED"], PREPARING: ["OUT_FOR_DELIVERY"], OUT_FOR_DELIVERY: ["DELIVERED"] };

export default function ManageOrders() {
  useDocumentTitle("Orders");
  const table = useTableParams({ sort: "date:desc", filters: { status: "" } });
  const { data, isLoading } = usePaged(["admin", "orders"], "/admin/orders", table.params);
  const queryClient = useQueryClient();
  const advance = useMutation({
    mutationFn: ({ id, status }) => patch(`/admin/orders/${id}/status`, { status }),
    onSuccess: (res) => { toast.success(res.message); queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }); queryClient.invalidateQueries({ queryKey: ["dashboard"] }); },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const columns = [
    { key: "number", header: "Order", sortKey: "number", render: (o) => <span className="font-medium">{o.orderNumber}</span> },
    { key: "customer", header: "Customer", render: (o) => <div><p>{o.user.name}</p><p className="text-xs text-muted">{o.user.email}</p></div> },
    { key: "restaurant", header: "Restaurant", render: (o) => o.restaurant.name },
    { key: "date", header: "Placed", sortKey: "date", render: (o) => formatDateTime(o.createdAt) },
    { key: "payment", header: "Payment", render: (o) => PAYMENT_LABELS[o.paymentMethod] },
    { key: "total", header: "Total", sortKey: "total", render: (o) => <b>{formatPrice(o.total)}</b> },
    { key: "status", header: "Status", sortKey: "status", render: (o) => <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABELS[o.status]}</Badge> },
    { key: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", render: (o) => (
      <div className="flex items-center justify-end gap-2">
        {NEXT[o.status] && (
          <select aria-label={`Update status of ${o.orderNumber}`} value="" disabled={advance.isPending}
            onChange={(e) => e.target.value && advance.mutate({ id: o.id, status: e.target.value })}
            className="h-9 cursor-pointer rounded-[var(--radius-ui)] border border-ui bg-[var(--surface)] px-2 text-sm">
            <option value="">Update…</option>
            {NEXT[o.status].map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        )}
        <Button to={`/dashboard/orders/${o.id}`} size="icon" variant="ghost" aria-label={`View ${o.orderNumber}`} title="View"><Eye className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  return (
    <>
      <PageTitle title="Orders" description="Every order on the platform. Move orders through the delivery lifecycle." />
      <TableToolbar search={table.search} onSearch={table.setSearch} placeholder="Search by order number, customer or restaurant">
        <FilterSelect label="Filter by status" value={table.filters.status} onChange={(v) => table.setFilter("status", v)} options={ORDER_STATUS_OPTIONS} />
      </TableToolbar>
      <Table columns={columns} rows={data?.data} loading={isLoading} sort={table.sort} onSortChange={table.setSort} caption="All orders" />
      <Pagination meta={data?.meta} onPageChange={table.setPage} className="mt-6" />
    </>
  );
}
