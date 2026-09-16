import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/catalog";

/**
 * Saved (admin-managed) affiliate URLs, keyed by product id.
 * Falls back to the catalog value when nothing is saved yet.
 */
const AffiliateLinksContext = createContext<Record<string, string>>({});
/** Saved (admin-uploaded) product image URLs, keyed by product id. */
const ProductImagesContext = createContext<Record<string, string>>({});

export const PRODUCT_IMAGE_BUCKET = "product-images";

export function AffiliateLinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    void supabase
      .from("product_links")
      .select("product_id, affiliate_url, image_path")
      .then(async ({ data }) => {
        if (!active || !data) return;
        const map: Record<string, string> = {};
        for (const row of data) map[row.product_id] = row.affiliate_url ?? "";
        setLinks(map);

        const withImages = data.filter((row) => !!row.image_path);
        if (!withImages.length) return;
        const { data: signed } = await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .createSignedUrls(
            withImages.map((row) => row.image_path as string),
            60 * 60 * 24 * 7,
          );
        if (!active || !signed) return;
        const imageMap: Record<string, string> = {};
        withImages.forEach((row, i) => {
          const url = signed[i]?.signedUrl;
          if (url) imageMap[row.product_id] = url;
        });
        setImages(imageMap);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AffiliateLinksContext.Provider value={links}>
      <ProductImagesContext.Provider value={images}>{children}</ProductImagesContext.Provider>
    </AffiliateLinksContext.Provider>
  );
}

export function isValidAffiliateUrl(url: string): boolean {
  return /^https?:\/\//.test(url.trim());
}

/** Resolved affiliate URL for a product: saved link wins, catalog value is the fallback. */
export function useAffiliateUrl(product: Product): string {
  const links = useContext(AffiliateLinksContext);
  return useMemo(() => {
    const saved = links[product.id];
    if (saved && isValidAffiliateUrl(saved)) return saved.trim();
    return isValidAffiliateUrl(product.affiliateUrl) ? product.affiliateUrl : "";
  }, [links, product]);
}

/** Resolved product photo: an uploaded image wins, the catalog image is the fallback. */
export function useProductImage(product: Product): string {
  const images = useContext(ProductImagesContext);
  return images[product.id] || product.image;
}

export function useAllAffiliateLinks() {
  const links = useContext(AffiliateLinksContext);
  const get = useCallback((id: string) => links[id] ?? "", [links]);
  return { links, get };
}
