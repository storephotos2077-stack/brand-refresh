import { Link } from "@tanstack/react-router";
import { brand, deliveryZones } from "@/lib/shop-data";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/50">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-display text-xl">{brand.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{brand.tagline}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {brand.legalName}
            <br />
            {brand.address}
            <br />
            FSSAI: {brand.fssai}
            <br />
            GSTIN: {brand.gstin}
            <br />
            CIN: {brand.cin}
          </p>
        </div>
        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="link-underline transition-colors hover:text-foreground">All products</Link></li>
            <li><Link to="/subscriptions" className="link-underline transition-colors hover:text-foreground">Subscription plans</Link></li>
            <li><Link to="/account" className="link-underline transition-colors hover:text-foreground">My orders</Link></li>
            <li><Link to="/blog" className="link-underline transition-colors hover:text-foreground">Recipes & guides</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Policies</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/legal/terms" className="link-underline transition-colors hover:text-foreground">Terms & conditions</Link></li>
            <li><Link to="/legal/privacy" className="link-underline transition-colors hover:text-foreground">Privacy policy</Link></li>
            <li><Link to="/legal/refunds" className="link-underline transition-colors hover:text-foreground">Cancellation & refunds</Link></li>
            <li><Link to="/legal/shipping" className="link-underline transition-colors hover:text-foreground">Shipping & delivery</Link></li>
            <li><Link to="/about" className="link-underline transition-colors hover:text-foreground">About us</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Delivery &amp; help</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/delivery" className="link-underline transition-colors hover:text-foreground">Delivery areas &amp; slots</Link></li>
            <li><Link to="/faq" className="link-underline transition-colors hover:text-foreground">Freshness &amp; delivery FAQ</Link></li>
            <li><Link to="/contact" className="link-underline transition-colors hover:text-foreground">Contact the shop</Link></li>
            {deliveryZones.map((z) => (
              <li key={z.area} className="text-xs">
                {z.area}
                <span className="block">{z.slots}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.legalName}. All rights reserved.</p>
          <p>
            Grievance Officer (as per Consumer Protection (E-Commerce) Rules, 2020): Placeholder Name ·{" "}
            {brand.email} · {brand.phone}
          </p>
        </div>
      </div>
    </footer>
  );
}
