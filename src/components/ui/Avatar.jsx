import { cn, imageSrc, initials } from "../../lib/utils.js";

export default function Avatar({ user, size = "h-10 w-10", className }) {
  if (user?.avatar) {
    return <img src={imageSrc(user.avatar)} alt={user.name} className={cn(size, "shrink-0 rounded-full object-cover", className)} loading="lazy" />;
  }
  return (
    <span className={cn(size, "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200", className)} aria-hidden="true">
      {initials(user?.name)}
    </span>
  );
}
