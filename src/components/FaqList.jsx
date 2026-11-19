import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils.js";

export const FAQS = [
  ["Where does FoodDash deliver?", "We currently deliver in Dhaka, Chattogram and Sylhet. Each restaurant sets its own delivery radius, and the Explore page only shows kitchens that serve your city."],
  ["How long does delivery take?", "Every restaurant shows an estimated range (for example 25–40 minutes) based on its preparation time. You can filter Explore by maximum delivery time."],
  ["Which payment methods are accepted?", "You can pay cash on delivery, by card or with a mobile wallet. Choose your method at checkout and it is saved on your order."],
  ["Can I cancel an order?", "Yes, while it is still Pending. Open the order in your dashboard and press Cancel. Once a restaurant confirms it, the kitchen has already started cooking."],
  ["How do I list my restaurant?", "Create a free account, open Dashboard → My Restaurants → Add restaurant and submit your details and photos. Our team reviews new listings within one working day."],
  ["Are reviews verified?", "Reviews can only be written by signed-in customers, one per restaurant, and are monitored by our team. Restaurant owners cannot review their own kitchens."],
];

export default function FaqList({ items = FAQS }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();
  return (
    <div className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-ui)] border border-ui bg-[var(--surface)]">
      {items.map(([q, a], i) => {
        const expanded = open === i;
        return (
          <div key={q}>
            <h3>
              <button type="button" onClick={() => setOpen(expanded ? -1 : i)} aria-expanded={expanded} aria-controls={`${baseId}-${i}`}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-bold">
                {q}
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-brand-500 transition-transform", expanded && "rotate-180")} />
              </button>
            </h3>
            <div id={`${baseId}-${i}`} role="region" hidden={!expanded} className="px-6 pb-6 text-muted">{a}</div>
          </div>
        );
      })}
    </div>
  );
}
