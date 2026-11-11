import { createContext, useContext, useEffect, useMemo, useState } from "react";

// The cart lives in the browser. Prices are re-validated by the server at checkout.
const STORAGE_KEY = "infinity-cart";
const CartContext = createContext(null);

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or disabled: cart still works for this session
    }
  }, [items]);

  const value = useMemo(() => {
    const addItem = (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.slug === product.slug);
        if (existing) {
          return prev.map((i) => (i.slug === product.slug ? { ...i, quantity: Math.min(10, i.quantity + quantity) } : i));
        }
        return [
          ...prev,
          { slug: product.slug, name: product.name, price: product.price, image: product.image, quantity },
        ];
      });
    };

    const updateQuantity = (slug, quantity) =>
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.slug !== slug)
          : prev.map((i) => (i.slug === slug ? { ...i, quantity: Math.min(10, quantity) } : i)),
      );

    const removeItem = (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug));
    const clear = () => setItems([]);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;

    return { items, addItem, updateQuantity, removeItem, clear, totalItems, subtotal };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
