import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import PageTitle from "../../components/dashboard/PageTitle.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { Input, Select, Textarea } from "../../components/ui/Field.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { errorMessage, fieldErrors, patch, upload } from "../../lib/api.js";
import { formatDate } from "../../lib/utils.js";
import { CITIES, passwordSchema, profileSchema } from "../../lib/validation.js";

function AvatarCard() {
  const { user, setUser } = useAuth();
  const input = useRef(null);
  const mutation = useMutation({
    mutationFn: (file) => upload("/users/me/avatar", file),
    onSuccess: (res) => { setUser(res.data); toast.success(res.message); },
    onError: (err) => toast.error(errorMessage(err)),
  });
  const onFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 4 * 1024 * 1024) return toast.error("Image must be 4 MB or smaller");
    mutation.mutate(file);
  };
  return (
    <section className="surface flex flex-col items-center rounded-[var(--radius-ui)] p-6 text-center">
      <div className="relative">
        <Avatar user={user} size="h-28 w-28 text-2xl" />
        <button type="button" onClick={() => input.current?.click()} disabled={mutation.isPending}
          className="absolute bottom-0 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg hover:bg-brand-600" aria-label="Change profile photo">
          {mutation.isPending ? <Spinner className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
        </button>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} aria-label="Upload profile photo" />
      </div>
      <h2 className="t-h4 mt-4">{user.name}</h2>
      <p className="text-sm text-muted">{user.email}</p>
      <Badge tone={user.role === "ADMIN" ? "brand" : "neutral"} className="mt-3">{user.role === "ADMIN" ? "Administrator" : "Member"}</Badge>
      <p className="mt-4 text-sm text-muted">Member since {formatDate(user.createdAt, { month: "long", year: "numeric" })}</p>
      <p className="mt-4 text-xs text-muted">JPG, PNG, WebP or AVIF, up to 4 MB. Cropped to a square.</p>
    </section>
  );
}

function ProfileForm() {
  const { user, setUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, setError, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? "", city: user.city ?? "", address: user.address ?? "", bio: user.bio ?? "" },
  });
  const mutation = useMutation({
    mutationFn: (values) => patch("/users/me", values),
    onSuccess: (res) => {
      setUser(res.data); toast.success(res.message);
      reset({ name: res.data.name, phone: res.data.phone ?? "", city: res.data.city ?? "", address: res.data.address ?? "", bio: res.data.bio ?? "" });
    },
    onError: (err) => { Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m })); setServerError(errorMessage(err)); },
  });
  return (
    <form onSubmit={handleSubmit((v) => { setServerError(""); mutation.mutate(v); })} noValidate className="surface grid gap-4 rounded-[var(--radius-ui)] p-6 md:grid-cols-2">
      <h2 className="t-h4 md:col-span-2">Personal information</h2>
      <Alert className="md:col-span-2">{serverError}</Alert>
      <Input label="Full name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" value={user.email} disabled hint="Contact support to change your email" />
      <Input label="Phone" type="tel" autoComplete="tel" placeholder="+880 17xx-xxxxxx" error={errors.phone?.message} {...register("phone")} />
      <Select label="City" error={errors.city?.message} {...register("city")}>
        <option value="">Select a city</option>
        {CITIES.map((c) => <option key={c}>{c}</option>)}
      </Select>
      <Textarea label="Default delivery address" rows={2} className="md:col-span-2" autoComplete="street-address" error={errors.address?.message} {...register("address")} />
      <Textarea label="Bio" rows={3} className="md:col-span-2" hint="Up to 300 characters" error={errors.bio?.message} {...register("bio")} />
      <div className="md:col-span-2"><Button type="submit" loading={mutation.isPending} disabled={!isDirty}>Save changes</Button></div>
    </form>
  );
}

function PasswordForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({ resolver: zodResolver(passwordSchema) });
  const mutation = useMutation({
    mutationFn: (values) => patch("/users/me/password", values),
    onSuccess: (res) => { setSuccess(res.message); toast.success(res.message); reset({ currentPassword: "", newPassword: "", confirmPassword: "" }); },
    onError: (err) => { Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m })); setServerError(errorMessage(err)); },
  });
  return (
    <form onSubmit={handleSubmit((v) => { setServerError(""); setSuccess(""); mutation.mutate(v); })} noValidate className="surface grid gap-4 rounded-[var(--radius-ui)] p-6 md:grid-cols-3">
      <div className="md:col-span-3"><h2 className="t-h4">Change password</h2><p className="text-sm text-muted">Use at least 8 characters with upper- and lowercase letters and a number.</p></div>
      <Alert className="md:col-span-3">{serverError}</Alert>
      <Alert type="success" className="md:col-span-3">{success}</Alert>
      <Input label="Current password" type="password" required autoComplete="current-password" error={errors.currentPassword?.message} {...register("currentPassword")} />
      <Input label="New password" type="password" required autoComplete="new-password" error={errors.newPassword?.message} {...register("newPassword")} />
      <Input label="Confirm new password" type="password" required autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
      <div className="md:col-span-3"><Button type="submit" loading={mutation.isPending}>Update password</Button></div>
    </form>
  );
}

export default function Profile() {
  useDocumentTitle("Profile & settings");
  return (
    <>
      <PageTitle title="Profile & settings" description="Manage your personal details, photo and password." />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <AvatarCard />
        <div className="space-y-6"><ProfileForm /><PasswordForm /></div>
      </div>
    </>
  );
}
