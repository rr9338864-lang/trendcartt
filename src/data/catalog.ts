/**
 * TrendCart demo catalog.
 *
 * Single source of truth for all product data in the storefront. Every UI
 * surface (home, category, product, deals, search, wishlist, cart) reads from
 * here, so a future admin dashboard / API only has to replace `products` with
 * remotely-fetched rows of the same `Product` shape.
 *
 * All entries below are illustrative demo data with placeholder affiliate URLs.
 */

export type CategorySlug = "fitness-personal-care" | "fashion-lifestyle" | "books";

export interface ProductVariant {
  /** e.g. "Size", "Colour", "Flavour" */
  label: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  subcategory: string;
  brand: string;
  /** primary image (imported asset URL) */
  image: string;
  /** additional gallery images */
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  pros: string[];
  cons: string[];
  price: number;
  originalPrice: number;
  /** whole-number percentage off */
  discount: number;
  rating: number;
  reviewCount: number;
  /** placeholder — swap for a real affiliate URL later */
  affiliateUrl: string;
  variants?: ProductVariant[];
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  deal: boolean;
  dealLabel?: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  blurb: string;
  image: string;
  accent: "mint" | "gold" | "sky";
  subcategories: string[];
}

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

import heroMarket from "@/assets/hero-market.jpg";
import catFitness from "@/assets/cat-fitness.jpg";
import catFashion from "@/assets/cat-fashion.jpg";
import catBooks from "@/assets/cat-books.jpg";
import promoBanner from "@/assets/promo-banner.jpg";

export const siteImages = {
  hero: heroMarket,
  promo: promoBanner,
  fitness: catFitness,
  fashion: catFashion,
  books: catBooks,
};

const productImages = import.meta.glob<string>("../assets/products/*.jpg", {
  eager: true,
  import: "default",
});

