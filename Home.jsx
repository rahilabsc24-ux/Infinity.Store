import { Link } from "react-router-dom";
import { ArrowRight, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { Hero } from "../components/Hero.jsx";
import { CategoryCard } from "../components/CategoryCard.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { Loader } from "../components/ui/Loader.jsx";
import { ErrorBox } from "../components/ui/ErrorBox.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { api } from "../lib/api.js";
import { categories } from "../lib/constants.js";

const categoryImages = {
  dresses: "/products/evening-gown.png",
  gadgets: "/products/smart-watch.png",
  accessories: "/products/crossbody-bag.png",
};

const perks = [
  { icon: Truck, title: "Free shipping", desc: "On orders over $50" },
  { icon: RefreshCw, title: "30-day returns", desc: "Hassle-free refunds" },
  { icon: ShieldCheck, title: "Secure checkout", desc: "Your data is protected" },
];

export default function Home() {
  const { data: products, loading, error } = useAsync(() => api("/products", { auth: false }), []);

  return (
    <main>
      <Hero />

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground">
                <perk.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{perk.title}</p>
                <p className="text-xs text-muted-foreground">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Shop by category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} label={c.label} blurb={c.blurb} image={categoryImages[c.slug]} />
          ))}
        </div>
      </section>

      {loading && <Loader label="Loading products…" />}
      {error && <div className="mx-auto max-w-7xl px-4 py-8"><ErrorBox message={error} /></div>}

      {products && (
        <>
          <section className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Bestsellers</h2>
              <Link to="/products" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.filter((p) => p.badge === "Bestseller").map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>

          {categories.map((c) => (
            <section key={c.slug} className="mx-auto max-w-7xl px-4 py-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{c.label}</h2>
                  <p className="text-sm text-muted-foreground">{c.blurb}</p>
                </div>
                <Link to={`/products?category=${c.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                  View all <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.filter((p) => p.category === c.slug).slice(0, 4).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  );
}
