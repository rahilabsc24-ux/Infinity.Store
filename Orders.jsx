import { Link } from "react-router-dom";
import { Loader } from "../components/ui/Loader.jsx";
import { ErrorBox } from "../components/ui/ErrorBox.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { api } from "../lib/api.js";
import { formatDate, formatPrice } from "../lib/format.js";
import { statusStyles } from "../lib/constants.js";
import { cn } from "../lib/utils.js";

export default function Orders() {
  const { data: orders, loading, error } = useAsync(() => api("/orders/mine"), []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">My orders</h1>

      {loading && <Loader label="Loading orders…" />}
      {error && <div className="mt-6"><ErrorBox message={error} /></div>}

      {orders && orders.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-foreground">No orders yet</p>
          <Link to="/products" className="btn btn-brand mt-6">Start shopping</Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders?.map((order) => (
          <article key={order.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold capitalize", statusStyles[order.status])}>
                {order.status}
              </span>
            </div>

            <ul className="mt-4 divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.slug} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-foreground">
                    {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">Total (incl. tax & shipping)</span>
              <span className="font-bold text-foreground">{formatPrice(order.total)}</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
