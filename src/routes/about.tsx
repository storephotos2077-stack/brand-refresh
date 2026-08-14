import { createFileRoute } from "@tanstack/react-router";
import { brand } from "@/lib/shop-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/about" },
      { title: "About Us — Our Farms, Our Cutting Room, Our Standards" },
      { name: "description", content: "How we source, process and deliver fresh chicken: FSSAI-licensed facility, cold chain, and honest weights." },
      { property: "og:title", content: "About FarmFreshNow" },
      { property: "og:description", content: "Farm-direct sourcing, hygienic processing and honest weights." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-page section-y">
      <PageHeader eyebrow="About us" title="A butcher shop that behaves like a supply chain" />
      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-sm leading-relaxed text-pretty text-muted-foreground">
        <p>
          {brand.legalName} works directly with contract poultry farms around Your City (placeholder).
          Birds arrive at our processing unit every morning, are dressed within hours and go straight
          into chilled storage. Nothing is frozen, and nothing carries over to the next day.
        </p>
        <p>
          Every order is cut after you place it. That is slower than pre-packing, and it is the whole
          point: your curry cut is made for you, at the size you asked for, and weighed after cleaning
          on a stamped scale.
        </p>
        <p>
          Our unit operates under an FSSAI licence ({brand.fssai}) with daily temperature logs,
          potable-water washing, sanitised stainless steel surfaces, and mandatory gloves and hairnets
          for every handler. We commission third-party microbiological testing every month and are
          happy to share the latest report on request.
        </p>
        <p>
          We are registered under the Companies Act with GSTIN {brand.gstin} and CIN {brand.cin}, and
          we comply with the Legal Metrology (Packaged Commodities) Rules for declared net quantity,
          the Food Safety and Standards Act, 2006, and the Consumer Protection (E-Commerce) Rules, 2020.
        </p>
      </div>
    </div>
  );
}
