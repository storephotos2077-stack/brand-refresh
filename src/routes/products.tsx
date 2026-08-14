import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CategoryCarousel } from "@/components/category-carousel";
import { ProductSearch } from "@/components/product-search";
import { Reveal } from "@/lib/motion";
import { brand, products } from "@/lib/shop-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/products" },
      { title: "Fresh Chicken, Eggs & Combo Packs — Prices per Pack" },
      {
        name: "description",
        content:
          "Whole chicken, curry cut, boneless breast and leg, keema, farm eggs and combo packs. Weights and prices listed clearly. Cut to order, delivered cold.",
      },
      { property: "og:title", content: "Fresh Chicken, Eggs & Combo Packs" },
      { property: "og:description", content: "Cut to order, weighed after cleaning, delivered in your slot." },
    ],
    links: [{ rel: "canonical", href: "/products" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: "Products", item: "/products" },
              ],
            },
            {
              "@type": "ItemList",
              name: "Fresh chicken, eggs and combo packs",
              itemListElement: products.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Product",
                  name: p.name,
                  description: p.short,
                  category: p.category,
                  weight: { "@type": "QuantitativeValue", value: p.weightGrams, unitCode: "GRM" },
                  offers: {
                    "@type": "Offer",
                    price: p.price,
                    priceCurrency: "INR",
                    availability:
                      p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    url: "/products",
                  },
                },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: Products,
});

const categories = ["All", "Cuts", "Eggs", "Combos"] as const;

function Products() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const list = cat === "All" ? products : products.filter((p) => p.category === cat);

  return (
    <div className="container-page section-y">
      <PageHeader
        eyebrow="Our counter"
        title={<>Fresh cuts &amp; packs</>}
        description={`Every weight shown is the net weight after cleaning and trimming. Minimum order value ₹${brand.minOrder}. Need a specific cut size? Add a note at checkout — for example, "cut into small pieces".`}
      />

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CategoryCarousel categories={categories} active={cat} onSelect={setCat} />
        <ProductSearch className="lg:w-80" />
      </div>

      <div key={cat} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={i * 70} />
        ))}
      </div>

      <div className="mt-16 grid items-stretch gap-5 md:grid-cols-2">
        {list.map((p, i) => (
          <Reveal key={p.id} delay={i * 50} className="surface-card card-lift h-full p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-lg">{p.name}</h2>
              <span className="text-sm font-semibold">₹{p.price}</span>
            </div>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {p.unit} · net {p.weightGrams} g · {p.stock} packs in stock today
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
