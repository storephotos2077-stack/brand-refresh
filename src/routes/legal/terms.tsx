import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/legal/terms" },
      { title: "Terms & Conditions — FarmFreshNow" },
      { name: "description", content: "These Terms & Conditions govern your use of this website and any order placed on it, and constitute an electronic record under the Information Technol" },
      { property: "og:title", content: "Terms & Conditions" },
      { property: "og:description", content: "These Terms & Conditions govern your use of this website and any order placed on it, and constitute an electronic record under the Information Technol" },
    ],
    links: [{ rel: "canonical", href: "/legal/terms" }],
  }),
  component: Page,
});

const paragraphs = [
  "These Terms & Conditions govern your use of this website and any order placed on it, and constitute an electronic record under the Information Technology Act, 2000. By placing an order you accept them.",
  "Products sold are fresh, perishable food articles supplied in compliance with the Food Safety and Standards Act, 2006 and the rules made thereunder. Net quantity is declared as per the Legal Metrology (Packaged Commodities) Rules, 2011; a variance of up to 3% may occur due to natural moisture loss and trimming.",
  "Prices are inclusive of applicable taxes. Fresh, chilled, unbranded poultry and eggs are nil-rated under GST; any taxable item is shown separately on the tax invoice issued for every order.",
  "We may decline or cancel an order where the delivery address is outside our serviceable zones, stock is unavailable, pricing is displayed in error, or the order is suspected to be fraudulent. Payments already collected for a cancelled order are refunded to source.",
  "You agree to provide accurate delivery details and to be available during your chosen slot. Delivery is completed on OTP verification at the doorstep.",
  "Our aggregate liability for any claim is limited to the value of the order concerned. Nothing here limits rights you have under the Consumer Protection Act, 2019.",
  "These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts at Your City (placeholder)."
];

function Page() {
  return (
    <div className="container-page section-y">
      <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-4xl">Terms & Conditions</h1>
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
