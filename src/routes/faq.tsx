import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/shop-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/faq" },
      { title: "FAQ — Freshness, Delivery, Packing, Payments & Hygiene" },
      { name: "description", content: "Answers on whether our chicken is fresh or frozen, delivery timings, returns, payment methods, packaging and hygiene." },
      { property: "og:title", content: "Frequently Asked Questions" },
      { property: "og:description", content: "Freshness, delivery, returns, payments, packing and hygiene answered." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: Faq,
});

function Faq() {
  return (
    <div className="container-page section-y">
      <PageHeader
        eyebrow="Support"
        title="Frequently asked questions"
        description="Freshness, delivery windows, packing, payments and hygiene — answered in plain language."
      />
      <Accordion type="single" collapsible className="mx-auto mt-10 w-full max-w-2xl">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
