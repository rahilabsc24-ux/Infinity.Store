import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Check } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton.jsx";
import { useCart } from "../context/CartContext.jsx";

export function ProductBuyBox({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  function handleBuyNow() {
    addItem(product, quantity);
    navigate("/checkout");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <div className="flex items-center rounded-lg border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex size-9 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            className="flex size-9 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <AddToCartButton product={product} quantity={quantity} className="flex-1" />
        <button type="button" onClick={handleBuyNow} className="btn btn-brand flex-1">
          Buy now
        </button>
      </div>

      <ul className="mt-2 space-y-1.5">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-4 text-brand" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
