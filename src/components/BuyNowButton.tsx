import { ExternalLink, Lock } from "lucide-react";
import type { Product } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { useAffiliateUrl } from "@/lib/affiliate-links";

interface Props {
  product: Product;
  className?: string;
  iconSize?: number;
  label?: string;
}

/**
 * Renders the product-specific affiliate CTA.
 * When a product has no affiliate URL configured yet, the button is disabled
 * instead of pointing anywhere fake.
 */
export function BuyNowButton({ product, className = "", iconSize = 12, label = "Buy Now" }: Props) {
  const { addToCart } = useStore();
  const affiliateUrl = useAffiliateUrl(product);

  if (!affiliateUrl) {
    return (
      <button
        type="button"
        disabled
        title="Affiliate link not configured yet"
        className={`inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-line bg-surface-2 font-semibold text-ink-muted opacity-70 ${className}`}
      >
        Link coming soon <Lock size={iconSize} />
      </button>
    );
  }

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => addToCart(product)}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand font-semibold text-brand-foreground transition-colors hover:bg-brand/90 ${className}`}
    >
      {label} <ExternalLink size={iconSize} />
    </a>
  );
}
