import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Button from "../../components/ui/Button.jsx";
import { errorMessage, post } from "../../lib/api.js";
import { emailField } from "../../lib/validation.js";

const schema = z.object({ email: emailField });

export default function Newsletter() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: (values) => post("/newsletter", values),
    onSuccess: (res) => { toast.success(res.message); reset(); },
    onError: (err) => toast.error(errorMessage(err)),
  });

  return (
    <section className="container-x pb-16 lg:pb-24">
      <div className="dot-grid relative overflow-hidden rounded-[var(--radius-section)] bg-ink px-6 py-16 text-center text-white sm:px-12">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius-ui)] bg-accent-500"><Mail className="h-7 w-7" /></span>
        <h2 className="t-h2 mx-auto mt-6 max-w-2xl">Weekly Deals, <span className="accent-italic text-brand-300">Zero Spam</span></h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">One email a week with new restaurants, seasonal dishes and partner discounts. Unsubscribe any time.</p>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
          <div className="flex-1 text-left">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input id="newsletter-email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")}
              aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "newsletter-error" : undefined}
              className="h-14 w-full rounded-[var(--radius-ui)] border border-white/15 bg-white/10 px-4 text-white placeholder:text-white/40 focus:border-brand-300 focus:outline-none" />
            {errors.email && <p id="newsletter-error" role="alert" className="mt-2 text-sm text-red-300">{errors.email.message}</p>}
          </div>
          <Button type="submit" size="lg" loading={mutation.isPending}>Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
