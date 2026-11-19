import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, CheckCircle2, Eye, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageTitle from "../../../components/dashboard/PageTitle.jsx";
import TableToolbar, { FilterSelect } from "../../../components/dashboard/TableToolbar.jsx";
import Avatar from "../../../components/ui/Avatar.jsx";
import Badge, { STATUS_TONE } from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import ConfirmDialog from "../../../components/ui/ConfirmDialog.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Table from "../../../components/ui/Table.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle.js";
import { usePaged } from "../../../hooks/useQueries.js";
import { useTableParams } from "../../../hooks/useTableParams.js";
import { del, errorMessage, patch } from "../../../lib/api.js";
import { formatDate } from "../../../lib/utils.js";

export default function ManageUsers() {
  useDocumentTitle("Manage users");
  const { user: me } = useAuth();
  const table = useTableParams({ sort: "joined:desc", filters: { role: "", status: "" } });
  const { data, isLoading } = usePaged(["admin", "users"], "/admin/users", table.params);
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  const update = useMutation({
    mutationFn: ({ id, ...body }) => patch(`/admin/users/${id}`, body),
    onSuccess: (res) => { toast.success(res.message); refresh(); },
    onError: (err) => toast.error(errorMessage(err)),
  });
  const remove = useMutation({
    mutationFn: (id) => del(`/admin/users/${id}`),
    onSuccess: (res) => { toast.success(res.message); setDeleting(null); refresh(); },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const columns = [
    { key: "name", header: "User", sortKey: "name", render: (u) => <div className="flex items-center gap-3"><Avatar user={u} size="h-9 w-9" /><div><p className="font-medium">{u.name}</p><p className="text-xs text-muted">{u.email}</p></div></div> },
    { key: "role", header: "Role", sortKey: "role", render: (u) => <Badge tone={STATUS_TONE[u.role]}>{u.role === "ADMIN" ? "Admin" : "User"}</Badge> },
    { key: "city", header: "City", render: (u) => u.city ?? "–" },
    { key: "orders", header: "Orders", sortKey: "orders", render: (u) => u.orderCount },
    { key: "restaurants", header: "Restaurants", render: (u) => u.restaurantCount },
    { key: "joined", header: "Joined", sortKey: "joined", render: (u) => formatDate(u.createdAt) },
    { key: "status", header: "Status", render: (u) => <Badge tone={u.isActive ? "success" : "danger"}>{u.isActive ? "Active" : "Blocked"}</Badge> },
    { key: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", render: (u) => (
      <div className="flex justify-end gap-1">
        <Button size="icon" variant="ghost" onClick={() => setViewing(u)} aria-label={`View ${u.name}`} title="View"><Eye className="h-4 w-4" /></Button>
        {u.id !== me.id && (
          <>
            <Button size="icon" variant="ghost" onClick={() => update.mutate({ id: u.id, role: u.role === "ADMIN" ? "USER" : "ADMIN" })} aria-label={u.role === "ADMIN" ? `Make ${u.name} a user` : `Make ${u.name} an admin`} title={u.role === "ADMIN" ? "Make user" : "Make admin"}><Shield className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => update.mutate({ id: u.id, isActive: !u.isActive })} aria-label={u.isActive ? `Block ${u.name}` : `Unblock ${u.name}`} title={u.isActive ? "Block" : "Unblock"}>
              {u.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" className="text-red-600 dark:text-red-400" onClick={() => setDeleting(u)} aria-label={`Delete ${u.name}`} title="Delete"><Trash2 className="h-4 w-4" /></Button>
          </>
        )}
      </div>
    ) },
  ];

  return (
    <>
      <PageTitle title="Manage users" description="Search, promote, block or remove accounts." />
      <TableToolbar search={table.search} onSearch={table.setSearch} placeholder="Search by name or email">
        <FilterSelect label="Filter by role" value={table.filters.role} onChange={(v) => table.setFilter("role", v)} options={[["", "All roles"], ["USER", "Users"], ["ADMIN", "Admins"]]} />
        <FilterSelect label="Filter by status" value={table.filters.status} onChange={(v) => table.setFilter("status", v)} options={[["", "Any status"], ["active", "Active"], ["inactive", "Blocked"]]} />
      </TableToolbar>
      <Table columns={columns} rows={data?.data} loading={isLoading} sort={table.sort} onSortChange={table.setSort} caption="Users" />
      <Pagination meta={data?.meta} onPageChange={table.setPage} className="mt-6" />
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.name} description={viewing?.email}>
        {viewing && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {[["Role", viewing.role], ["Status", viewing.isActive ? "Active" : "Blocked"], ["Phone", viewing.phone ?? "–"], ["City", viewing.city ?? "–"], ["Orders", viewing.orderCount], ["Restaurants", viewing.restaurantCount], ["Joined", formatDate(viewing.createdAt)], ["Address", viewing.address ?? "–"]].map(([k, v]) => (
              <div key={k}><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
            {viewing.bio && <div className="col-span-2"><dt className="text-muted">Bio</dt><dd>{viewing.bio}</dd></div>}
          </dl>
        )}
      </Modal>
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting.id)} loading={remove.isPending}
        title={`Delete ${deleting?.name}?`} description="Their orders, reviews and restaurants will also be deleted. This cannot be undone." />
    </>
  );
}
