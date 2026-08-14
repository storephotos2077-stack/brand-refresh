import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand, deliveryZones } from "@/lib/shop-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/contact" },
      { title: "Contact Us — Call, WhatsApp, Email & Store Location" },
      { name: "description", content: "Call or WhatsApp us, drop an email, or find our shop on the map. Business hours and delivery zones listed." },
      { property: "og:title", content: "Contact Us" },
      { property: "og:description", content: "Call, WhatsApp, email or visit our shop." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-page section-y">
      <PageHeader
        eyebrow="Get in touch"
        title="We answer fast"
        description="Call, WhatsApp or email us — most messages get a reply within a few minutes during business hours."
      />

      <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="surface-card card-lift p-6">
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`}><PhoneCall className="size-4" /> Call {brand.phone}</a>
              </Button>
              <Button asChild variant="outline">
                <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" /> WhatsApp chat
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`mailto:${brand.email}`}><Mail className="size-4" /> Email us</a>
              </Button>
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" /> {brand.address}
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent" /> {brand.hours}
            </p>
          </div>

          <div className="surface-card card-lift p-6">
            <p className="eyebrow">Delivery zones</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {deliveryZones.map((z) => (
                <li key={z.area}>{z.area} — {z.slots} ({z.eta})</li>
              ))}
            </ul>
          </div>

          <div className="surface-card p-6 text-xs leading-relaxed text-muted-foreground">
            <p className="eyebrow">Grievance redressal</p>
            <p className="mt-2">
              As required by the Consumer Protection (E-Commerce) Rules, 2020: Grievance Officer —
              Placeholder Name, {brand.email}, {brand.phone}. Complaints are acknowledged within 48
              hours and resolved within one month.
            </p>
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <iframe
            title="Store location map"
            className="h-full min-h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${brand.mapQuery}&output=embed`}
          />
        </div>
      </div>
    </div>
  );
}