function img(slug: string): string {
  const match = productImages[`../assets/products/${slug}.jpg`];
  return match ?? promoBanner;
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export const categories: Category[] = [
  {
    slug: "fitness-personal-care",
    name: "Fitness & Personal Care",
    shortName: "Fitness",
    description: "Gear, grooming and daily rituals.",
    blurb:
      "Training equipment, nutrition, supplements and everyday grooming picks — chosen for people building consistent routines.",
    image: catFitness,
    accent: "mint",
    subcategories: [
      "Fitness Equipment",
      "Protein & Nutrition",
      "Supplements",
      "Grooming",
      "Skincare",
      "Hair Care",
      "Personal Care",
    ],
  },
  {
    slug: "fashion-lifestyle",
    name: "Fashion & Lifestyle",
    shortName: "Fashion",
    description: "Clothing, watches and everyday style.",
    blurb:
      "Wardrobe staples, footwear, watches and carry goods that hold up past one season, plus the small lifestyle upgrades around them.",
    image: catFashion,
    accent: "gold",
    subcategories: [
      "Men's Clothing",
      "Shoes",
      "Watches",
      "Bags",
      "Wallets",
      "Accessories",
      "Lifestyle",
    ],
  },
  {
    slug: "books",
    name: "Books",
    shortName: "Books",
    description: "Ideas worth carrying with you.",
    blurb:
      "Reading picks across self improvement, business, finance, technology, education and fiction.",
    image: catBooks,
    accent: "sky",
    subcategories: [
      "Self Improvement",
      "Business",
      "Finance",
      "Programming & Technology",
      "Education",
      "Fiction",
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

type ProductSeed = Omit<Product, "id" | "image" | "images" | "discount"> & {
  extraImages?: string[];
};

function build(seed: ProductSeed, index: number): Product {
  const discount =
    seed.originalPrice > seed.price
      ? Math.round(((seed.originalPrice - seed.price) / seed.originalPrice) * 100)
      : 0;
  const category = getCategory(seed.category);
  return {
    ...seed,
    id: `tc-${String(index + 1).padStart(3, "0")}`,
    image: img(seed.slug),
    images: [img(seed.slug), ...(seed.extraImages ?? []), category?.image ?? promoBanner],
    discount,
  };
}

const seeds: ProductSeed[] = [
  {
    name: "Adjustable Dumbbell Set",
    slug: "adjustable-dumbbell-set",
    category: "fitness-personal-care",
    subcategory: "Fitness Equipment",
    brand: "IronLane",
    description:
      "A space-saving pair of adjustable dumbbells that replaces a full rack for home training.",
    features: [
      "Dial-adjust from 2.5 kg to 24 kg per hand",
      "Knurled steel handle for a secure grip",
      "Compact storage cradle included",
      "Replaces roughly 15 fixed dumbbell pairs",
    ],
    specifications: {
      "Weight range": "2.5–24 kg per dumbbell",
      Material: "Cast iron plates, steel handle",
      Adjustment: "Dial system",
      "Box contents": "2 dumbbells, 2 cradles",
    },
    pros: ["Saves a lot of floor space", "Fast weight changes between sets"],
    cons: ["Heavier to move than fixed dumbbells", "Dial mechanism needs occasional cleaning"],
    price: 249,
    originalPrice: 329,
    rating: 4.6,
    reviewCount: 412,
    affiliateUrl: "",
    variants: [{ label: "Set", options: ["Single", "Pair"] }],
    featured: true,
    trending: true,
    bestSeller: true,
    deal: false,
  },
  {
    name: "Resistance Band Kit",
    slug: "resistance-band-kit",
    category: "fitness-personal-care",
    subcategory: "Fitness Equipment",
    brand: "IronLane",
    description: "Five layered-latex bands covering light activation through heavy pull work.",
    features: [
      "Five resistance levels, colour coded",
      "Layered latex construction",
      "Door anchor and carry pouch included",
    ],
    specifications: {
      Levels: "5 (5–35 kg equivalent)",
      Material: "Layered natural latex",
      Includes: "Door anchor, ankle straps, pouch",
    },
    pros: ["Travels easily", "Good entry point for home training"],
    cons: ["Bands wear over time with heavy use"],
    price: 34,
    originalPrice: 49,
    rating: 4.4,
    reviewCount: 1180,
    affiliateUrl: "",
    featured: false,
    trending: true,
    bestSeller: false,
    deal: true,
    dealLabel: "Starter pick",
  },
  {
    name: "PeakForm Whey — Vanilla",
    slug: "peakform-whey-vanilla",
    category: "fitness-personal-care",
    subcategory: "Protein & Nutrition",
    brand: "PeakForm",
    description: "A straightforward whey concentrate blend with a clean vanilla profile.",
    features: ["24 g protein per serving", "Mixes without clumping", "No added colours"],
    specifications: {
      "Serving size": "30 g scoop",
      Protein: "24 g per serving",
      Servings: "33 per tub",
      Flavour: "Vanilla",
    },
    pros: ["Mild, not overly sweet", "Good value per serving"],
    cons: ["Only three flavours available"],
    price: 42,
    originalPrice: 51,
    rating: 4.5,
    reviewCount: 3410,
    affiliateUrl: "",
    variants: [{ label: "Flavour", options: ["Vanilla", "Chocolate", "Unflavoured"] }],
    featured: true,
    trending: true,
    bestSeller: true,
    deal: false,
  },
  {
    name: "Daily Multivitamin Complex",
    slug: "daily-multivitamin",
    category: "fitness-personal-care",
    subcategory: "Supplements",
    brand: "Northbay Labs",
    description: "A once-daily multivitamin capsule covering common everyday micronutrients.",
    features: ["One capsule per day", "Vegetarian capsule shell", "90-day supply"],
    specifications: { Form: "Capsule", Supply: "90 days", Allergens: "None declared" },
    pros: ["Simple daily routine", "Long supply per bottle"],
    cons: ["Capsule is on the larger side"],
    price: 21,
    originalPrice: 28,
    rating: 4.3,
    reviewCount: 890,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: true,
    deal: true,
    dealLabel: "Everyday value",
  },
  {
    name: "Beard Trimmer Pro",
    slug: "beard-trimmer-pro",
    category: "fitness-personal-care",
    subcategory: "Grooming",
    brand: "Halden",
    description: "A cordless trimmer with fine length steps for maintaining a consistent beard.",
    features: ["0.5 mm length steps", "90-minute cordless runtime", "Washable blade head"],
    specifications: {
      Runtime: "90 minutes",
      Charging: "USB-C, 1.5 hours",
      "Length range": "0.5–20 mm",
    },
    pros: ["Precise short-length control", "Quick USB-C charging"],
    cons: ["No travel case in the box"],
    price: 59,
    originalPrice: 79,
    rating: 4.5,
    reviewCount: 742,
    affiliateUrl: "",
    featured: true,
    trending: false,
    bestSeller: false,
    deal: false,
  },
  {
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-serum",
    category: "fitness-personal-care",
    subcategory: "Skincare",
    brand: "Thrive Ritual",
    description: "A lightweight vitamin C serum for morning routines, in amber glass.",
    features: ["10% stabilised vitamin C", "Fragrance free", "Amber glass dropper bottle"],
    specifications: { Volume: "30 ml", "Skin type": "All", Use: "Morning" },
    pros: ["Absorbs quickly", "Layers well under sunscreen"],
    cons: ["Needs cool, dark storage"],
    price: 28,
    originalPrice: 38,
    rating: 4.4,
    reviewCount: 1560,
    affiliateUrl: "",
    featured: false,
    trending: true,
    bestSeller: false,
    deal: true,
    dealLabel: "Skincare deal",
  },
  {
    name: "Argan Hair Oil",
    slug: "argan-hair-oil",
    category: "fitness-personal-care",
    subcategory: "Hair Care",
    brand: "Thrive Ritual",
    description: "A light finishing oil for frizz control on dry or mid-length hair.",
    features: ["Cold-pressed argan base", "Non-greasy finish", "Dropper applicator"],
    specifications: { Volume: "50 ml", "Hair type": "Dry, frizz-prone" },
    pros: ["A little goes a long way", "Neutral scent"],
    cons: ["Can weigh down very fine hair"],
    price: 19,
    originalPrice: 26,
    rating: 4.2,
    reviewCount: 604,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: false,
    deal: false,
  },
  {
    name: "Insulated Steel Bottle 750 ml",
    slug: "insulated-steel-bottle",
    category: "fitness-personal-care",
    subcategory: "Personal Care",
    brand: "Meridian",
    description: "A double-walled steel bottle that holds temperature through a full day.",
    features: ["Double-wall vacuum insulation", "Leak-resistant cap", "Fits standard cup holders"],
    specifications: { Capacity: "750 ml", Material: "18/8 stainless steel", Weight: "340 g" },
    pros: ["Holds cold well past a workday", "No metallic aftertaste"],
    cons: ["Not dishwasher safe"],
    price: 32,
    originalPrice: 40,
    rating: 4.8,
    reviewCount: 2542,
    affiliateUrl: "",
    variants: [{ label: "Colour", options: ["Steel", "Matte Black", "Sand"] }],
    featured: true,
    trending: true,
    bestSeller: true,
    deal: false,
  },
  {
    name: "SilkRest Eye Mask",
    slug: "silkrest-eye-mask",
    category: "fitness-personal-care",
    subcategory: "Personal Care",
    brand: "SilkRest",
    description: "A mulberry silk sleep mask with an adjustable strap for travel and naps.",
    features: ["Mulberry silk shell", "Adjustable soft strap", "Comes with a travel pouch"],
    specifications: { Material: "22-momme mulberry silk", Weight: "38 g" },
    pros: ["Blocks light well", "Comfortable for side sleepers"],
    cons: ["Hand wash recommended"],
    price: 24,
    originalPrice: 38,
    rating: 4.6,
    reviewCount: 980,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: false,
    deal: true,
    dealLabel: "Deal of the day",
  },
  {
    name: "Merino Crew Sweater",
    slug: "merino-crew-sweater",
    category: "fashion-lifestyle",
    subcategory: "Men's Clothing",
    brand: "Northfold",
    description: "A mid-weight merino crew neck that works alone or as a layer.",
    features: ["100% extra-fine merino", "Ribbed cuffs and hem", "Machine washable on wool cycle"],
    specifications: { Material: "Extra-fine merino wool", Fit: "Regular", Care: "Wool cycle" },
    pros: ["Warm without bulk", "Holds shape after washing"],
    cons: ["Limited colour range"],
    price: 98,
    originalPrice: 140,
    rating: 4.7,
    reviewCount: 318,
    affiliateUrl: "",
    variants: [
      { label: "Size", options: ["S", "M", "L", "XL"] },
      { label: "Colour", options: ["Charcoal", "Navy", "Ecru"] },
    ],
    featured: true,
    trending: true,
    bestSeller: false,
    deal: true,
    dealLabel: "Seasonal pick",
  },
  {
    name: "Canvas Low Sneakers",
    slug: "canvas-low-sneakers",
    category: "fashion-lifestyle",
    subcategory: "Shoes",
    brand: "Corso",
    description: "Clean low-top canvas sneakers with a vulcanised rubber sole.",
    features: ["Heavy cotton canvas upper", "Vulcanised rubber outsole", "Removable insole"],
    specifications: { Upper: "Cotton canvas", Sole: "Vulcanised rubber", Fit: "True to size" },
    pros: ["Easy to pair with most outfits", "Comfortable straight out of the box"],
    cons: ["Canvas marks easily in wet weather"],
    price: 64,
    originalPrice: 85,
    rating: 4.3,
    reviewCount: 526,
    affiliateUrl: "",
    variants: [{ label: "Size", options: ["7", "8", "9", "10", "11"] }],
    featured: false,
    trending: true,
    bestSeller: false,
    deal: false,
  },
  {
    name: "Leather Chelsea Boots",
    slug: "leather-chelsea-boots",
    category: "fashion-lifestyle",
    subcategory: "Shoes",
    brand: "Corso",
    description: "Full-grain leather Chelsea boots on a stacked heel with elastic side panels.",
    features: ["Full-grain leather upper", "Goodyear-welted construction", "Elastic side gussets"],
    specifications: { Upper: "Full-grain leather", Construction: "Goodyear welt", Heel: "30 mm" },
    pros: ["Resoleable construction", "Leather softens with wear"],
    cons: ["Needs a short break-in period"],
    price: 189,
    originalPrice: 260,
    rating: 4.7,
    reviewCount: 214,
    affiliateUrl: "",
    variants: [{ label: "Size", options: ["7", "8", "9", "10", "11", "12"] }],
    featured: true,
    trending: false,
    bestSeller: true,
    deal: false,
  },
  {
    name: "Meridian Watch — Gold",
    slug: "meridian-gold-watch",
    category: "fashion-lifestyle",
    subcategory: "Watches",
    brand: "Meridian",
    description: "A slim dress watch with a champagne dial and quick-release leather strap.",
    features: ["38 mm case", "Sapphire crystal", "Quick-release strap system"],
    specifications: {
      "Case size": "38 mm",
      Movement: "Quartz",
      "Water resistance": "5 ATM",
      Strap: "Leather, 20 mm",
    },
    pros: ["Sits flat under a cuff", "Strap swaps without tools"],
    cons: ["Not suited to swimming"],
    price: 340,
    originalPrice: 490,
    rating: 4.8,
    reviewCount: 162,
    affiliateUrl: "",
    variants: [{ label: "Strap", options: ["Black leather", "Brown leather", "Steel mesh"] }],
    featured: true,
    trending: true,
    bestSeller: true,
    deal: true,
    dealLabel: "Top discount",
  },
  {
    name: "Leather Weekender Bag",
    slug: "leather-weekender-bag",
    category: "fashion-lifestyle",
    subcategory: "Bags",
    brand: "Northfold",
    description: "A 40-litre leather duffel sized for two or three nights away.",
    features: ["40 L main compartment", "Detachable shoulder strap", "Water-resistant lining"],
    specifications: { Capacity: "40 L", Material: "Full-grain leather", Weight: "1.9 kg" },
    pros: ["Ages well with use", "Fits most cabin size limits"],
    cons: ["Heavier than a nylon duffel"],
    price: 219,
    originalPrice: 289,
    rating: 4.6,
    reviewCount: 143,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: true,
    deal: false,
  },
  {
    name: "Bifold Leather Wallet",
    slug: "bifold-leather-wallet",
    category: "fashion-lifestyle",
    subcategory: "Wallets",
    brand: "Northfold",
    description: "A slim bifold in vegetable-tanned leather with six card slots.",
    features: ["Six card slots", "Vegetable-tanned leather", "Full-length note pocket"],
    specifications: { Material: "Vegetable-tanned leather", Slots: "6 cards", Closed: "11 × 9 cm" },
    pros: ["Stays slim when loaded", "Develops a patina"],
    cons: ["No coin pocket"],
    price: 52,
    originalPrice: 69,
    rating: 4.5,
    reviewCount: 388,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: false,
    deal: false,
  },
  {
    name: "Slim Card Holder",
    slug: "slim-card-holder",
    category: "fashion-lifestyle",
    subcategory: "Wallets",
    brand: "Corso",
    description: "A machined aluminium card holder for people who carry three or four cards.",
    features: ["Machined aluminium body", "RFID-blocking shell", "Fan-out card access"],
    specifications: { Material: "Anodised aluminium", Capacity: "Up to 6 cards", Weight: "52 g" },
    pros: ["Almost pocket-invisible", "Very durable"],
    cons: ["No space for notes"],
    price: 39,
    originalPrice: 55,
    rating: 4.4,
    reviewCount: 271,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: false,
    deal: true,
    dealLabel: "Best discount",
  },
  {
    name: "Vanta ANC Headphones",
    slug: "vanta-anc-headphones",
    category: "fashion-lifestyle",
    subcategory: "Accessories",
    brand: "Northwind Audio",
    description: "Over-ear headphones with adaptive noise cancelling and a 40-hour battery.",
    features: [
      "Adaptive active noise cancelling",
      "40-hour battery with ANC on",
      "Multipoint pairing for two devices",
      "Folds flat into a hard case",
    ],
    specifications: {
      Battery: "40 hours (ANC on)",
      Drivers: "40 mm dynamic",
      Bluetooth: "5.3, multipoint",
      Weight: "265 g",
    },
    pros: ["Strong cancellation on commutes", "Comfortable over long sessions"],
    cons: ["Case is bulky for small bags"],
    price: 189,
    originalPrice: 249,
    rating: 4.6,
    reviewCount: 1204,
    affiliateUrl: "",
    variants: [{ label: "Colour", options: ["Midnight", "Sand", "Slate"] }],
    featured: true,
    trending: true,
    bestSeller: true,
    deal: true,
    dealLabel: "Today's deal",
  },
  {
    name: "Polarized Sunglasses",
    slug: "polarized-sunglasses",
    category: "fashion-lifestyle",
    subcategory: "Accessories",
    brand: "Corso",
    description: "Polarised lenses in a lightweight acetate frame with spring hinges.",
    features: ["Polarised category 3 lenses", "Acetate frame", "Spring hinge arms"],
    specifications: { Lens: "Polarised, CAT 3", Frame: "Acetate", "UV protection": "UV400" },
    pros: ["Cuts glare on the road", "Light enough to forget"],
    cons: ["Case sold separately"],
    price: 78,
    originalPrice: 99,
    rating: 4.3,
    reviewCount: 205,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: false,
    deal: false,
  },
  {
    name: "Lumen Task Lamp",
    slug: "lumen-task-lamp",
    category: "fashion-lifestyle",
    subcategory: "Lifestyle",
    brand: "Lumen",
    description: "A brass-finish desk lamp with stepless dimming and adjustable colour temperature.",
    features: ["Stepless dimming", "2700K–5000K colour range", "Weighted base"],
    specifications: { Output: "600 lumens", "Colour temp": "2700–5000 K", Power: "9 W" },
    pros: ["Even light with no hotspot", "Stays put when adjusted"],
    cons: ["No USB charging port"],
    price: 64,
    originalPrice: 89,
    rating: 4.5,
    reviewCount: 176,
    affiliateUrl: "",
    featured: false,
    trending: true,
    bestSeller: false,
    deal: true,
    dealLabel: "Deal of the day",
  },
  {
    name: "BrewBox Portable Espresso",
    slug: "brewbox-portable-espresso",
    category: "fashion-lifestyle",
    subcategory: "Lifestyle",
    brand: "BrewBox",
    description: "A hand-pumped espresso maker for travel, camping and desk-side brewing.",
    features: ["Manual pump, no power needed", "Works with ground coffee or capsules", "Rinses clean in seconds"],
    specifications: { Pressure: "Up to 18 bar", Capacity: "80 ml", Weight: "430 g" },
    pros: ["No electricity required", "Genuinely portable"],
    cons: ["Small single-shot capacity"],
    price: 58,
    originalPrice: 79,
    rating: 4.4,
    reviewCount: 331,
    affiliateUrl: "",
    featured: true,
    trending: false,
    bestSeller: false,
    deal: true,
    dealLabel: "Trending deal",
  },
  {
    name: "The Quiet Ledger",
    slug: "the-quiet-ledger",
    category: "books",
    subcategory: "Self Improvement",
    brand: "Harbour Press",
    description: "A short book on building small daily systems instead of chasing motivation.",
    features: ["228 pages", "Hardcover edition", "Chapter exercises included"],
    specifications: { Format: "Hardcover", Pages: "228", Language: "English" },
    pros: ["Concise chapters", "Practical exercises"],
    cons: ["Covers familiar ground for habit readers"],
    price: 23,
    originalPrice: 27,
    rating: 4.7,
    reviewCount: 2095,
    affiliateUrl: "",
    variants: [{ label: "Format", options: ["Hardcover", "Paperback", "eBook"] }],
    featured: true,
    trending: true,
    bestSeller: true,
    deal: false,
  },
  {
    name: "The Founder Playbook",
    slug: "the-founder-playbook",
    category: "books",
    subcategory: "Business",
    brand: "Harbour Press",
    description: "A field guide to early-stage company building, from first hire to first market.",
    features: ["312 pages", "Case-study format", "Includes planning templates"],
    specifications: { Format: "Hardcover", Pages: "312", Language: "English" },
    pros: ["Concrete examples throughout", "Useful templates"],
    cons: ["Skews toward software businesses"],
    price: 27,
    originalPrice: 34,
    rating: 4.5,
    reviewCount: 743,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: true,
    deal: false,
  },
  {
    name: "Compound & Money",
    slug: "compound-money",
    category: "books",
    subcategory: "Finance",
    brand: "Ledger House",
    description: "An introduction to long-horizon investing written for first-time savers.",
    features: ["Plain-language explanations", "Worked examples", "Glossary of terms"],
    specifications: { Format: "Hardcover", Pages: "264", Language: "English" },
    pros: ["No jargon", "Good starting point"],
    cons: ["Light on advanced strategies"],
    price: 25,
    originalPrice: 32,
    rating: 4.6,
    reviewCount: 1188,
    affiliateUrl: "",
    featured: true,
    trending: false,
    bestSeller: false,
    deal: true,
    dealLabel: "Reader deal",
  },
  {
    name: "Clean Systems Design",
    slug: "clean-systems-design",
    category: "books",
    subcategory: "Programming & Technology",
    brand: "Stackline",
    description: "A practical look at designing maintainable backend systems at moderate scale.",
    features: ["Architecture patterns", "Failure-case walkthroughs", "Diagrams throughout"],
    specifications: { Format: "Paperback", Pages: "398", Language: "English" },
    pros: ["Diagrams are genuinely clear", "Language-agnostic"],
    cons: ["Dense in later chapters"],
    price: 39,
    originalPrice: 49,
    rating: 4.7,
    reviewCount: 512,
    affiliateUrl: "",
    featured: false,
    trending: true,
    bestSeller: true,
    deal: false,
  },
  {
    name: "Learn Like A Pro",
    slug: "learn-like-a-pro",
    category: "books",
    subcategory: "Education",
    brand: "Stackline",
    description: "Study techniques for exams, certifications and self-taught subjects.",
    features: ["Spaced-repetition plans", "Note-taking systems", "Revision checklists"],
    specifications: { Format: "Paperback", Pages: "196", Language: "English" },
    pros: ["Immediately actionable", "Short chapters"],
    cons: ["Aimed at beginners"],
    price: 18,
    originalPrice: 24,
    rating: 4.4,
    reviewCount: 655,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: false,
    deal: true,
    dealLabel: "Study season",
  },
  {
    name: "The Lantern District",
    slug: "the-lantern-district",
    category: "books",
    subcategory: "Fiction",
    brand: "Harbour Press",
    description: "A slow-burn literary novel set across one winter in an old market quarter.",
    features: ["Hardcover with dust jacket", "Author's note included", "352 pages"],
    specifications: { Format: "Hardcover", Pages: "352", Language: "English" },
    pros: ["Strong sense of place", "Beautifully produced edition"],
    cons: ["Deliberately slow pacing"],
    price: 26,
    originalPrice: 31,
    rating: 4.5,
    reviewCount: 402,
    affiliateUrl: "",
    featured: true,
    trending: true,
    bestSeller: false,
    deal: false,
  },
  {
    name: "Nightfall Market",
    slug: "nightfall-market",
    category: "books",
    subcategory: "Fiction",
    brand: "Ledger House",
    description: "A contemporary mystery that unfolds over seven nights in a single city block.",
    features: ["Paperback edition", "Seven-part structure", "288 pages"],
    specifications: { Format: "Paperback", Pages: "288", Language: "English" },
    pros: ["Tight structure", "Hard to put down midway"],
    cons: ["Ending divides readers"],
    price: 16,
    originalPrice: 22,
    rating: 4.2,
    reviewCount: 887,
    affiliateUrl: "",
    featured: false,
    trending: false,
    bestSeller: false,
    deal: true,
    dealLabel: "Best discount",
  },
];

export const products: Product[] = seeds.map(build);

/* ------------------------------------------------------------------ */
/* Selectors                                                           */
/* ------------------------------------------------------------------ */

export const trendingProducts = products.filter((p) => p.trending);
export const bestSellers = products.filter((p) => p.bestSeller);
export const dealProducts = products.filter((p) => p.deal);
export const featuredProducts = products.filter((p) => p.featured);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export function productsInCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameSub = products.filter(
    (p) => p.id !== product.id && p.subcategory === product.subcategory,
  );
  const sameCat = products.filter(
    (p) => p.id !== product.id && p.category === product.category && !sameSub.includes(p),
  );
  return [...sameSub, ...sameCat].slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.brand, p.subcategory, p.description, p.category].join(" ").toLowerCase().includes(q),
  );
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "discount";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "discount", label: "Biggest Discount" },
];

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const copy = [...list];
  switch (key) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "discount":
      return copy.sort((a, b) => b.discount - a.discount);
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

