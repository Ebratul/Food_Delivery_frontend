import { useCallback, useId, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside.js";
import { cn } from "../../lib/utils.js";

/** Accessible dropdown: trigger(open, props) renders the button; children(close) renders the menu. */
export default function Dropdown({ trigger, children, align = "right", className, panelClassName }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuId = useId();
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const onKeyDown = (e) => {
    if (!open) return;
    const items = [...ref.current.querySelectorAll('[role="menuitem"]')];
    const i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
  };

  return (
    <div ref={ref} className={cn("relative", className)} onKeyDown={onKeyDown}>
      {trigger(open, { "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": menuId, onClick: () => setOpen((o) => !o) })}
      {open && (
        <div
          id={menuId} role="menu"
          className={cn("surface absolute top-full z-50 mt-2 rounded-[var(--radius-ui)] p-2 shadow-xl animate-fade-up", align === "right" ? "right-0" : "left-0", panelClassName ?? "w-60")}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ as: Comp = "button", icon: Icon, className, children, ...props }) {
  return (
    <Comp role="menuitem" className={cn("flex w-full items-center gap-3 rounded-[var(--radius-ui)] px-3 py-2 text-left text-sm hover:bg-[var(--surface-2)] focus:bg-[var(--surface-2)] focus:outline-none", className)} {...props}>
      {Icon && <Icon className="h-4 w-4 text-muted" />}
      {children}
    </Comp>
  );
}
