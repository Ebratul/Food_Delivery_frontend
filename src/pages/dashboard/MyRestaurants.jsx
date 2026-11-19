import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import { del, errorMessage } from "../../lib/api.js";
import { formatDate, STATUS_LABELS, thumb } from "../../lib/utils.js";

export default function MyRestaurants() {
  useDocumentTitle("My restaurants");
  const table = useTableParams({ sort: "newest:desc", filters: { status: "" } });
  const { data, isLoading } = usePaged(["me", "restaurants"], "/restaurants/mine", table.params);
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(null);

  const remove = useMutation({
    mutationFn: (id) => del(`/restaurants/${id}`),
    onSuccess: (res) => { toast.success(res.message); setDeleting(null); queryClient.invalidateQueries({ queryKey: ["me", "restaurants"] }); queryClient.invalidateQueries({ queryKey: ["restaurants"] }); },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const columns = [
    { key: "name", header: "Restaurant", sortKey: "name", render: (r) => (
      <div className="flex items-center gap-3">
        <img src={thumb(r.images?.[0], "small")} alt="" className="h-10 w-10 rounded-[var(--radius-ui)] object-cover" loading="lazy" />
        <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted">{r.category.name} · {r.area}, {r.city}</p></div>
      </div>
    ) },
    { key: "rating", header: "Rating", sortKey: "rating", render: (r) => <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-accent-500 text-accent-500" />{r.rating.toFixed(1)} <span className="text-muted">({r.reviewCount})</span></span> },
    { key: "menu", header: "Dishes", render: (r) => r.menuCount },
    { key: "orders", header: "Orders", sortKey: "orders", render: (r) => r.orderCount },
    { key: "createdAt", header: "Listed", sortKey: "newest", render: (r) => formatDate(r.createdAt) },
    { key: "status", header: "Status", sortKey: "status", render: (r) => <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABELS[r.status]}</Badge> },
    { key: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", render: (r) => (
      <div className="flex justify-end gap-1">
        <Button to={`/restaurants/${r.slug}`} size="icon" variant="ghost" aria-label={`View ${r.name}`} title="View"><Eye className="h-4 w-4" /></Button>
        <Button to={`/dashboard/restaurants/${r.id}/edit`} size="icon" variant="ghost" aria-label={`Edit ${r.name}`} title="Edit"><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" className="text-red-600 dark:text-red-400" onClick={() => setDeleting(r)} aria-label={`Delete ${r.name}`} title="Delete"><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  return (
    <>
      <PageTitle title="My restaurants" description="Manage your listings, menus and photos." action={<Button to="/dashboard/restaurants/new"><Plus className="h-4 w-4" /> Add restaurant</Button>} />
      <TableToolbar search={table.search} onSearch={table.setSearch} placeholder="Search your restaurants">
        <FilterSelect label="Filter by status" value={table.filters.status} onChange={(v) => table.setFilter("status", v)} options={[["", "All statuses"], ["APPROVED", "Approved"], ["PENDING", "Pending"], ["REJECTED", "Rejected"]]} />
      </TableToolbar>
      <Table columns={columns} rows={data?.data} loading={isLoading} sort={table.sort} onSortChange={table.setSort} caption="My restaurants"
        empty={<span>You haven&apos;t listed a restaurant yet. <Link to="/dashboard/restaurants/new" className="text-brand-600 underline dark:text-brand-300">Add your first one</Link>.</span>} />
      <Pagination meta={data?.meta} onPageChange={table.setPage} className="mt-6" />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting.id)} loading={remove.isPending}
        title={`Delete ${deleting?.name}?`} description="The restaurant, its menu, reviews and order history will be permanently deleted." />
    </>
  );
}
