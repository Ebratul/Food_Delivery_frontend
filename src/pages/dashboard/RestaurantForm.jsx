import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "../../components/dashboard/ImageUploader.jsx";
import PageTitle from "../../components/dashboard/PageTitle.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Badge, { STATUS_TONE } from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { Checkbox, Input, Select, Textarea } from "../../components/ui/Field.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { useCategories } from "../../hooks/useQueries.js";
import { del, errorMessage, fieldErrors, get, patch, post } from "../../lib/api.js";
import { formatPrice, STATUS_LABELS, thumb } from "../../lib/utils.js";
import { CITIES, menuItemSchema, restaurantSchema } from "../../lib/validation.js";

const EMPTY = {
  name: "", tagline: "", description: "", categoryId: "", city: "Dhaka", area: "", address: "", phone: "", openingHours: "11:00 AM – 11:00 PM",
  priceLevel: 2, avgMealPrice: 350, deliveryFee: 40, minOrder: 250, deliveryTimeMin: 25, deliveryTimeMax: 40, isVeganFriendly: false, images: [],
};
const SECTIONS = ["Mains", "Starters & Sides", "Soups", "Desserts", "Breakfast", "Drinks"];

const NEW_DISH = { name: "", description: "", price: 250, section: "Mains", image: "", isAvailable: true, isPopular: false };

function MenuItemModal({ open, onClose, restaurantId, item }) {
  return (
    <Modal open={open} onClose={onClose} title={item ? "Edit dish" : "Add a dish"} size="lg">
      {/* the form mounts fresh every time the modal opens, so no reset logic is needed */}
      <MenuItemForm onClose={onClose} restaurantId={restaurantId} item={item} />
    </Modal>
  );
}

function MenuItemForm({ onClose, restaurantId, item }) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, control, setError, formState: { errors } } = useForm({
    resolver: zodResolver(menuItemSchema),
    defaultValues: item ? { name: item.name, description: item.description, price: item.price, section: item.section, image: item.image, isAvailable: item.isAvailable, isPopular: item.isPopular } : NEW_DISH,
  });

  const mutation = useMutation({
    mutationFn: (values) => (item ? patch(`/menu-items/${item.id}`, values) : post(`/restaurants/${restaurantId}/menu-items`, values)),
    onSuccess: (res) => { toast.success(res.message); queryClient.invalidateQueries({ queryKey: ["manage", restaurantId] }); onClose(); },
    onError: (err) => { Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m })); setServerError(errorMessage(err)); },
  });

  return (
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="space-y-4">
        <Alert>{serverError}</Alert>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Dish name" required error={errors.name?.message} {...register("name")} />
          <Input label="Price (৳)" type="number" min="10" required error={errors.price?.message} {...register("price")} />
        </div>
        <Textarea label="Description" required rows={3} error={errors.description?.message} {...register("description")} />
        <Select label="Menu section" required error={errors.section?.message} {...register("section")}>
          {SECTIONS.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Controller control={control} name="image" render={({ field }) => (
          <ImageUploader label="Dish photo" max={1} value={field.value ? [field.value] : []} onChange={(v) => field.onChange(v[0] ?? "")} error={errors.image?.message} />
        )} />
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Available to order" {...register("isAvailable")} />
          <Checkbox label="Mark as popular" {...register("isPopular")} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>{item ? "Save dish" : "Add dish"}</Button>
        </div>
      </form>
  );
}

