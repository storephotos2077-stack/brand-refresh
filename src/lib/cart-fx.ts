/**
 * Purely visual add-to-cart feedback. Never blocks or delays the real cart update.
 * Uses a detached clone animated with transform/opacity only.
 */

export const CART_ANCHOR_ID = "cart-anchor";
export const CART_BUMP_EVENT = "ffn:cart-bump";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function bumpCart() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_BUMP_EVENT));
}

export function flyToCart(source: HTMLElement | null) {
  if (typeof window === "undefined") return;
  bumpCart();
  if (!source || prefersReduced()) return;

  const target = document.getElementById(CART_ANCHOR_ID);
  if (!target) return;

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (!from.width || !to.width) return;

  const ghost = source.cloneNode(true) as HTMLElement;
  ghost.style.cssText = `position:fixed;left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;border-radius:14px;object-fit:cover;z-index:80;pointer-events:none;will-change:transform,opacity;box-shadow:0 18px 40px rgba(0,0,0,.28)`;
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  const anim = ghost.animate(
    [
      { transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
      { transform: `translate3d(${dx * 0.55}px, ${dy * 0.42 - 60}px, 0) scale(0.55)`, opacity: 0.95, offset: 0.6 },
      { transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.12)`, opacity: 0.15 },
    ],
    { duration: 700, easing: "cubic-bezier(.35,.5,.2,1)" },
  );
  anim.onfinish = () => ghost.remove();
  anim.oncancel = () => ghost.remove();
}
