import { useEffect } from "react";

/** Calls handler when a pointer down or Escape happens outside the referenced element. */
export function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    const onPointer = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(e); };
    const onKey = (e) => { if (e.key === "Escape") handler(e); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [ref, handler, enabled]);
}
