import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const CartContext = createContext(null);
const KEY = "fooddash-cart";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? { restaurant: null, items: [] }; } catch { return { restaurant: null, items: [] }; }
};

/** A cart holds dishes from a single restaurant (one order = one kitchen). */
export function CartProvider({ children }) {
  const [cart, setCart] = useState(read);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ }
  }, [cart]);

  const addItem = useCallback((restaurant, item) => {
    setCart((c) => {
      const sameRestaurant = c.restaurant?.id === restaurant.id;
      const items = sameRestaurant ? [...c.items] : [];
      const existing = items.find((i) => i.id === item.id);
      if (existing) existing.quantity = Math.min(20, existing.quantity + 1);
      else items.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
      const { id, name, slug, deliveryFee, minOrder, images } = restaurant;
      return { restaurant: { id, name, slug, deliveryFee, minOrder, image: images?.[0] }, items: items.map((i) => ({ ...i })) };
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setCart((c) => {
      const items = c.items.map((i) => (i.id === id ? { ...i, quantity } : i)).filter((i) => i.quantity > 0);
      return items.length ? { ...c, items } : { restaurant: null, items: [] };
    });
  }, []);

  const clear = useCallback(() => setCart({ restaurant: null, items: [] }), []);

  const value = useMemo(() => {
    const count = cart.items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = cart.restaurant?.deliveryFee ?? 0;
    return { ...cart, count, subtotal, deliveryFee, total: subtotal + (count ? deliveryFee : 0), addItem, updateQuantity, clear };
  }, [cart, addItem, updateQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
