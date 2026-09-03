import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/catalog";

/**
 * Saved (admin-managed) affiliate URLs, keyed by product id.
 * Falls back to the catalog value when nothing is saved yet.
 */
const AffiliateLinksContext = createContext<Record<string, string>>({});

export function AffiliateLinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    void supabase
      .from("product_links")
      .select("product_id, affiliate_url")
      .then(({ data }) => {
        if (!active || !data) return;
        const map: Record<string, string> = {};
        for (const row of data) map[row.product_id] = row.affiliate_url ?? "";
        setLinks(map);
      });
    return () => {
      active = false;
    };
  }, []);

  return <AffiliateLinksContext.Provider value={links}>{children}</AffiliateLinksContext.Provider>;
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

export function useAllAffiliateLinks() {
  const links = useContext(AffiliateLinksContext);
  const get = useCallback((id: string) => links[id] ?? "", [links]);
  return { links, get };
}
