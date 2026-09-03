import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { BuyNowButton } from "@/components/BuyNowButton";
import { getProduct, relatedProducts } from "@/data/catalog";
import { StarRating } from "@/components/StarRating";
import { AffiliateNote } from "@/components/AffiliateNote";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product, related: relatedProducts(product) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product unavailable — TrendCart" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — ${product.brand} | TrendCart`;
    const description = product.description.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product, related } = Route.useLoaderData();
  const { isWishlisted, toggleWishlist } = useStore();
  const saved = isWishlisted(product.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
        <Link to="/" className="hover:text-gold">
          Home
        </Link>
        <span className="px-2">/</span>
        <span>{getCategory(product.category)?.shortName ?? product.category}</span>
        <span className="px-2">/</span>
        <span className="text-foreground">{product.subcategory}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          width={768}
          height={768}
          className="aspect-square w-full rounded-xl border border-line bg-surface-2 object-cover"
        />

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground">
            {product.name}
          </h1>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-3" />
          <p className="mt-4 text-sm text-ink-muted">{product.description}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
            <span className="text-sm text-ink-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-foreground">
                -{product.discount}%
              </span>
            )}
          </div>

          <ul className="mt-5 space-y-1.5 text-sm text-ink-muted">
            {product.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-mint">—</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <BuyNowButton product={product} iconSize={13} className="px-5 py-3 text-sm" />
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              className="grid size-12 place-items-center rounded-lg border border-line text-foreground transition-colors hover:border-brand/50"
            >
              <Heart size={16} className={saved ? "fill-brand text-brand" : ""} />
            </button>
          </div>

          <AffiliateNote className="mt-5" />
        </div>
      </div>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-foreground">Specifications</h2>
          <dl className="mt-3 divide-y divide-line rounded-xl border border-line">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="text-right text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-xl text-foreground">Pros</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              {product.pros.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-mint">+</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl text-foreground">Cons</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              {product.cons.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-gold">−</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="You may also like" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 60} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
