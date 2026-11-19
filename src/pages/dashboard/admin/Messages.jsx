import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageTitle from "../../../components/dashboard/PageTitle.jsx";
import TableToolbar, { FilterSelect } from "../../../components/dashboard/TableToolbar.jsx";
import Badge, { STATUS_TONE } from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import ConfirmDialog from "../../../components/ui/ConfirmDialog.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Table from "../../../components/ui/Table.jsx";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle.js";
import { usePaged } from "../../../hooks/useQueries.js";
import { useTableParams } from "../../../hooks/useTableParams.js";
import { del, errorMessage, patch } from "../../../lib/api.js";
import { formatDateTime, STATUS_LABELS } from "../../../lib/utils.js";

export default function Messages() {
  useDocumentTitle("Messages");
  const table = useTableParams({ sort: "date:desc", filters: { status: "" } });
  const { data, isLoading } = usePaged(["admin", "messages"], "/admin/messages", table.params);
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const refresh = () => { queryClient.invalidateQueries({ queryKey: ["admin", "messages"] }); queryClient.invalidateQueries({ queryKey: ["dashboard"] }); };

  const setStatus = useMutation({
    mutationFn: ({ id, status }) => patch(`/admin/messages/${id}`, { status }),
    onSuccess: () => refresh(),
    onError: (err) => toast.error(errorMessage(err)),
  });
  const remove = useMutation({
    mutationFn: (id) => del(`/admin/messages/${id}`),
    onSuccess: (res) => { toast.success(res.message); setDeleting(null); refresh(); },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const open = (m) => { setViewing(m); if (m.status === "NEW") setStatus.mutate({ id: m.id, status: "READ" }); };

  const columns = [
    { key: "from", header: "From", render: (m) => <div><p className="font-medium">{m.name}</p><p className="text-xs text-muted">{m.email}</p></div> },
    { key: "subject", header: "Subject", render: (m) => <span className="line-clamp-1 max-w-xs">{m.subject}</span> },
    { key: "date", header: "Received", sortKey: "date", render: (m) => formatDateTime(m.createdAt) },
    { key: "status", header: "Status", render: (m) => <Badge tone={STATUS_TONE[m.status]}>{STATUS_LABELS[m.status]}</Badge> },
    { key: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", render: (m) => (
      <div className="flex justify-end gap-1">
        <Button size="icon" variant="ghost" onClick={() => open(m)} aria-label={`Read message from ${m.name}`}><Eye className="h-4 w-4" /></Button>
        {m.status !== "RESOLVED" && <Button size="icon" variant="ghost" className="text-success-600" onClick={() => setStatus.mutate({ id: m.id, status: "RESOLVED" }, { onSuccess: () => toast.success("Marked as resolved") })} aria-label="Mark as resolved"><CheckCheck className="h-4 w-4" /></Button>}
        <Button size="icon" variant="ghost" className="text-red-600 dark:text-red-400" onClick={() => setDeleting(m)} aria-label={`Delete message from ${m.name}`}><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  return (
    <>
      <PageTitle title="Messages" description="Contact-form submissions from the website." />
      <TableToolbar search={table.search} onSearch={table.setSearch} placeholder="Search by name, email or subject">
        <FilterSelect label="Filter by status" value={table.filters.status} onChange={(v) => table.setFilter("status", v)} options={[["", "All"], ["NEW", "New"], ["READ", "Read"], ["RESOLVED", "Resolved"]]} />
      </TableToolbar>
      <Table columns={columns} rows={data?.data} loading={isLoading} sort={table.sort} onSortChange={table.setSort} empty="Inbox zero. No messages here." caption="Contact messages" />
      <Pagination meta={data?.meta} onPageChange={table.setPage} className="mt-6" />
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.subject} description={viewing && `${viewing.name} · ${viewing.email} · ${formatDateTime(viewing.createdAt)}`}
        footer={viewing && <><Button variant="outline" href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`}>Reply by email</Button><Button onClick={() => { setStatus.mutate({ id: viewing.id, status: "RESOLVED" }); setViewing(null); toast.success("Marked as resolved"); }}>Mark resolved</Button></>}>
        <p className="whitespace-pre-line leading-7">{viewing?.message}</p>
      </Modal>
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting.id)} loading={remove.isPending} title="Delete this message?" description={`From ${deleting?.name}: “${deleting?.subject}”`} />
    </>
  );
}