function MenuManager({ restaurant }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit
  const [deleting, setDeleting] = useState(null);
  const remove = useMutation({
    mutationFn: (id) => del(`/menu-items/${id}`),
    onSuccess: (res) => { toast.success(res.message); setDeleting(null); queryClient.invalidateQueries({ queryKey: ["manage", restaurant.id] }); },
    onError: (err) => toast.error(errorMessage(err)),
  });

  return (
    <section className="surface mt-8 rounded-[var(--radius-ui)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="t-h4">Menu</h2><p className="text-sm text-muted">{restaurant.menuItems.length} dishes</p></div>
        <Button onClick={() => setEditing(null)}><Plus className="h-4 w-4" /> Add dish</Button>
      </div>
      {restaurant.menuItems.length ? (
        <ul className="mt-6 divide-y divide-[var(--border)]">
          {restaurant.menuItems.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-4 py-3 sm:flex-nowrap">
              <img src={thumb(m.image, "small")} alt="" className="h-12 w-12 rounded-[var(--radius-ui)] object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-muted">{m.section} · {formatPrice(m.price)}</p>
              </div>
              <div className="flex gap-2">
                {!m.isAvailable && <Badge>Sold out</Badge>}
                {m.isPopular && <Badge tone="accent">Popular</Badge>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setEditing(m)} aria-label={`Edit ${m.name}`}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-red-600 dark:text-red-400" onClick={() => setDeleting(m)} aria-label={`Delete ${m.name}`}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      ) : <EmptyState icon={UtensilsCrossed} title="No dishes yet" description="Add your first dish so customers can order." className="mt-6" />}
      <MenuItemModal open={editing !== undefined} onClose={() => setEditing(undefined)} restaurantId={restaurant.id} item={editing} />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting.id)} loading={remove.isPending}
        title={`Remove ${deleting?.name}?`} description="The dish will be removed from your menu. Past orders keep their records." confirmLabel="Remove" />
    </section>
  );
}

export default function RestaurantForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  useDocumentTitle(isEdit ? "Edit restaurant" : "Add restaurant");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const [serverError, setServerError] = useState("");

  const existing = useQuery({ queryKey: ["manage", id], queryFn: () => get(`/restaurants/manage/${id}`), enabled: isEdit });
  const restaurant = existing.data?.data;

  const { register, handleSubmit, control, reset, setError, formState: { errors, isDirty } } = useForm({ resolver: zodResolver(restaurantSchema), defaultValues: EMPTY });

  useEffect(() => {
    if (restaurant) {
      const values = Object.fromEntries(Object.keys(EMPTY).map((k) => [k, restaurant[k]]));
      reset(values);
    }
  }, [restaurant, reset]);

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? patch(`/restaurants/${id}`, values) : post("/restaurants", values)),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["me", "restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["manage", id] });
      if (!isEdit) navigate(`/dashboard/restaurants/${res.data.id}/edit`, { replace: true });
    },
    onError: (err) => {
      Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m }));
      setServerError(errorMessage(err));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  if (isEdit && existing.isLoading) return <Skeleton className="h-[600px]" />;
  if (isEdit && existing.isError) return <EmptyState title="Restaurant not found" description={errorMessage(existing.error)} action={<Button to="/dashboard/restaurants">Back</Button>} />;

  return (
    <>
      <PageTitle
        title={isEdit ? `Edit ${restaurant.name}` : "Add a restaurant"}
        description={isEdit ? "Update your listing details, photos and menu." : "Tell customers about your kitchen. New listings are reviewed within one working day."}
        action={isEdit && <div className="flex items-center gap-3"><Badge tone={STATUS_TONE[restaurant.status]}>{STATUS_LABELS[restaurant.status]}</Badge><Button to={`/restaurants/${restaurant.slug}`} variant="outline">View page</Button></div>}
      />
      <form onSubmit={handleSubmit((v) => { setServerError(""); mutation.mutate(v); })} noValidate className="space-y-8">
        <Alert>{serverError}</Alert>
        <section className="surface grid gap-4 rounded-[var(--radius-ui)] p-6 md:grid-cols-2">
          <h2 className="t-h4 md:col-span-2">Basic information</h2>
          <Input label="Restaurant name" required error={errors.name?.message} {...register("name")} />
          <Select label="Cuisine" required error={errors.categoryId?.message} {...register("categoryId")}>
            <option value="">Choose a cuisine</option>
            {categories?.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="Tagline" required className="md:col-span-2" placeholder="e.g. Royal biryani and slow-cooked curries" error={errors.tagline?.message} {...register("tagline")} />
          <Textarea label="Description" required className="md:col-span-2" rows={5} hint="At least 60 characters: what makes your kitchen special?" error={errors.description?.message} {...register("description")} />
        </section>

        <section className="surface rounded-[var(--radius-ui)] p-6">
          <h2 className="t-h4 mb-4">Photos</h2>
          <Controller control={control} name="images" render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} error={errors.images?.message} />} />
        </section>

        <section className="surface grid gap-4 rounded-[var(--radius-ui)] p-6 md:grid-cols-3">
          <h2 className="t-h4 md:col-span-3">Location &amp; contact</h2>
          <Select label="City" required error={errors.city?.message} {...register("city")}>{CITIES.map((c) => <option key={c}>{c}</option>)}</Select>
          <Input label="Area" required placeholder="e.g. Banani" error={errors.area?.message} {...register("area")} />
          <Input label="Phone" type="tel" required placeholder="+880 17xx-xxxxxx" error={errors.phone?.message} {...register("phone")} />
          <Input label="Street address" required className="md:col-span-2" error={errors.address?.message} {...register("address")} />
          <Input label="Opening hours" required error={errors.openingHours?.message} {...register("openingHours")} />
        </section>

        <section className="surface grid gap-4 rounded-[var(--radius-ui)] p-6 sm:grid-cols-2 lg:grid-cols-3">
          <h2 className="t-h4 sm:col-span-2 lg:col-span-3">Pricing &amp; delivery</h2>
          <Select label="Price level" required error={errors.priceLevel?.message} {...register("priceLevel")}>
            <option value={1}>৳ Budget</option><option value={2}>৳৳ Moderate</option><option value={3}>৳৳৳ Premium</option>
          </Select>
          <Input label="Average main dish (৳)" type="number" required error={errors.avgMealPrice?.message} {...register("avgMealPrice")} />
          <Input label="Delivery fee (৳)" type="number" required error={errors.deliveryFee?.message} {...register("deliveryFee")} />
          <Input label="Minimum order (৳)" type="number" required error={errors.minOrder?.message} {...register("minOrder")} />
          <Input label="Delivery time from (min)" type="number" required error={errors.deliveryTimeMin?.message} {...register("deliveryTimeMin")} />
          <Input label="Delivery time to (min)" type="number" required error={errors.deliveryTimeMax?.message} {...register("deliveryTimeMax")} />
          <Checkbox label="Vegan-friendly menu options" className="sm:col-span-2 lg:col-span-3" {...register("isVeganFriendly")} />
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" to="/dashboard/restaurants">Cancel</Button>
          <Button type="submit" size="lg" loading={mutation.isPending} disabled={isEdit && !isDirty}>{isEdit ? "Save changes" : "Submit for review"}</Button>
        </div>
      </form>
      {isEdit && <MenuManager restaurant={restaurant} />}
    </>
  );
}
