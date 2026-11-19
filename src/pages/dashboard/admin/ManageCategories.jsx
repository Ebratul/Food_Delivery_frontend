import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import ImageUploader from "../../../components/dashboard/ImageUploader.jsx";
import PageTitle from "../../../components/dashboard/PageTitle.jsx";
import Alert from "../../../components/ui/Alert.jsx";
import Button from "../../../components/ui/Button.jsx";
import ConfirmDialog from "../../../components/ui/ConfirmDialog.jsx";
import { Input, Textarea } from "../../../components/ui/Field.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import Table from "../../../components/ui/Table.jsx";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle.js";
import { useCategories } from "../../../hooks/useQueries.js";
import { del, errorMessage, fieldErrors, patch, post } from "../../../lib/api.js";
import { thumb } from "../../../lib/utils.js";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(40),
  description: z.string().trim().min(10, "Description should be at least 10 characters").max(300),
  image: z.string().min(1, "Add a cover image"),
});

function CategoryModal({ open, onClose, category }) {
  return (
    <Modal open={open} onClose={onClose} title={category ? "Edit cuisine" : "Add cuisine"}>
      <CategoryForm onClose={onClose} category={category} />
    </Modal>
  );
}

function CategoryForm({ onClose, category }) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, control, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: category ? { name: category.name, description: category.description, image: category.image } : { name: "", description: "", image: "" },
  });
  const mutation = useMutation({
    mutationFn: ({ name, description, image }) => (category ? patch(`/admin/categories/${category.id}`, { name, description, image }) : post("/admin/categories", { name, description, image })),
    onSuccess: (res) => { toast.success(res.message); queryClient.invalidateQueries({ queryKey: ["categories"] }); onClose(); },
    onError: (err) => { Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m })); setServerError(errorMessage(err)); },
  });
  return (
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="space-y-4">
        <Alert>{serverError}</Alert>
        <Input label="Name" required error={errors.name?.message} {...register("name")} />
        <Textarea label="Description" required rows={3} error={errors.description?.message} {...register("description")} />
        <Controller control={control} name="image" render={({ field }) => <ImageUploader label="Cover image" max={1} value={field.value ? [field.value] : []} onChange={(v) => field.onChange(v[0] ?? "")} error={errors.image?.message} />} />
        <div className="flex justify-end gap-3"><Button variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" loading={mutation.isPending}>Save</Button></div>
      </form>
  );
}

export default function ManageCategories() {
  useDocumentTitle("Cuisines");
  const { data, isLoading } = useCategories();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(undefined);
  const [deleting, setDeleting] = useState(null);
  const [sort, setSort] = useState("name:asc");
  const remove = useMutation({
    mutationFn: (id) => del(`/admin/categories/${id}`),
    onSuccess: (res) => { toast.success(res.message); setDeleting(null); queryClient.invalidateQueries({ queryKey: ["categories"] }); },
    onError: (err) => { toast.error(errorMessage(err)); setDeleting(null); },
  });

  const [field, dir] = sort.split(":");
  const rows = [...(data?.data ?? [])].sort((a, b) => {
    const v = field === "count" ? a.restaurantCount - b.restaurantCount : a.name.localeCompare(b.name);
    return dir === "asc" ? v : -v;
  });

  const columns = [
    { key: "name", header: "Cuisine", sortKey: "name", render: (c) => <div className="flex items-center gap-3"><img src={thumb(c.image, "small")} alt="" className="h-10 w-10 rounded-[var(--radius-ui)] object-cover" /><span className="font-medium">{c.name}</span></div> },
    { key: "description", header: "Description", render: (c) => <span className="line-clamp-2 max-w-md text-muted">{c.description}</span> },
    { key: "count", header: "Restaurants", sortKey: "count", render: (c) => c.restaurantCount },
    { key: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", render: (c) => (
      <div className="flex justify-end gap-1">
        <Button size="icon" variant="ghost" onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`}><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" className="text-red-600 dark:text-red-400" onClick={() => setDeleting(c)} aria-label={`Delete ${c.name}`}><Trash2 className="h-4 w-4" /></Button>
      </div>
    ) },
  ];

  return (
    <>
      <PageTitle title="Cuisines" description="Categories used to organise restaurants on Explore and the home page." action={<Button onClick={() => setEditing(null)}><Plus className="h-4 w-4" /> Add cuisine</Button>} />
      <Table columns={columns} rows={rows} loading={isLoading} sort={sort} onSortChange={setSort} caption="Cuisines" />
      <CategoryModal open={editing !== undefined} onClose={() => setEditing(undefined)} category={editing} />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting.id)} loading={remove.isPending}
        title={`Delete ${deleting?.name}?`} description="Cuisines that still have restaurants cannot be deleted." />
    </>
  );
}
