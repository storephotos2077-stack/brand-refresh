import type { ReactNode } from "react";
import { Reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Shared page heading block. Keeps every page on the same container,
 * spacing rhythm and alignment so headings never drift off-centre.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  align = "center",
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "start";
  children?: ReactNode;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal
      variant="up"
      className={cn(
        "flex flex-col",
        centered ? "mx-auto max-w-3xl items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1
        className={cn(
          "mt-3 text-[clamp(1.9rem,5vw,2.75rem)] leading-[1.12] text-balance",
          !centered && "max-w-3xl",
        )}
      >
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            "mt-4 text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base",
            centered ? "max-w-2xl" : "max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
      {children && <div className={cn("mt-6 flex flex-wrap gap-3", centered && "justify-center")}>{children}</div>}
    </Reveal>
  );
}

/** Section-level heading used inside a page (h2). */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal
      variant="up"
      className={cn(
        "flex flex-col",
        centered ? "mx-auto max-w-3xl items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cn("mt-3 text-[clamp(1.6rem,3.6vw,2.15rem)] leading-tight text-balance")}>{title}</h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
      )}
    </Reveal>
  );
}
