import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { getTotals } from "../lib/pricing.js";
import { formatPrice } from "../lib/format.js";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const navigate = useNavigate();
  const { shipping, tax, total } = getTotals(subtotal);

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse our collections and find something you love.</p>
        <Link to="/products" className="btn btn-brand mt-6">
          Start shopping <ArrowRight className="size-4" />
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Shopping cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{totalItems} items</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <ul className="divide-y divide-border rounded-xl border border-border lg:col-span-2">
          {items.map((item) => (
            <li key={item.slug} className="flex gap-4 p-4">
              <Link to={`/products/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={item.image} alt={item.name} className="size-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <Link to={`/products/${item.slug}`} className="font-medium text-foreground hover:underline">
                    {item.name}
                  </Link>
                  <span className="font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                </div>
                <span className="text-sm text-muted-foreground">{formatPrice(item.price)} each</span>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      className="flex size-8 items-center justify-center hover:bg-muted"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="flex size-8 items-center justify-center hover:bg-muted"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-semibold text-foreground">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            <Row label="Estimated tax" value={formatPrice(tax)} />
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="font-bold text-foreground">{formatPrice(total)}</dd>
            </div>
          </dl>
          <button type="button" onClick={() => navigate("/checkout")} className="btn btn-cta mt-6 w-full">
            Proceed to checkout
          </button>
          <Link to="/products" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
