import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../components/layout/PageHeader.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { Input, Select, Textarea } from "../components/ui/Field.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useCart } from "../hooks/useCart.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { errorMessage, fieldErrors, post } from "../lib/api.js";
import { formatPrice, thumb } from "../lib/utils.js";
import { checkoutSchema } from "../lib/validation.js";

function CheckoutForm() {
  const cart = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    values: { deliveryAddress: user?.address ?? "", phone: user?.phone ?? "", note: "", paymentMethod: "CASH_ON_DELIVERY" },
  });
  const mutation = useMutation({
    mutationFn: (values) => post("/orders", { ...values, restaurantId: cart.restaurant.id, items: cart.items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })) }),
    onSuccess: (res) => {
      toast.success(res.message);
      cart.clear();
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate(`/dashboard/orders/${res.data.id}`);
    },
    onError: (err) => {
      Object.entries(fieldErrors(err)).forEach(([f, m]) => setError(f, { message: m }));
      setServerError(errorMessage(err));
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="surface rounded-[var(--radius-ui)] p-6">
        <h2 className="t-h4">Almost there</h2>
        <p className="mt-2 text-muted">Log in or create an account to place your order. Your cart will be waiting.</p>
        <div className="mt-6 flex gap-3"><Button to="/login" state={{ from: "/cart" }}>Log in</Button><Button to="/register" variant="outline">Create account</Button></div>
      </div>
    );
  }
  const belowMin = cart.subtotal < (cart.restaurant?.minOrder ?? 0);

  return (
    <form onSubmit={handleSubmit((v) => { setServerError(""); mutation.mutate(v); })} noValidate className="surface space-y-4 rounded-[var(--radius-ui)] p-6">
      <h2 className="t-h4">Delivery details</h2>
      <Alert>{serverError}</Alert>
      <Textarea label="Delivery address" required rows={3} autoComplete="street-address" error={errors.deliveryAddress?.message} {...register("deliveryAddress")} />
      <Input label="Phone number" required type="tel" autoComplete="tel" placeholder="+880 17xx-xxxxxx" error={errors.phone?.message} {...register("phone")} />
      <Select label="Payment method" required error={errors.paymentMethod?.message} {...register("paymentMethod")}>
        <option value="CASH_ON_DELIVERY">Cash on delivery</option>
        <option value="CARD">Card on delivery</option>
        <option value="MOBILE_WALLET">Mobile wallet (bKash / Nagad)</option>
      </Select>
      <Textarea label="Note for the kitchen" rows={2} placeholder="Less spicy, no onions…" error={errors.note?.message} {...register("note")} />
      {belowMin && <Alert>Minimum order for {cart.restaurant.name} is {formatPrice(cart.restaurant.minOrder)}. Add {formatPrice(cart.restaurant.minOrder - cart.subtotal)} more.</Alert>}
      <Button type="submit" size="lg" className="w-full" loading={mutation.isPending} disabled={belowMin}>Place order · {formatPrice(cart.total)}</Button>
    </form>
  );
}

export default function Cart() {
  useDocumentTitle("Your cart");
  const cart = useCart();

  return (
    <>
      <PageHeader title="Your" accent="Cart" crumbs={[{ label: "Cart" }]} />
      <section className="container-x section-y pt-12">
        {!cart.count ? (
          <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Browse restaurants and add a few dishes to get started." action={<Button to="/explore">Explore restaurants</Button>} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <div className="surface flex items-center gap-4 rounded-[var(--radius-ui)] p-4">
                <img src={thumb(cart.restaurant.image, "small")} alt="" className="h-14 w-14 rounded-[var(--radius-ui)] object-cover" />
                <div className="flex-1"><p className="text-sm text-muted">Ordering from</p><Link to={`/restaurants/${cart.restaurant.slug}`} className="t-h4 hover:text-brand-600">{cart.restaurant.name}</Link></div>
                <Button variant="ghost" size="sm" onClick={cart.clear}><Trash2 className="h-4 w-4" /> Clear</Button>
              </div>
              <ul className="surface divide-y divide-[var(--border)] rounded-[var(--radius-ui)]">
                {cart.items.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                    <img src={thumb(i.image, "small")} alt="" className="h-16 w-16 rounded-[var(--radius-ui)] object-cover" />
                    <div className="min-w-0 flex-1"><p className="font-semibold">{i.name}</p><p className="text-sm text-muted">{formatPrice(i.price)} each</p></div>
                    <div className="flex items-center gap-2" aria-label={`Quantity of ${i.name}`}>
                      <Button size="icon" variant="outline" onClick={() => cart.updateQuantity(i.id, i.quantity - 1)} aria-label={`Decrease ${i.name}`}><Minus className="h-4 w-4" /></Button>
                      <span className="w-8 text-center font-semibold" aria-live="polite">{i.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => cart.updateQuantity(i.id, Math.min(20, i.quantity + 1))} aria-label={`Increase ${i.name}`}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <p className="w-20 text-right font-semibold">{formatPrice(i.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>
              <dl className="surface space-y-2 rounded-[var(--radius-ui)] p-6">
                <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Delivery fee</dt><dd>{formatPrice(cart.deliveryFee)}</dd></div>
                <div className="flex justify-between border-t border-ui pt-2 text-lg font-bold"><dt>Total</dt><dd>{formatPrice(cart.total)}</dd></div>
                <p className="pt-2 text-xs text-muted">Final prices are confirmed against the restaurant&apos;s live menu when you place the order.</p>
              </dl>
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start"><CheckoutForm /></div>
          </div>
        )}
      </section>
    </>
  );
}
