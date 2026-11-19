import { useMemo, useState } from "react";
import { Flame, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth.js";
import { useCart } from "../../hooks/useCart.js";
import { cn, formatPrice, thumb } from "../../lib/utils.js";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

export default function MenuSection({ restaurant }) {
  const { addItem, restaurant: cartRestaurant } = useCart();
  const { user } = useAuth();
  const sections = useMemo(() => {
    const map = new Map();
    for (const item of restaurant.menuItems) map.set(item.section, [...(map.get(item.section) ?? []), item]);
    return [...map.entries()];
  }, [restaurant.menuItems]);
  const [active, setActive] = useState("All");
  const isOwner = user && user.id === restaurant.ownerId;

  const onAdd = (item) => {
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) toast.info(`Started a new cart from ${restaurant.name}. Your previous cart was replaced.`);
    addItem(restaurant, item);
    toast.success(`${item.name} added to cart`);
  };

  const visible = active === "All" ? sections : sections.filter(([s]) => s === active);

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Menu sections">
        {["All", ...sections.map(([s]) => s)].map((s) => (
          <button key={s} type="button" role="tab" aria-selected={active === s} onClick={() => setActive(s)}
            className={cn("shrink-0 rounded-[var(--radius-ui)] border px-4 py-2 text-sm font-medium transition-colors", active === s ? "border-brand-500 bg-brand-500 text-white" : "border-ui hover:border-brand-300")}>
            {s}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-10">
        {visible.map(([section, items]) => (
          <div key={section}>
            <h3 className="t-h4">{section} <span className="text-base font-normal text-muted">({items.length})</span></h3>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <li key={item.id} className={cn("surface flex gap-4 rounded-[var(--radius-ui)] p-3", !item.isAvailable && "opacity-60")}>
                  <img src={thumb(item.image, "small")} alt="" loading="lazy" className="h-24 w-24 shrink-0 rounded-[var(--radius-ui)] object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display font-bold leading-6">{item.name}</h4>
                      <span className="shrink-0 font-semibold">{formatPrice(item.price)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex gap-2">
                        {item.isPopular && <Badge tone="accent"><Flame className="h-3 w-3" /> Popular</Badge>}
                        {!item.isAvailable && <Badge>Sold out</Badge>}
                      </div>
                      {!isOwner && (
                        <Button size="sm" variant="outline" disabled={!item.isAvailable} onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`}>
                          <Plus className="h-4 w-4" /> Add
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
