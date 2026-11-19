import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";
import { Checkbox, Input } from "../../components/ui/Field.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { errorMessage, fieldErrors, post } from "../../lib/api.js";
import { cn } from "../../lib/utils.js";
import { registerSchema } from "../../lib/validation.js";
import AuthShell from "./AuthShell.jsx";

const RULES = [
  ["At least 8 characters", (p) => p.length >= 8],
  ["One uppercase letter", (p) => /[A-Z]/.test(p)],
  ["One lowercase letter", (p) => /[a-z]/.test(p)],
  ["One number", (p) => /[0-9]/.test(p)],
];

export default function Register() {
  useDocumentTitle("Create account");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, control, setError, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { password: "", terms: false } });
  const password = useWatch({ control, name: "password" }) ?? "";

  const mutation = useMutation({
    mutationFn: ({ terms: _terms, ...values }) => post("/auth/register", values),
    onSuccess: (res) => { login(res.data); toast.success(res.message); navigate("/dashboard", { replace: true }); },
    onError: (err) => {
      Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m }));
      setServerError(errorMessage(err));
    },
  });

  return (
    <AuthShell title="Create your" accent="account" subtitle="Order from local kitchens, save addresses and list your own restaurant."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">Log in</Link></>}>
      <form onSubmit={handleSubmit((v) => { setServerError(""); mutation.mutate(v); })} noValidate className="space-y-4">
        <Alert>{serverError}</Alert>
        <Input label="Full name" autoComplete="name" required error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" autoComplete="email" required error={errors.email?.message} {...register("email")} />
        <Input label="Password" type="password" autoComplete="new-password" required error={errors.password?.message} {...register("password")} />
        <ul className="grid grid-cols-2 gap-1 text-xs" aria-label="Password requirements">
          {RULES.map(([label, test]) => {
            const ok = test(password);
            return <li key={label} className={cn("flex items-center gap-1", ok ? "text-success-600 dark:text-success-400" : "text-muted")}>{ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}{label}</li>;
          })}
        </ul>
        <Input label="Confirm password" type="password" autoComplete="new-password" required error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        <Checkbox label={<>I agree to the <Link to="/terms" className="text-brand-600 underline dark:text-brand-300">Terms</Link> and <Link to="/privacy" className="text-brand-600 underline dark:text-brand-300">Privacy Policy</Link></>} error={errors.terms?.message} {...register("terms")} />
        <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>Create account</Button>
      </form>
    </AuthShell>
  );
}
