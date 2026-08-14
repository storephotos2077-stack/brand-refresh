import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/legal/privacy" },
      { title: "Privacy Policy — FarmFreshNow" },
      { name: "description", content: "This policy explains how we collect, use and protect your personal data, in line with the Information Technology (Reasonable Security Practices and Pr" },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "This policy explains how we collect, use and protect your personal data, in line with the Information Technology (Reasonable Security Practices and Pr" },
    ],
    links: [{ rel: "canonical", href: "/legal/privacy" }],
  }),
  component: Page,
});

const paragraphs = [
  "This policy explains how we collect, use and protect your personal data, in line with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Digital Personal Data Protection Act, 2023.",
  "We collect only what is needed to fulfil your order: name, phone number, email address, delivery addresses, order history and delivery location during an active delivery. We do not store card numbers, CVV or UPI credentials; online payments are handled by a PCI-DSS compliant payment gateway.",
  "Your data is used to process orders, generate invoices, send order and delivery notifications over WhatsApp, SMS and email, provide support, and meet legal and tax record-keeping obligations. We do not sell your data.",
  "We share data only with the parties needed to deliver your order: our delivery partners, payment gateway, and communication providers, each bound by confidentiality obligations.",
  "You may request access to, correction of, or deletion of your personal data, and may withdraw consent for marketing messages at any time, by writing to our Grievance Officer. Transactional order and invoice records are retained for the period required by tax law.",
  "Cookies are used only to keep your cart and session working. Data is stored on servers located in India."
];

function Page() {
  return (
    <div className="container-page section-y">
      <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        Last updated: 10 August 2026. Placeholder text prepared for an India-based food business —
        have it reviewed by a lawyer before you go live.
      </p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-pretty text-muted-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      </div>
    </div>
  );
}
