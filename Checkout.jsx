import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { Field } from "../components/ui/Field.jsx";
import { ErrorBox } from "../components/ui/ErrorBox.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import { formatPrice } from "../lib/format.js";
import { getTotals } from "../lib/pricing.js";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const { shipping, tax, total } = getTotals(subtotal);

  const [firstName, lastName] = [user?.name?.split(" ")[0] ?? "", user?.name?.split(" ").slice(1).join(" ") ?? ""];
  const [form, setForm] = useState({
    email: user?.email ?? "",
    firstName,
    lastName,
    address: "",
    city: "",
    zip: "",
    card: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // Send only product slugs and quantities; the server prices the order
      const created = await api("/orders", {
        method: "POST",
        body: {
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            address: form.address,
            city: form.city,
            zip: form.zip,
          },
          // Demo payment: never send full card numbers to the API
          cardLast4: form.card.replace(/\D/g, "").slice(-4),
        },
      });
      setOrder(created);
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand/10">
          <CheckCircle2 className="size-9 text-brand" />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-foreground">Order confirmed</h1>
        <p className="mt-2 text-muted-foreground">
          Thanks for shopping with Infinity. Your order{" "}
          <span className="font-semibold text-foreground">{order.orderNumber}</span> for{" "}
          <span className="font-semibold text-foreground">{formatPrice(order.total)}</span> has been placed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/orders" className="btn btn-outline">View my orders</Link>
          <Link to="/products" className="btn btn-brand">
            Continue shopping <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some items before heading to checkout.</p>
        <Link to="/products" className="btn btn-brand mt-6">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Checkout</h1>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-cta/40 bg-cta/10 p-3 text-sm text-foreground">
        <Lock className="mt-0.5 size-4 shrink-0" />
        <p>This is a demo checkout. No real payment is processed; only the last four card digits are stored.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-foreground">Contact & shipping</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field id="email" label="Email" type="email" placeholder="you@example.com" required value={form.email} onChange={set("email")} className="sm:col-span-2" />
              <Field id="firstName" label="First name" placeholder="Jane" required value={form.firstName} onChange={set("firstName")} />
              <Field id="lastName" label="Last name" placeholder="Doe" required value={form.lastName} onChange={set("lastName")} />
              <Field id="address" label="Address" placeholder="123 Main St" required value={form.address} onChange={set("address")} className="sm:col-span-2" />
              <Field id="city" label="City" placeholder="New York" required value={form.city} onChange={set("city")} />
              <Field id="zip" label="ZIP / Postal code" placeholder="10001" required value={form.zip} onChange={set("zip")} />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-semibold text-foreground">Payment</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field id="card" label="Card number" placeholder="4242 4242 4242 4242" inputMode="numeric" required value={form.card} onChange={set("card")} className="sm:col-span-2" />
              <Field id="expiry" label="Expiry" placeholder="MM / YY" required />
              <Field id="cvc" label="CVC" placeholder="123" inputMode="numeric" required />
            </div>
          </section>
        </div>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-semibold text-foreground">Your order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img src={item.image} alt="" className="size-full object-cover" />
                  <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-brand-foreground">
                    {item.quantity}
                  </span>
                </div>
                <span className="line-clamp-2 flex-1 text-sm text-foreground">{item.name}</span>
                <span className="text-sm font-medium text-foreground">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>{formatPrice(tax)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-base">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="font-bold text-foreground">{formatPrice(total)}</dd>
            </div>
          </dl>

          {error && <div className="mt-4"><ErrorBox message={error} /></div>}

          <button type="submit" disabled={submitting} className="btn btn-cta mt-6 w-full">
            {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
        </aside>
      </form>
    </main>
  );
}
