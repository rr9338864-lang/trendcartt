import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgePercent, Flame, Sparkles, BookOpen } from "lucide-react";
import {
  categories,
  siteImages,
  trendingProducts,
  dealProducts,
  bestSellers,
  guides,
} from "@/data/catalog";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { AffiliateNote } from "@/components/AffiliateNote";
import { ShopBrowser } from "@/components/ShopBrowser";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrendCart — Curated Deals on Fitness, Fashion & Books" },
      {
        name: "description",
        content:
          "TrendCart is a curated shopping storefront: trending fitness gear and fashion staples, hand-picked from trusted retailers.",
      },
      { property: "og:title", content: "TrendCart — Curated Deals on Fitness, Fashion & Books" },
      {
        property: "og:description",
        content:
          "Trending fitness gear and fashion staples, hand-picked from trusted retailers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const accentText: Record<string, string> = {
  mint: "text-mint",
  gold: "text-gold",
  sky: "text-sky",
  brand: "text-brand",
};

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <img
          src={siteImages.hero}
          alt="TrendCart neon night-market storefront"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
            Curated affiliate storefront
          </p>
          <h1
            className="mt-3 max-w-2xl animate-rise font-display text-5xl tracking-tight text-foreground sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Everything trending.
            <br />
            <span className="text-brand">One storefront.</span>
          </h1>
          <p
            className="mt-4 max-w-xl animate-rise text-sm leading-relaxed text-ink-muted sm:text-base"
            style={{ animationDelay: "160ms" }}
          >
            TrendCart hand-picks fitness gear and fashion staples from trusted retailers —
            so you skip the endless scrolling and go straight to what's worth buying.
          </p>
          <div className="mt-8 flex animate-rise flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <a
              href="#trending"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              Shop trending <ArrowRight size={14} />
            </a>
            <a
              href="#deals"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/50"
            >
              Today's deals{"\n"}<BadgePercent size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading title="Shop by category" eyebrow="Browse" />
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((cat, i) => (
            <a
              key={cat.slug}
              href="#trending"
              className="group relative animate-rise overflow-hidden rounded-xl border border-line transition-colors hover:border-brand/40"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${accentText[cat.accent]}`}>
                  {cat.subcategories.length} departments
                </p>
                <h3 className="mt-1 font-display text-xl tracking-tight text-foreground">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-ink-muted">{cat.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Browse all */}
      <section id="browse" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-4">
        <SectionHeading title="Browse all products" eyebrow="Search & filter" />
        <ShopBrowser />
      </section>

      {/* Trending */}
      <section id="trending" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
        <SectionHeading
          title="Trending now"
          eyebrow="Hot this week"
          action={{ label: "View all", to: "/" }}
        />
        <ProductGrid products={trendingProducts.slice(0, 8)} />
      </section>


      {/* Deals strip */}
      <section id="deals" className="scroll-mt-20 border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading title="Today's deals" eyebrow="Limited-time price drops" />
          <ProductGrid products={dealProducts.slice(0, 4)} />
          <AffiliateNote className="mt-6" />
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="relative overflow-hidden rounded-2xl border border-line">
          <img
            src={siteImages.promo}
            alt="TrendCart seasonal picks promotional banner"
            loading="lazy"
            className="h-56 w-full object-cover sm:h-64"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
              <Sparkles size={12} /> Seasonal picks
            </p>
            <h2 className="mt-2 max-w-md font-display text-3xl tracking-tight text-foreground sm:text-4xl">
              The night-market edit
            </h2>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              A rotating selection of this season's most-wished-for gear, refreshed weekly.
            </p>
            <a
              href="#trending"
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              Explore the edit <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <SectionHeading title="Best sellers" eyebrow="Reader favourites" />
        <ProductGrid products={bestSellers.slice(0, 4)} />
      </section>

      {/* Guides */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading title="Shopping guides" eyebrow="From the editors" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide, i) => (
              <article
                key={guide.slug}
                className="animate-rise rounded-xl border border-line bg-background p-5 transition-colors hover:border-brand/40"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <p
                  className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${accentText[guide.accent]}`}
                >
                  {guide.category === "books" ? <BookOpen size={11} /> : <Flame size={11} />}
                  Guide
                </p>
                <h3 className="mt-2 font-display text-lg leading-snug tracking-tight text-foreground">
                  {guide.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{guide.summary}</p>
                <Link
                  to="/product/$slug"
                  params={{ slug: guide.productSlugs[0] ?? "" }}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-foreground"
                >
                  See top pick <ArrowRight size={11} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
