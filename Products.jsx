import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.jsx";
import { ProductFilters } from "../components/ProductFilters.jsx";
import { Loader } from "../components/ui/Loader.jsx";
import { ErrorBox } from "../components/ui/ErrorBox.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { api } from "../lib/api.js";
import { categories } from "../lib/constants.js";

export default function Products() {
  const [params] = useSearchParams();
  const category = params.get("category") ?? "";
  const q = (params.get("q") ?? "").trim();
  const sort = params.get("sort") ?? "featured";

  // The server does the filtering/sorting; the URL is the single source of truth
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (q) query.set("q", q);
  query.set("sort", sort);
  const qs = query.toString();

  const { data: products, loading, error } = useAsync(() => api(`/products?${qs}`, { auth: false }), [qs]);

  const heading = category
    ? categories.find((c) => c.slug === category)?.label ?? "Products"
    : q
      ? `Results for "${q}"`
      : "All products";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{heading}</h1>
        {products && (
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      <ProductFilters />

      {loading && <Loader label="Loading products…" />}
      {error && <div className="mt-8"><ErrorBox message={error} /></div>}

      {products && products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      {products && products.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-foreground">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search or browse all categories.</p>
        </div>
      )}
    </main>
  );
}
