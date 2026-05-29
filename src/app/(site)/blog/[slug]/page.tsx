import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getAllBlogPosts, getBlogPost } from "@/utils/blog";
import markdownToHtml from "@/utils/markdownToHtml";
import { MarkdownContent } from "@/components/MarkdownContent";
import { JsonLd } from "@/components/JsonLd";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
    const posts = getAllBlogPosts();
    if (posts.length === 0) return [{ slug: "__placeholder__" }];
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) return { title: "Blog | DefiMath" };
    return {
        title: `${post.title} | DefiMath`,
        description: post.metaDescription ?? post.excerpt ?? `DefiMath blog — ${post.title}`,
        keywords: post.metaKeywords,
        alternates: { canonical: `/blog/${slug}/` },
    };
}

function dateLabel(iso: string): string {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : format(d, "MMM dd, yyyy");
}

export default async function Page({ params }: Params) {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) notFound();

    const html = await markdownToHtml(post.content);

    const url = `https://defimath.com/blog/${post.slug}/`;
    const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription ?? post.excerpt ?? `DefiMath blog — ${post.title}`,
        url,
        datePublished: post.date,
        dateModified: post.date,
        author: post.authorUrl
            ? { "@type": "Person", name: post.author ?? "DeFiMath", url: post.authorUrl }
            : { "@type": "Organization", name: post.author ?? "DeFiMath", url: "https://defimath.com" },
        publisher: {
            "@type": "Organization",
            name: "DeFiMath",
            url: "https://defimath.com",
            logo: {
                "@type": "ImageObject",
                url: "https://defimath.com/apple-touch-icon.png",
            },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: post.metaKeywords?.join(", "),
    };

    return (
        <main>
            <JsonLd data={blogPostingSchema} />
            <section className="relative md:pt-40 md:pb-28 pt-32 pb-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-md px-4">

                    <Link
                        href="/blog"
                        className="text-primary text-base font-medium underline"
                    >
                        ← Back to blog
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mt-8 mb-3">
                        {post.date && (
                            <span className="text-sm font-medium text-muted text-opacity-60">
                                {dateLabel(post.date)}
                            </span>
                        )}
                        {post.author && (
                            <span className="text-sm font-medium text-muted text-opacity-60">
                                ·{" "}
                                {post.authorUrl ? (
                                    <a
                                        href={post.authorUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        {post.author}
                                    </a>
                                ) : (
                                    post.author
                                )}
                            </span>
                        )}
                    </div>

                    <h1 className="font-medium lg:text-54 md:text-44 text-40 text-white mb-8">
                        {post.title}
                    </h1>

                    {post.coverImage && (
                        <div className="overflow-hidden rounded-md mb-8">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={800}
                                height={450}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    <MarkdownContent className="markdown-content" html={html} />

                </div>
            </section>
        </main>
    );
};