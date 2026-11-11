import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const heroImages = [
  { src: "/products/floral-maxi-dress.png", alt: "Floral maxi dress", className: "aspect-[3/4]" },
  { src: "/products/headphones.png", alt: "Wireless headphones", className: "aspect-square" },
  { src: "/products/crossbody-bag.png", alt: "Leather crossbody bag", className: "aspect-square" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 lg:grid-cols-2 lg:py-20">
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full bg-brand-foreground/10 px-3 py-1 text-xs font-medium text-cta">
            New season, endless style
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Everything you love, to infinity.
          </h1>
          <p className="mt-4 text-pretty text-base text-brand-foreground/75 sm:text-lg">
            Discover curated dresses, smart gadgets, and standout accessories — quality picks at prices that make sense.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn btn-cta h-12 px-7">
              Shop all products
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/products?category=dresses" className="btn btn-outline-light h-12 px-7">
              Explore dresses
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-foreground/5">
            <img src={heroImages[0].src} alt={heroImages[0].alt} className="size-full object-cover" />
          </div>
          <div className="mt-8 grid gap-4">
            {heroImages.slice(1).map((img) => (
              <div key={img.src} className="relative aspect-square overflow-hidden rounded-2xl bg-brand-foreground/5">
                <img src={img.src} alt={img.alt} className="size-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
