import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountUp, useMagnetic, usePointerParallax } from "@/lib/motion";
import { brand, heroImage } from "@/lib/shop-data";
import chilli from "@/assets/ing-chilli.png";
import coriander from "@/assets/ing-coriander.png";
import garlic from "@/assets/ing-garlic.png";
import lemon from "@/assets/ing-lemon.png";

const ingredients = [
  { src: chilli, alt: "", className: "top-2 -left-6 w-16 sm:w-20", depth: 16, rot: "-12deg", dur: "13s" },
  { src: garlic, alt: "", className: "-top-6 right-10 w-14 sm:w-16", depth: 11, rot: "8deg", dur: "16s" },
  { src: coriander, alt: "", className: "-bottom-4 right-0 w-20 sm:w-24", depth: 14, rot: "6deg", dur: "15s" },
  { src: lemon, alt: "", className: "bottom-16 -left-8 w-14 sm:w-16", depth: 9, rot: "-6deg", dur: "18s" },
];

function Stat({ value, suffix, label, decimals = 0 }: { value: number; suffix?: string; label: string; decimals?: number }) {
  const n = useCountUp(value, true, 1100, decimals);
  return (
    <div>
      <p className="text-2xl font-extrabold tracking-tight">
        {n.toFixed(decimals)}
        {suffix}
      </p>
      <p className="mt-0.5 text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">{label}</p>
    </div>
  );
}

export function SiteHero() {
  const { ref, layer } = usePointerParallax<HTMLDivElement>();
  const primaryCta = useMagnetic<HTMLAnchorElement>(6);
  const secondaryCta = useMagnetic<HTMLAnchorElement>(5);

  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/40">
      <div aria-hidden className="aurora">
        <div className="absolute top-[6%] right-[8%] size-[26rem] rounded-full bg-accent/25" />
      </div>
      <div aria-hidden className="aurora aurora-slow">
        <div className="absolute bottom-[4%] left-[6%] size-[24rem] rounded-full bg-primary/12" />
      </div>
      <div aria-hidden className="grain-layer" />

      <div
        ref={ref}
        className="container-page relative z-10 grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-24"
      >
        <div className="hero-enter">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <span className="relative grid size-2 place-items-center">
              <span className="absolute inset-0 rounded-full bg-success/60 [animation:ffn-ping-soft_2.4s_ease-out_infinite]" />
              <span className="size-2 rounded-full bg-success" />
            </span>
            Cut to order · {brand.hours}
          </p>
          <h1 className="mt-5 text-[clamp(2.5rem,8vw,3.75rem)] leading-[1.05]">
            Farm to Fresh.
            <span className="block text-primary">Always Fresh.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Chicken cut to order after you place it, packed cold at 0–4 °C and delivered in the slot
            you choose — with live tracking and an instant invoice on WhatsApp and email.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="press-fx lift-fx sheen group w-full sm:w-auto">
              <Link ref={primaryCta} to="/products">
                Order Now
                <ArrowRight className="nudge-x size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="press-fx lift-fx w-full sm:w-auto">
              <Link ref={secondaryCta} to="/subscriptions">
                See subscription plans
              </Link>
            </Button>
          </div>
          <div className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
            <Stat value={4.8} decimals={1} label="Avg rating" />
            <Stat value={1200} suffix="+" label="Orders served" />
            <Stat value={4} suffix=" zones" label="Same-day" />
          </div>
          <div className="mt-6 flex max-w-lg flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" /> FSSAI {brand.fssai}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 text-accent" /> Verified reviews
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-primary" /> Same-day slots
            </span>
          </div>
        </div>

        <div className="group relative mx-auto w-full max-w-xl lg:max-w-none">
          <div style={layer(10)} className="relative">
            <img
              src={heroImage}
              alt="Fresh chicken cuts on a banana leaf with Indian spices"
              fetchPriority="high"
              decoding="async"
              width={1600}
              height={1104}
              className="hero-visual-in zoom-media aspect-[4/3] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
            />
          </div>

          {ingredients.map((ing, i) => (
            <div key={i} style={layer(ing.depth)} className={`pointer-events-none absolute ${ing.className}`}>
              <img
                src={ing.src}
                alt={ing.alt}
                aria-hidden
                loading="lazy"
                width={512}
                height={512}
                className="float-slow w-full drop-shadow-lg"
                style={{ "--r": ing.rot, "--dur": ing.dur } as React.CSSProperties}
              />
            </div>
          ))}

          <div
            style={layer(20)}
            className="surface-card absolute -bottom-6 left-4 hidden items-center gap-3 px-4 py-3 sm:flex"
          >
            <span className="grid size-9 place-items-center rounded-full bg-success/15 text-success">
              <Truck className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold">Out for delivery</p>
              <p className="text-[0.7rem] text-muted-foreground">Arriving in your chosen slot</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
