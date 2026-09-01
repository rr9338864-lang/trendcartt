export function AffiliateNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-ink-muted ${className}`}>
      Prices and availability may change. Check the retailer for the latest information. TrendCart
      may earn a commission on qualifying purchases made through our links.
    </p>
  );
}