/* ------------------------------------------------------------------ */
/* Shopping guides (secondary editorial content)                       */
/* ------------------------------------------------------------------ */

export interface Guide {
  slug: string;
  title: string;
  category: CategorySlug;
  accent: "mint" | "gold" | "sky" | "brand";
  summary: string;
  body: string[];
  productSlugs: string[];
}

export const guides: Guide[] = [
  {
    slug: "best-fitness-essentials-for-beginners",
    title: "Best Fitness Essentials for Beginners",
    category: "fitness-personal-care",
    accent: "mint",
    summary: "The short list of kit that actually gets used in a first home setup.",
    body: [
      "Most beginner home setups fail for the same reason: too much equipment bought at once, with no plan for where it lives. Start with adjustable load and a way to add resistance, then expand only when a routine sticks.",
      "Adjustable dumbbells cover the widest range of movements per square metre of floor. A band kit fills the gaps for warm-ups, pulling patterns and travel weeks.",
      "Nutrition comes after consistency, not before it. A single protein source and a basic multivitamin are enough to start with.",
    ],
    productSlugs: ["adjustable-dumbbell-set", "resistance-band-kit", "peakform-whey-vanilla", "insulated-steel-bottle"],
  },
  {
    slug: "everyday-grooming-essentials",
    title: "Everyday Grooming Essentials",
    category: "fitness-personal-care",
    accent: "gold",
    summary: "A small routine you can keep up on a weekday morning.",
    body: [
      "A grooming routine that takes more than ten minutes usually gets abandoned. Pick one tool you use daily and two products you can apply without thinking.",
      "A trimmer with fine length steps does more for a consistent look than any product. Add a morning serum and a finishing oil, and the routine is done.",
    ],
    productSlugs: ["beard-trimmer-pro", "vitamin-c-serum", "argan-hair-oil", "silkrest-eye-mask"],
  },
  {
    slug: "mens-lifestyle-must-haves",
    title: "Men's Lifestyle Must-Haves",
    category: "fashion-lifestyle",
    accent: "sky",
    summary: "Wardrobe and desk pieces that quietly do a lot of work.",
    body: [
      "The pieces that earn their place are the ones you reach for without deciding: one warm layer, one pair of boots, one watch, one wallet.",
      "Everything else is seasonal. Build the core first, then let the rest rotate.",
    ],
    productSlugs: ["merino-crew-sweater", "leather-chelsea-boots", "meridian-gold-watch", "lumen-task-lamp"],
  },
  {
    slug: "books-worth-reading",
    title: "Books Worth Reading",
    category: "books",
    accent: "brand",
    summary: "A starting shelf across habits, business, money and fiction.",
    body: [
      "A good shelf mixes something practical, something structural and something that has nothing to do with work at all.",
      "These four cover habits, company building, long-horizon money and one novel to break the pattern.",
    ],
    productSlugs: ["the-quiet-ledger", "the-founder-playbook", "compound-money", "the-lantern-district"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
