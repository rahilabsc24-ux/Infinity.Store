import { Link, useSearchParams } from "react-router-dom";
import { categories, sortOptions } from "../lib/constants.js";
import { cn } from "../lib/utils.js";

const pill = "rounded-full px-4 py-1.5 text-sm font-medium transition-colors";

export function ProductFilters() {
  const [params, setParams] = useSearchParams();
  const active = params.get("category") ?? "";
  const sort = params.get("sort") ?? "featured";

  function hrefFor(category) {
    const next = new URLSearchParams(params);
    if (category) next.set("category", category);
    else next.delete("category");
    return `/products?${next.toString()}`;
  }

  function handleSort(e) {
    const next = new URLSearchParams(params);
    next.set("sort", e.target.value);
    setParams(next);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Link
          to={hrefFor("")}
          className={cn(pill, !active ? "bg-brand text-brand-foreground" : "bg-secondary text-foreground hover:bg-muted")}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            to={hrefFor(c.slug)}
            className={cn(
              pill,
              active === c.slug ? "bg-brand text-brand-foreground" : "bg-secondary text-foreground hover:bg-muted",
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-muted-foreground">
          Sort
        </label>
        <select
          id="sort"
          value={sort}
          onChange={handleSort}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
