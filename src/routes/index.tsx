import { Link, createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Leaf, Package, ShieldCheck, Thermometer, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SiteHero } from "@/components/site-hero";
import { FarmJourney } from "@/components/farm-journey";
import { FreshnessMeter } from "@/components/freshness-meter";
import { DeliveryJourney } from "@/components/delivery-journey";
import { DeliveryZonesPanel } from "@/components/delivery-zones";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { TrustMarquee } from "@/components/trust-marquee";
import { Reveal } from "@/lib/motion";
import { SectionHeader } from "@/components/page-header";
import { products } from "@/lib/shop-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/" },
      { title: "FarmFreshNow — Fresh Chicken Delivered, Cut After You Order" },
      {
        name: "description",
        content:
          "Never-frozen chicken cut after you order, packed at 0–4 °C and delivered in the slot you choose. Live tracking and instant GST invoice.",
      },
      { property: "og:title", content: "FarmFreshNow — Farm to Fresh. Always Fresh." },
      {
        property: "og:description",
        content: "Cut to order, packed cold, delivered in your chosen time slot with live tracking.",
      },
      { property: "og:image", content: "https://farmfreshnow.vercel.app/og-image.png" },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { property: "og:image:type", content: "image/png" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const reasons = [
  { icon: Leaf, title: "Cut after you order", body: "Nothing is pre-cut and nothing is frozen. Your bird is dressed the same morning." },
  { icon: Thermometer, title: "Unbroken cold chain", body: "Packed at 0–4 °C with gel packs and temperature-logged at every handover." },
  { icon: ShieldCheck, title: "FSSAI-licensed unit", body: "Gloves, hairnets, sanitised stainless steel and monthly third-party lab testing." },
  { icon: Package, title: "Honest net weight", body: "Weighed after cleaning, on a stamped scale. No ice glazing, no water weight." },
  { icon: Truck, title: "Slot you choose", body: "Pick the date and two-hour window. Live tracking from cutting counter to your door." },
  { icon: BadgeCheck, title: "Freshness guarantee", body: "Not happy at the door? Refuse the parcel. Full refund, no arguments." },
];

function Home() {
  const featured = products.slice(0, 4);

  return (
    <div>
      <SiteHero />

      <TrustMarquee />

      <section className="container-page section-y">
        <SectionHeader
          eyebrow="Today's counter"
          title="Today's fresh cuts"
          description="Cut after you order, weighed after cleaning and packed cold — here is what is on the counter right now."
        />
        <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 90} />
          ))}
        </div>
        <Reveal delay={120} className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="press-fx group">
            <Link to="/products">
              View all products
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Button>
        </Reveal>
      </section>

      <FarmJourney />

      <section className="border-y border-border bg-secondary/40 section-y">
        <div className="container-page">
          <SectionHeader
            eyebrow="Why choose us"
            title="Six reasons our customers stop buying elsewhere"
            description="Freshness you can verify, weights you can trust and a delivery window you actually choose."
          />
          <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 70} className="surface-card card-lift ring-hover group h-full p-6">
                <r.icon className="bob size-6 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                <p className="mt-4 font-display text-lg">{r.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FreshnessMeter />

      <section className="container-page pt-4 pb-4">
        <Reveal>
          <DeliveryJourney />
        </Reveal>
      </section>

      <section className="container-page section-y">
        <Reveal>
          <DeliveryZonesPanel />
        </Reveal>
      </section>

      <section className="bg-primary text-primary-foreground section-y">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow opacity-80">In their words</p>
            <h2 className="mt-3 font-display text-3xl text-balance sm:text-4xl">
              What customers say after the first delivery
            </h2>
          </Reveal>
          <Reveal delay={90} className="mx-auto mt-10 max-w-3xl">
            <TestimonialCarousel />
          </Reveal>
        </div>
      </section>

    </div>
  );
}
