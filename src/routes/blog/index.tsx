import { Link, createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/lib/shop-data";
import { Reveal } from "@/lib/motion";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/blog" },
      { title: "Chicken Storage, Recipes & Protein Guides — Our Blog" },
      { name: "description", content: "Practical guides on storing fresh chicken safely, fresh vs frozen, protein needs and quick weeknight recipes." },
      { property: "og:title", content: "Chicken Storage, Recipes & Protein Guides" },
      { property: "og:description", content: "Storage, nutrition and cooking guides from our kitchen." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  return (
    <div className="container-page section-y">
      <PageHeader
        eyebrow="Journal"
        title={<>Storage, nutrition &amp; cooking</>}
        description="Practical guides from our kitchen on keeping chicken fresh, cooking it well and eating better."
      />
      <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-5 md:grid-cols-2">
        {blogPosts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80} className="h-full">
          <Link to="/blog/$slug" params={{ slug: p.slug }} className="surface-card card-lift group flex h-full flex-col p-6">
            <p className="text-xs text-muted-foreground">
              {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {p.readTime}
            </p>
            <h2 className="mt-2 font-display text-xl leading-snug">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{p.excerpt}</p>
            <span className="mt-auto pt-4 text-sm font-semibold text-primary">
              Read article <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
