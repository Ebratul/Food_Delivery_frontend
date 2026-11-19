import { cn } from "../../lib/utils.js";

export default function Card({ as: Comp = "div", className, children, padded = true, ...props }) {
  return (
    <Comp className={cn("surface rounded-[var(--radius-ui)]", padded && "p-6", className)} {...props}>
      {children}
    </Comp>
  );
}
