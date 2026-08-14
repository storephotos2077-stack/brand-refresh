import { useScrollProgress } from "@/lib/motion";

export function ScrollProgress() {
  const p = useScrollProgress();
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary via-accent to-primary"
        style={{ transform: `scaleX(${p})`, transition: "transform 90ms linear" }}
      />
    </div>
  );
}
