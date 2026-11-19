import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Eye, Pencil, Sparkles, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import PageTitle from "../../../components/dashboard/PageTitle.jsx";
import TableToolbar, { FilterSelect } from "../../../components/dashboard/TableToolbar.jsx";
import Badge, { STATUS_TONE } from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import ConfirmDialog from "../../../components/ui/ConfirmDialog.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Table from "../../../components/ui/Table.jsx";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle.js";
import { useCategories, usePaged } from "../../../hooks/useQueries.js";
import { useTableParams } from "../../../hooks/useTableParams.js";
import { del, errorMessage, patch } from "../../../lib/api.js";
import { cn, formatDate, STATUS_LABELS, thumb } from "../../../lib/utils.js";

export default function ManageRestaurants() {
  useDocumentTitle("Manage restaurants");
  const table = useTableParams({ sort: "newest:desc", filters: { status: "", category: "" } });
  const { data, isLoading } = usePaged(["admin", "restaurants"], "/admin/restaurants", table.params);
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(null);
  const refresh = () => { queryClient.invalidateQueries({ queryKey: ["admin", "restaurants"] }); queryClient.invalidateQueries({ queryKey: ["restaurants"] }); queryClient.invalidateQueries({ queryKey: ["dashboard"] }); };

  const setStatus = useMutation({
    mutationFn: ({ id, ...body }) => patch(`/admin/restaurants/${id}/status`, body),
    onSuccess: (res) => { toast.success(res.message); refresh(); },
    onError: (err) => toast.error(errorMessage(err)),
  });
  const remove = useMutation({
    mutationFn: (id) => del(`/restaurants/${id}`),
    onSuccess: (res) => { toast.success(res.message); setDeleting(null); refresh(); },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const columns = [
    { key: "name", header: "Restaurant", sortKey: "name", render: (r) => (
      <div className="flex items-center gap-3">
        <img src={thumb(r.images?.[0], "small")} alt="" className="h-10 w-10 rounded-[var(--radius-ui)] object-cover" loading="lazy" />
        <div><p className="font-medium">{r.name}{r.isFeatured && <Sparkles className="ml-1 inline h-3.5 w-3.5 text-accent-500" aria-label="Featured" />}</p><p className="text-xs text-muted">{r.category.name} · {r.city}</p></div>
      </div>
    ) },
    { key: "owner", header: "Owner", render: (r) => r.owner.name },
    { key: "rating", header: "Rating", sortKey: "rating", render: (r) => <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-accent-500 text-accent-500" />{r.rating.toFixed(1)}</span> },
    { key: "orders", header: "Orders", sortKey: "orders", render: (r) => r.orderCount },
    { key: "created", header: "Listed", sortKey: "newest", render: (r) => formatDate(r.createdAt) },
    { key: "status", header: "Status", sortKey: "status", render: (r) => <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABELS[r.status]}</Badge> },
    { key: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", render: (r) => (
      <div className="flex justify-end gap-1">
        {r.status !== "APPROVED" && <Button size="icon" variant="ghost" className="text-success-600" onClick={() => setStatus.mutate({ id: r.id, status: "APPROVED" })} aria-label={`Approve ${r.name}`} title="Approve"><Check className="h-4 w-4" /></Button>}
        {r.status !== "REJECTED" && <Button size="icon" variant="ghost" onClick={() => setStatus.mutate({ id: r.id, status: "REJECTED", isFeatured: false })} aria-label={`Reject ${r.name}`} title="Reject"><X className="h-4 w-4" /></Button>}
        {r.status === "APPROVED" && (
          <Button size="icon" variant="ghost" className={cn(r.isFeatured && "text-accent-500")} onClick={() => setStatus.mutate({ id: r.id, status: r.status, isFeatured: !r.isFeatured })}
            aria-label={r.isFeatured ? `Unfeature ${r.name}` : `Feature ${r.name}`} title={r.isFeatured ? "Remove from featured" : "Feature on home page"}><Sparkles className="h-4 w-4" /></Button>
        )}
        <Button to={`/restaurants/${r.slug}`} size="icon" variant="ghost" aria-label={`View ${r.name}`} title="View"><Eye className="h-4 w-4" /></Button>
        <Button to={`/dashboard/restaurants/${r.id}/edit`} size="icon" variant="ghost" aria-label={`Edit ${r.name}`} title="Edit"><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" className="text-red-600 dark:text-red-400" onClick={() => setDeleting(r)} aria-label={`Delete ${r.name}`} title="Delete"><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  return (
    <>
      <PageTitle title="Manage restaurants" description="Approve new listings, feature top kitchens and moderate content." />
      <TableToolbar search={table.search} onSearch={table.setSearch} placeholder="Search by restaurant or owner">
        <FilterSelect label="Filter by status" value={table.filters.status} onChange={(v) => table.setFilter("status", v)} options={[["", "All statuses"], ["PENDING", "Pending"], ["APPROVED", "Approved"], ["REJECTED", "Rejected"]]} />
        <FilterSelect label="Filter by cuisine" value={table.filters.category} onChange={(v) => table.setFilter("category", v)} options={[["", "All cuisines"], ...(categories?.data?.map((c) => [c.slug, c.name]) ?? [])]} />
      </TableToolbar>
      <Table columns={columns} rows={data?.data} loading={isLoading} sort={table.sort} onSortChange={table.setSort} caption="Restaurants" />
      <Pagination meta={data?.meta} onPageChange={table.setPage} className="mt-6" />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting.id)} loading={remove.isPending}
        title={`Delete ${deleting?.name}?`} description="The listing, its menu, reviews and orders will be permanently deleted." />
    </>
  );
}
