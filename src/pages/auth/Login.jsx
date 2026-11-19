import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Field.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { errorMessage, fieldErrors, post } from "../../lib/api.js";
import { loginSchema } from "../../lib/validation.js";
import AuthShell from "./AuthShell.jsx";

const DEMO = {
  user: { email: "user@fooddash.app", password: "User@1234" },
  admin: { email: "admin@fooddash.app", password: "Admin@1234" },
};

export default function Login() {
  useDocumentTitle("Log in");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: (values) => post("/auth/login", values),
    onSuccess: (res) => {
      login(res.data);
      toast.success(res.message);
      navigate(location.state?.from ?? "/dashboard", { replace: true });
    },
    onError: (err) => {
      Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m }));
      setServerError(errorMessage(err));
    },
  });

  const fillDemo = (role) => {
    setValue("email", DEMO[role].email, { shouldValidate: true });
    setValue("password", DEMO[role].password, { shouldValidate: true });
    setServerError("");
  };

  return (
    <AuthShell title="Welcome" accent="back" subtitle="Log in to order, track deliveries and manage your restaurants."
      footer={<>New to FoodDash? <Link to="/register" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">Create an account</Link></>}>
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => fillDemo("user")}><User className="h-4 w-4" /> Demo user</Button>
        <Button variant="outline" onClick={() => fillDemo("admin")}><ShieldCheck className="h-4 w-4" /> Demo admin</Button>
      </div>
      <form onSubmit={handleSubmit((v) => { setServerError(""); mutation.mutate(v); })} noValidate className="space-y-4">
        <Alert>{serverError}</Alert>
        <Input label="Email" type="email" autoComplete="email" required error={errors.email?.message} {...register("email")} />
        <div className="relative">
          <Input label="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" required error={errors.password?.message} inputClassName="pr-12" {...register("password")} />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-[38px] rounded-md p-1.5 text-muted hover:text-[var(--text)]" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>Log in</Button>
      </form>
    </AuthShell>
  );
}
