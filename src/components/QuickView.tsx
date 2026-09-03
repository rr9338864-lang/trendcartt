import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { BuyNowButton } from "@/components/BuyNowButton";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Product } from "@/data/catalog";
import { StarRating } from "@/components/StarRating";
import { useStore, formatPrice } from "@/lib/store";
import { AffiliateNote } from "@/components/AffiliateNote";

interface Props {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickView({ product, open, onOpenChange }: Props) {
  const { isWishlisted, toggleWishlist } = useStore();
  const saved = isWishlisted(product.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-line bg-surface p-0">
        <div className="grid gap-0 sm:grid-cols-2">
          <img
            src={product.image}
            alt={product.name}
            width={768}
            height={768}
            loading="lazy"
            className="aspect-square w-full rounded-t-lg object-cover sm:rounded-l-lg sm:rounded-tr-none"
          />
          <div className="p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
              {product.brand} · {product.subcategory}
            </p>
            <DialogTitle className="mt-2 font-display text-2xl tracking-tight text-foreground">
              {product.name}
            </DialogTitle>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-2" />
            <DialogDescription className="mt-3 text-sm text-ink-muted">
              {product.description}
            </DialogDescription>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-ink-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {product.discount > 0 && (
                <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-foreground">
                  -{product.discount}%
                </span>
              )}
            </div>

            <ul className="mt-4 space-y-1.5 text-xs text-ink-muted">
              {product.features.slice(0, 3).map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-mint">—</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <BuyNowButton product={product} className="px-4 py-2.5 text-xs" />
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-line px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-brand/50"
              >
                Full details
              </Link>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="grid size-10 place-items-center rounded-lg border border-line text-foreground transition-colors hover:border-brand/50"
                aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={15} className={saved ? "fill-brand text-brand" : ""} />
              </button>
            </div>

            <AffiliateNote className="mt-4" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
