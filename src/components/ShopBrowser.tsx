import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { categories, products, sortProducts, type SortKey } from "@/data/catalog";
import { ProductGrid, EmptyState } from "@/components/ProductGrid";

const sortChoices: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export function ShopBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p) => {
      const matchesCat = category === "all" || p.category === category;
      const matchesQuery =
        !q || [p.name, p.brand, p.subcategory].join(" ").toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
    return sortProducts(filtered, sort);
  }, [query, category, sort]);

  const dirty = query !== "" || category !== "all" || sort !== "featured";

  const clear = () => {
    setQuery("");
    setCategory("all");
    setSort("featured");
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative grow">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name…"
            aria-label="Search products"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-ink-muted focus:border-brand/50 focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-foreground focus:border-brand/50 focus:outline-none"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort products"
          className="rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-foreground focus:border-brand/50 focus:outline-none"
        >
          {sortChoices.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {dirty && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2.5 text-xs font-semibold text-ink-muted transition-colors hover:border-brand/50 hover:text-foreground"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        {results.length} product{results.length === 1 ? "" : "s"}
      </p>

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <EmptyState
          title="No matches"
          message="Try a different search term or clear the filters to see everything."
        />
      )}
    </div>
  );
}
