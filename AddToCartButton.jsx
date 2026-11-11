import { useEffect, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { cn } from "../lib/utils.js";

export function AddToCartButton({ product, quantity = 1, size = "lg", className }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product, quantity);
        setAdded(true);
      }}
      className={cn("btn btn-cta", size === "lg" ? "px-6" : "h-9 px-4", className)}
    >
      {added ? (
        <>
          <Check className="size-4" /> Added
        </>
      ) : (
        <>
          <ShoppingCart className="size-4" /> Add to cart
        </>
      )}
    </button>
  );
}
