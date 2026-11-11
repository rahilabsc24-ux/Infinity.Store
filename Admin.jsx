import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Field } from "../components/ui/Field.jsx";
import { ErrorBox } from "../components/ui/ErrorBox.jsx";
import { Loader } from "../components/ui/Loader.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { api } from "../lib/api.js";
import { categories, ORDER_STATUSES } from "../lib/constants.js";
import { formatDate, formatPrice } from "../lib/format.js";
import { cn } from "../lib/utils.js";

const TABS = ["orders", "products"];

export default function Admin() {
  const [tab, setTab] = useState("orders");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin dashboard</h1>

      <div className="mt-6 flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium capitalize transition-colors",
              tab === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">{tab === "orders" ? <OrdersAdmin /> : <ProductsAdmin />}</div>
    </main>
  );
}

function OrdersAdmin() {
  const [version, setVersion] = useState(0);
  const { data: orders, loading, error } = useAsync(() => api("/orders"), [version]);
  const [actionError, setActionError] = useState("");

  async function updateStatus(id, status) {
    setActionError("");
    try {
      await api(`/orders/${id}/status`, { method: "PATCH", body: { status } });
      setVersion((v) => v + 1);
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading) return <Loader label="Loading orders…" />;
  if (error) return <ErrorBox message={error} />;
  if (orders.length === 0) return <p className="text-muted-foreground">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {actionError && <ErrorBox message={actionError} />}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-medium text-foreground">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <div className="text-foreground">{o.user?.name ?? "Deleted user"}</div>
                  <div className="text-xs text-muted-foreground">{o.user?.email}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="h-9 rounded-lg border border-border bg-background px-2 text-sm capitalize outline-none focus:ring-2 focus:ring-ring"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const emptyForm = {
  name: "",
  category: "dresses",
  price: "",
  stock: "50",
  image: "/products/",
  tagline: "",
  description: "",
  badge: "",
  features: "",
};

function ProductsAdmin() {
  const [version, setVersion] = useState(0);
  const { data: products, loading, error } = useAsync(() => api("/products", { auth: false }), [version]);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleCreate(e) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await api("/products", {
        method: "POST",
        body: {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
          badge: form.badge || undefined,
        },
      });
      setForm(emptyForm);
      setVersion((v) => v + 1);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setFormError("");
    try {
      await api(`/products/${product.id}`, { method: "DELETE" });
      setVersion((v) => v + 1);
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="card h-fit p-6 lg:col-span-1">
        <h2 className="text-lg font-semibold text-foreground">Add product</h2>
        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <Field id="p-name" label="Name" required value={form.name} onChange={set("name")} />
          <div>
            <label htmlFor="p-category" className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
            <select id="p-category" value={form.category} onChange={set("category")} className="input">
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field id="p-price" label="Price (USD)" type="number" min="0" step="0.01" required value={form.price} onChange={set("price")} />
            <Field id="p-stock" label="Stock" type="number" min="0" required value={form.stock} onChange={set("stock")} />
          </div>
          <Field id="p-image" label="Image path" placeholder="/products/your-file.png" value={form.image} onChange={set("image")} />
          <Field id="p-tagline" label="Tagline" value={form.tagline} onChange={set("tagline")} />
          <div>
            <label htmlFor="p-desc" className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
            <textarea id="p-desc" rows={3} value={form.description} onChange={set("description")} className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Field id="p-features" label="Features (comma separated)" value={form.features} onChange={set("features")} />
          <Field id="p-badge" label="Badge (optional)" placeholder="Bestseller" value={form.badge} onChange={set("badge")} />
          {formError && <ErrorBox message={formError} />}
          <button type="submit" disabled={saving} className="btn btn-brand w-full">
            {saving ? "Saving…" : "Add product"}
          </button>
        </form>
      </section>

      <section className="lg:col-span-2">
        {loading && <Loader label="Loading products…" />}
        {error && <ErrorBox message={error} />}
        {products && (
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="size-10 rounded-md bg-muted object-cover" />
                        <span className="font-medium text-foreground">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{p.category}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => handleDelete(p)} aria-label={`Delete ${p.name}`} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
