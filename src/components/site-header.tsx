import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductSearch } from "@/components/product-search";
import { CART_ANCHOR_ID, CART_BUMP_EVENT } from "@/lib/cart-fx";
import { useScrolled } from "@/lib/motion";
import { brand } from "@/lib/shop-data";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import rooster from "@/assets/brand-rooster.png";

const nav = [
  { to: "/products", label: "Shop" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/account", label: "My Account" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

const staffNav = [
  { to: "/admin", label: "Admin" },
  { to: "/delivery", label: "Delivery" },
];

export function SiteHeader() {
  const { cartCount } = useShop();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [eggs, setEggs] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const scrolled = useScrolled(28);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    const trigger = () => {
      setBump(true);
      window.setTimeout(() => setBump(false), 540);
    };
    window.addEventListener(CART_BUMP_EVENT, trigger);
    return () => window.removeEventListener(CART_BUMP_EVENT, trigger);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 540);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
    return undefined;
  }, [cartCount]);

  function onLogoClick() {
    setEggs((n) => {
      const next = n + 1;
      if (next >= 5) {
        setEasterEgg(true);
        window.setTimeout(() => setEasterEgg(false), 2200);
        return 0;
      }
      return next;
    });
  }

  return (
    <header
      className={cn(
        "header-in sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-border/70 bg-background/80 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : "border-border/50 bg-background/95 backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "overflow-hidden bg-primary text-primary-foreground transition-[height,opacity] duration-300",
          scrolled ? "h-0 opacity-0" : "h-8 opacity-100",
        )}
      >
        <div className="container-page flex h-8 items-center justify-between gap-4 text-[0.7rem] font-medium tracking-wide">
          <span className="truncate">
            <span className="hidden sm:inline">FSSAI Lic. {brand.fssai} · </span>Fresh, never frozen
          </span>
          <span className="shrink-0 whitespace-nowrap">Free delivery above ₹{brand.freeDeliveryAbove}</span>
        </div>
      </div>

      <div
        className={cn(
          "container-page flex items-center gap-3 transition-[height] duration-300 xl:gap-4",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <Link to="/" onClick={onLogoClick} className="press-fx group flex shrink-0 items-center gap-2">
          <span className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-secondary">
            <img
              src={rooster}
              alt=""
              aria-hidden
              width={512}
              height={512}
              className={cn(
                "nudge-rotate size-8 object-contain transition-transform duration-500",
                easterEgg && "cart-bounce",
              )}
            />
          </span>
          <span className="font-display text-lg leading-none whitespace-nowrap">
            FarmFreshNow
            <span className="block font-sans text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Farm to Fresh
            </span>
          </span>
        </Link>

        {easterEgg && (
          <span className="pop-in hidden text-xs font-semibold text-primary xl:inline">
            Cock-a-doodle-doo! 🐓 Freshness unlocked.
          </span>
        )}

        <nav className="mx-auto hidden items-center gap-0.5 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "relative rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200 hover:text-foreground xl:px-3",
                path === n.to && "text-foreground",
              )}
            >
              {n.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-2.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300 ease-out",
                  path === n.to ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          ))}
          <span className="mx-1.5 h-5 w-px bg-border" />
          {staffNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "relative rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200 hover:text-foreground xl:px-3",
                path === n.to && "text-foreground",
              )}
            >
              {n.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-2.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300 ease-out",
                  path === n.to ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <ProductSearch className="hidden xl:block" />

          <Button asChild variant="outline" size="sm" className="press-fx lift-fx relative">
            <Link to="/cart" id={CART_ANCHOR_ID}>
              <ShoppingCart className={cn("size-4", bump && "cart-bounce")} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="pop-in absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-accent text-[0.65rem] font-bold text-accent-foreground tabular-nums"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild size="sm" className="press-fx lift-fx sheen hidden sm:inline-flex">
            <Link to="/products">Order Now</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="press-fx lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,86vw)] px-5">
              <div className="stagger-in mt-10 flex flex-col gap-1">
                {[...nav, ...staffNav].map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 hover:bg-secondary active:scale-[0.99]",
                      path === n.to && "bg-secondary text-foreground",
                    )}
                  >
                    {n.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
