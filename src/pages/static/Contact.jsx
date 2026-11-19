import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";
import { Input, Textarea } from "../../components/ui/Field.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { errorMessage, fieldErrors, post } from "../../lib/api.js";
import { contactSchema } from "../../lib/validation.js";

const INFO = [
  { icon: MapPin, title: "Visit us", lines: ["Level 5, House 42, Road 11", "Banani, Dhaka 1213"] },
  { icon: Phone, title: "Call us", lines: [<a key="p" href="tel:+8809612345678" className="hover:underline">+880 9612-345678</a>] },
  { icon: Mail, title: "Email", lines: [<a key="e" href="mailto:support@fooddash.app" className="hover:underline">support@fooddash.app</a>, <a key="b" href="mailto:partners@fooddash.app" className="hover:underline">partners@fooddash.app</a>] },
  { icon: Clock, title: "Support hours", lines: ["Every day, 9:00 AM – 12:00 AM"] },
];

export default function Contact() {
  useDocumentTitle("Contact us");
  const { user } = useAuth();
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    values: { name: user?.name ?? "", email: user?.email ?? "", subject: "", message: "" },
  });
  const mutation = useMutation({
    mutationFn: (values) => post("/contact", values),
    onSuccess: (res) => { setSuccess(res.message); reset({ name: user?.name ?? "", email: user?.email ?? "", subject: "", message: "" }); },
    onError: (err) => {
      Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m }));
      setServerError(errorMessage(err));
    },
  });

  return (
    <>
      <PageHeader title="Let's" accent="Talk" description="Questions about an order, partnering with us or anything else? Send us a message and we'll reply within 24 hours." crumbs={[{ label: "Contact" }]} />
      <section className="container-x section-y grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
        <ul className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {INFO.map((i) => (
            <li key={i.title} className="surface flex gap-4 rounded-[var(--radius-ui)] p-6">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-ui)] bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"><i.icon className="h-6 w-6" /></span>
              <div><h2 className="t-h4">{i.title}</h2>{i.lines.map((l, k) => <p key={k} className="text-muted">{l}</p>)}</div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit((v) => { setSuccess(""); setServerError(""); mutation.mutate(v); })} noValidate className="surface space-y-4 rounded-[var(--radius-ui)] p-6 lg:p-8">
          <h2 className="t-h3">Send a message</h2>
          <Alert type="success">{success}</Alert>
          <Alert>{serverError}</Alert>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Your name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
          </div>
          <Input label="Subject" required error={errors.subject?.message} {...register("subject")} />
          <Textarea label="Message" required rows={6} hint="At least 20 characters" error={errors.message?.message} {...register("message")} />
          <Button type="submit" size="lg" loading={mutation.isPending}>Send message</Button>
        </form>
      </section>
    </>
  );
}
