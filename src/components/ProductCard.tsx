import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { BuyNowButton } from "@/components/BuyNowButton";
import type { Product } from "@/data/catalog";
import { StarRating } from "@/components/StarRating";
import { useStore, formatPrice } from "@/lib/store";
import { QuickView } from "@/components/QuickView";

const badgeTone: Record<string, string> = {
  "fitness-personal-care": "bg-mint text-brand-foreground",
  "fashion-lifestyle": "bg-gold text-brand-foreground",
  books: "bg-sky text-brand-foreground",
};

export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const { isWishlisted, toggleWishlist } = useStore();
  const [quickOpen, setQuickOpen] = useState(false);
  const saved = isWishlisted(product.id);

  return (
    <article
      className="group flex animate-rise flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-300 hover:border-brand/40"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            width={768}
            height={768}
            loading="lazy"
            className="aspect-square w-full bg-surface-2 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {product.discount > 0 && (
          <span
            className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold ${badgeTone[product.category]}`}
          >
            -{product.discount}%
          </span>
        )}
        {product.deal && product.dealLabel && (
          <span className="absolute bottom-2 left-2 rounded bg-background/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-gold">
            {product.dealLabel}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-background/70 text-foreground/70 transition-colors hover:text-brand"
        >
          <Heart size={15} className={saved ? "fill-brand text-brand" : ""} />
        </button>
      </div>

      <div className="flex grow flex-col p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          {product.brand}
        </p>
        <h3 className="mt-1 text-sm font-medium leading-tight text-foreground">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{product.description}</p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-2" />

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
          <span className="text-xs text-ink-muted line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        <div className="mt-3 flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            className="flex-1 rounded-lg border border-line py-2 text-xs font-semibold text-foreground transition-colors hover:border-brand/50 active:scale-[0.98]"
          >
            Quick View
          </button>
          <BuyNowButton
            product={product}
            iconSize={11}
            className="flex-1 py-2 text-xs active:scale-[0.98]"
          />
        </div>
      </div>

      <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </article>
  );
}
