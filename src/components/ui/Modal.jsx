import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils.js";

export default function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        className={cn("surface relative max-h-[90vh] w-full overflow-y-auto rounded-[var(--radius-ui)] shadow-2xl animate-fade-up focus:outline-none",
          { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size])}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ui p-6">
          <div>
            <h2 id={titleId} className="t-h4">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-[var(--radius-ui)] p-2 text-muted hover:bg-[var(--surface-2)]" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-ui p-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
