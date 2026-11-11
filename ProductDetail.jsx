import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { StarRating } from "../components/StarRating.jsx";
import { ProductBuyBox } from "../components/ProductBuyBox.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { Loader } from "../components/ui/Loader.jsx";
import { ErrorBox } from "../components/ui/ErrorBox.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { api } from "../lib/api.js";
import { categories } from "../lib/constants.js";
import { formatPrice } from "../lib/format.js";

export default function ProductDetail() {
  const { slug } = useParams();

  const { data: product, loading, error } = useAsync(() => api(`/products/${slug}`, { auth: false }), [slug]);

  const { data: sameCategory } = useAsync(
    () => (product ? api(`/products?category=${product.category}`, { auth: false }) : Promise.resolve([])),
    [product?.category],
  );

  if (loading) return <Loader label="Loading product…" />;
  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <ErrorBox message={error} />
        <Link to="/products" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
          Back to products
        </Link>
      </main>
    );
  }

  const categoryLabel = categories.find((c) => c.slug === product.category)?.label ?? product.category;
  const related = (sameCategory ?? []).filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-4" />
        <Link to={`/products?category=${product.category}`} className="hover:text-foreground">{categoryLabel}</Link>
        <ChevronRight className="size-4" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
          <img src={product.image} alt={product.name} className="size-full object-cover" />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{categoryLabel}</span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
          <div className="mt-2">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>
          <p className="mt-4 text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6 border-t border-border pt-6">
            <ProductBuyBox product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
