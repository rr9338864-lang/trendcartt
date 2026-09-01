import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { getProductsByIds, type Product } from "@/data/catalog";

/**
 * Session shopping state (wishlist, cart, recently viewed).
 *
 * Persisted to localStorage today. When a backend is added, swap the
 * read/write helpers below for API calls — the component API stays the same.
 */

export interface CartLine {
  productId: string;
  quantity: number;
  variant?: string;
}

interface StoreValue {
  wishlist: string[];
  cart: CartLine[];
  recentlyViewed: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  addToCart: (product: Product, variant?: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  markViewed: (id: string) => void;
  cartCount: number;
  cartProducts: { product: Product; line: CartLine }[];
  cartSubtotal: number;
  cartSavings: number;
  hydrated: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const KEYS = {
  wishlist: "trendcart.wishlist",
  cart: "trendcart.cart",
  viewed: "trendcart.viewed",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — session-only state is acceptable */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWishlist(read<string[]>(KEYS.wishlist, []));
    setCart(read<CartLine[]>(KEYS.cart, []));
    setRecentlyViewed(read<string[]>(KEYS.viewed, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(KEYS.wishlist, wishlist);
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEYS.cart, cart);
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEYS.viewed, recentlyViewed);
  }, [recentlyViewed, hydrated]);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        toast(`Removed from wishlist`, { description: product.name });
        return prev.filter((id) => id !== product.id);
      }
      toast.success(`Saved to wishlist`, { description: product.name });
      return [product.id, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((x) => x !== id));
  }, []);

  const addToCart = useCallback((product: Product, variant?: string) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === product.id && l.variant === variant);
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, quantity: Math.min(l.quantity + 1, 99) } : l,
        );
      }
      return [...prev, { productId: product.id, quantity: 1, variant }];
    });
    toast.success("Added to cart", { description: product.name });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const markViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const cartProducts = cart
      .map((line) => {
        const product = getProductsByIds([line.productId])[0];
        return product ? { product, line } : null;
      })
      .filter((x): x is { product: Product; line: CartLine } => Boolean(x));

    return {
      wishlist,
      cart,
      recentlyViewed,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      markViewed,
      cartCount: cart.reduce((sum, l) => sum + l.quantity, 0),
      cartProducts,
      cartSubtotal: cartProducts.reduce((s, { product, line }) => s + product.price * line.quantity, 0),
      cartSavings: cartProducts.reduce(
        (s, { product, line }) => s + (product.originalPrice - product.price) * line.quantity,
        0,
      ),
      hydrated,
    };
  }, [
    wishlist,
    cart,
    recentlyViewed,
    hydrated,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    markViewed,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
