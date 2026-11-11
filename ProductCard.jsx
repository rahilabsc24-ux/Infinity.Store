import { Link } from "react-router-dom";
import { StarRating } from "./StarRating.jsx";
import { AddToCartButton } from "./AddToCartButton.jsx";
import { formatPrice } from "../lib/format.js";

export function ProductCard({ product }) {
  const href = `/products/${product.slug}`;
  return (
    <div className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={href} className="relative block aspect-square overflow-hidden bg-muted">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-brand-foreground">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={href} className="flex-1">
          <h3 className="line-clamp-1 font-medium text-foreground">{product.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{product.tagline}</p>
        </Link>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-lg font-semibold text-foreground">{formatPrice(product.price)}</span>
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </div>
  );
}
