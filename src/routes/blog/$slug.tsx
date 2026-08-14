import { Link, createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/lib/shop-data";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    const title = post ? `${post.title} — FarmFreshNow` : "Article";
    const desc = post?.excerpt ?? "Guides on storing, cooking and choosing fresh chicken.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: post?.title ?? "Article" },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        ...(post ? [] : [{ name: "robots", content: "noindex" } as const]),
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Article",
                    headline: post.title,
                    description: post.excerpt,
                    datePublished: post.date,
                    author: { "@type": "Organization", name: "FarmFreshNow" },
                    publisher: { "@type": "Organization", name: "FarmFreshNow" },
                    mainEntityOfPage: `/blog/${post.slug}`,
                  },
                  {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                      { "@type": "ListItem", position: 2, name: "Journal", item: "/blog" },
                      { "@type": "ListItem", position: 3, name: post.title, item: `/blog/${post.slug}` },
                    ],
                  },
                ],
              }),
            },
          ]
        : [],
    };
  },
  errorComponent: () => <div className="container-page py-24 text-center">Could not load this article.</div>,
  notFoundComponent: () => <div className="container-page py-24 text-center">Article not found.</div>,
  component: Post,
});

function Post() {
  const { slug } = Route.useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return <div className="container-page py-24 text-center">Article not found.</div>;

  return (
    <article className="container-page section-y">
      <div className="mx-auto max-w-2xl">
        <Link to="/blog" className="link-underline text-sm text-muted-foreground hover:text-foreground">← All articles</Link>
      <p className="mt-6 text-xs text-muted-foreground">
        {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {post.readTime}
      </p>
      <h1 className="mt-2 text-4xl leading-tight">{post.title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-pretty text-muted-foreground">
          {post.body.map((para: string) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
