import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils.js";

const control =
  "w-full rounded-[var(--radius-ui)] border bg-[var(--surface)] px-4 text-[var(--text)] placeholder:text-[var(--text-muted)]/70 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:opacity-60";

function FieldShell({ id, label, error, hint, required, children, className }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label} {required && <span className="text-accent-600" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export const Input = forwardRef(function Input({ label, error, hint, required, className, inputClassName, id: idProp, leftIcon, ...props }, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <div className="relative">
        {leftIcon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">{leftIcon}</span>}
        <input
          ref={ref} id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error, hint)} aria-required={required || undefined}
          className={cn(control, "h-12", leftIcon && "pl-11", error ? "border-red-500" : "border-[var(--border)]", inputClassName)}
          {...props}
        />
      </div>
    </FieldShell>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, hint, required, className, id: idProp, rows = 5, ...props }, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        ref={ref} id={id} rows={rows} aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error, hint)}
        className={cn(control, "py-3 leading-6", error ? "border-red-500" : "border-[var(--border)]")}
        {...props}
      />
    </FieldShell>
  );
});

export const Select = forwardRef(function Select({ label, error, hint, required, className, id: idProp, children, ...props }, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <select
        ref={ref} id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error, hint)}
        className={cn(control, "h-12 cursor-pointer appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10", error ? "border-red-500" : "border-[var(--border)]")}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
});

export const Checkbox = forwardRef(function Checkbox({ label, error, className, id: idProp, ...props }, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm">
        <input ref={ref} id={id} type="checkbox" aria-invalid={Boolean(error)} className="mt-0.5 h-5 w-5 cursor-pointer rounded-md accent-brand-500" {...props} />
        <span>{label}</span>
      </label>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});
