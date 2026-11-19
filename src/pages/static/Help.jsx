import { Bike, CreditCard, Store, UserCog } from "lucide-react";
import FaqList, { FAQS } from "../../components/FaqList.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

const TOPICS = [
  { icon: Bike, title: "Orders & delivery", text: "Track an order, cancel a pending order or report a missing item.", to: "/dashboard/orders" },
  { icon: CreditCard, title: "Payments", text: "Cash on delivery, cards and mobile wallets: how each works.", to: "/help#faq" },
  { icon: Store, title: "Restaurant partners", text: "List your kitchen, edit your menu and understand approvals.", to: "/dashboard/restaurants" },
  { icon: UserCog, title: "Account & security", text: "Update your profile, change your password or upload a photo.", to: "/dashboard/profile" },
];

const EXTRA = [
  ["I received the wrong item. What should I do?", "Open the order in your dashboard and use the Contact page with your order number. Our team will arrange a refund or replacement, usually the same day."],
  ["Why was my restaurant listing rejected?", "Listings are rejected when photos are missing, the address is incomplete or the menu does not match the cuisine. Edit the listing from your dashboard and it goes back into review automatically."],
];

export default function Help() {
  useDocumentTitle("Help center");
  return (
    <>
      <PageHeader title="How Can We" accent="Help?" description="Find quick answers or reach our support team. We're here every day from 9 AM to midnight." crumbs={[{ label: "Help center" }]} />
      <section className="container-x section-y">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t) => (
            <a key={t.title} href={t.to} className="surface group rounded-[var(--radius-ui)] p-6 transition-colors hover:border-brand-300">
              <t.icon className="h-8 w-8 text-brand-500" />
              <h2 className="t-h4 mt-4 group-hover:text-brand-600 dark:group-hover:text-brand-300">{t.title}</h2>
              <p className="mt-2 text-muted">{t.text}</p>
            </a>
          ))}
        </div>
        <div id="faq" className="mt-16 grid scroll-mt-24 gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="t-h2">Frequently asked <span className="accent-italic text-brand-500 dark:text-brand-300">questions</span></h2>
            <p className="mt-4 text-muted">Can&apos;t find what you need?</p>
            <Button to="/contact" className="mt-6">Contact support</Button>
          </div>
          <FaqList items={[...FAQS, ...EXTRA]} />
        </div>
      </section>
    </>
  );
}
