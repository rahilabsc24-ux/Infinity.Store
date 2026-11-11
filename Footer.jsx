import { Link } from "react-router-dom";
import { Infinity as InfinityIcon } from "lucide-react";
import { categories } from "../lib/constants.js";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <InfinityIcon className="size-6 text-cta" />
            <span className="text-xl font-bold tracking-tight">Infinity</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-brand-foreground/70">
            Endless style, smart tech, and standout accessories — all in one place.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-foreground/70">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/products?category=${c.slug}`} className="hover:text-cta">
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/products" className="hover:text-cta">
                All products
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-foreground/70">
            <li><Link to="/orders" className="hover:text-cta">My orders</Link></li>
            <li><Link to="/cart" className="hover:text-cta">Cart</Link></li>
            <li><Link to="/login" className="hover:text-cta">Sign in</Link></li>
            <li><Link to="/register" className="hover:text-cta">Create account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-foreground/70">
            <li>About Infinity</li>
            <li>Careers</li>
            <li>Privacy policy</li>
            <li>Terms of service</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-foreground/10 py-5 text-center text-xs text-brand-foreground/60">
        © {new Date().getFullYear()} Infinity. A demo storefront — MERN stack.
      </div>
    </footer>
  );
}
