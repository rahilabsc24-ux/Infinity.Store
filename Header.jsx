import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Infinity as InfinityIcon, Search, ShoppingCart, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { categories } from "../lib/constants.js";

function SearchForm({ id, placeholder, className = "" }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  function handleSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-full bg-brand-foreground px-4 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-cta"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1 flex size-8 items-center justify-center rounded-full bg-cta text-cta-foreground transition-colors hover:bg-cta/90"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}

export function Header() {
  const { totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 bg-brand text-brand-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <InfinityIcon className="size-7 text-cta" />
          <span className="text-xl font-bold tracking-tight">Infinity</span>
        </Link>

        <SearchForm id="site-search" placeholder="Search dresses, gadgets, accessories..." className="hidden flex-1 sm:block" />

        <nav className="ml-auto flex items-center gap-3 sm:ml-0 sm:gap-4">
          <div className="hidden items-center gap-4 lg:flex">
            {categories.map((c) => (
              <Link key={c.slug} to={`/products?category=${c.slug}`} className="text-sm font-medium text-brand-foreground/80 transition-colors hover:text-cta">
                {c.label}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-1">
              <Link to="/orders" title="My orders" className="rounded-full p-1.5 transition-colors hover:text-cta">
                <Package className="size-5" />
                <span className="sr-only">My orders</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" title="Admin" className="rounded-full p-1.5 transition-colors hover:text-cta">
                  <LayoutDashboard className="size-5" />
                  <span className="sr-only">Admin</span>
                </Link>
              )}
              <button type="button" onClick={handleLogout} title="Sign out" className="rounded-full p-1.5 transition-colors hover:text-cta">
                <LogOut className="size-5" />
                <span className="sr-only">Sign out</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="rounded-full px-2 py-1.5 text-sm font-medium transition-colors hover:text-cta">
              Sign in
            </Link>
          )}

          <Link to="/cart" className="relative flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-medium transition-colors hover:text-cta">
            <span className="relative">
              <ShoppingCart className="size-6" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center rounded-full bg-cta px-1 text-xs font-bold text-cta-foreground">
                  {totalItems}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-brand-foreground/10 sm:hidden">
        <div className="px-4 py-2">
          <SearchForm id="site-search-mobile" placeholder="Search products..." />
        </div>
      </div>
    </header>
  );
}
