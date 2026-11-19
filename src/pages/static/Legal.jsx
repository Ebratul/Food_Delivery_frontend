import PageHeader from "../../components/layout/PageHeader.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

const UPDATED = "19 November 2026";

const PRIVACY = [
  ["Information we collect", "When you create an account we store your name, email address and a securely hashed password. If you add them, we also store your phone number, delivery address, city, short bio and profile photo. When you order, we store the items, prices, delivery address and payment method you selected."],
  ["How we use it", "We use your information to deliver orders, show your order history, let restaurants prepare your food and contact you about an order. We send the weekly newsletter only if you subscribe, and every email includes a way to unsubscribe."],
  ["What restaurants see", "Partner restaurants see the dishes you ordered, your delivery address, phone number and any note you add. They do not see your password or your orders from other restaurants."],
  ["Security", "Passwords are hashed with bcrypt and never stored in plain text. Sessions use signed tokens that expire automatically. Access to administrative tools is restricted to authorised staff."],
  ["Your choices", "You can update your profile at any time from your dashboard. To delete your account and associated data, contact support@fooddash.app and we will complete the request within 30 days."],
  ["Contact", "Questions about this policy can be sent to privacy@fooddash.app or through our Contact page."],
];

const TERMS = [
  ["Using FoodDash", "You must provide accurate information when creating an account and placing orders. You are responsible for keeping your password confidential and for activity on your account."],
  ["Orders and pricing", "Prices, delivery fees and minimum order values are set by each restaurant and confirmed when you place an order. Orders can be cancelled by the customer while they are still pending."],
  ["Restaurant listings", "Restaurant owners are responsible for the accuracy of their menus, photos, prices and opening hours. FoodDash reviews new listings and may reject or suspend listings that are misleading or unsafe."],
  ["Reviews", "Reviews must reflect a genuine experience. We may remove reviews that are abusive, off-topic or posted by restaurant owners about their own kitchens."],
  ["Liability", "FoodDash connects customers with independent restaurants. Restaurants are responsible for the food they prepare; FoodDash is responsible for the platform and the support it provides."],
  ["Changes", "We may update these terms from time to time. Continued use of FoodDash after changes take effect means you accept the updated terms."],
];

function LegalPage({ title, accent, sections }) {
  useDocumentTitle(`${title} ${accent}`);
  return (
    <>
      <PageHeader title={title} accent={accent} description={`Last updated ${UPDATED}`} crumbs={[{ label: `${title} ${accent}` }]} />
      <section className="container-x section-y max-w-3xl">
        {sections.map(([h, p], i) => (
          <div key={h} className="mb-10">
            <h2 className="t-h3">{i + 1}. {h}</h2>
            <p className="mt-3 text-lg leading-8 text-muted">{p}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export const Privacy = () => <LegalPage title="Privacy" accent="Policy" sections={PRIVACY} />;
export const Terms = () => <LegalPage title="Terms &" accent="Conditions" sections={TERMS} />;
