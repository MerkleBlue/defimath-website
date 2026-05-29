import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getAdjacentNews, getAllNews, getNewsItem } from "@/utils/news";
import markdownToHtml from "@/utils/markdownToHtml";
import { MarkdownContent } from "@/components/MarkdownContent";
import { JsonLd } from "@/components/JsonLd";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
    return getAllNews().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const item = getNewsItem(slug);
    if (!item) return { title: "News | DefiMath" };
    return {
        title: `${item.title} | DefiMath`,
        description: item.metaDescription ?? item.excerpt ?? `DefiMath news — ${item.title}`,
        keywords: item.metaKeywords,
        alternates: { canonical: `/news/${slug}/` },
    };
}

function dateLabel(iso: string): string {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : format(d, "MMM dd, yyyy");
}

export default async function Page({ params }: Params) {
    const { slug } = await params;
    const item = getNewsItem(slug);
    if (!item) notFound();

    const html = await markdownToHtml(item.content);
    const { older, newer } = getAdjacentNews(slug);

    const url = `https://defimath.com/news/${item.slug}/`;
    const newsSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: item.title,
        description: item.metaDescription ?? item.excerpt ?? `DefiMath news — ${item.title}`,
        url,
        datePublished: item.date,
        dateModified: item.date,
        author: {
            "@type": "Organization",
            name: "DeFiMath",
            url: "https://defimath.com",
        },
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
        keywords: item.metaKeywords?.join(", "),
    };

    return (
        <main>
            <JsonLd data={newsSchema} />
            <section className="relative md:pt-40 md:pb-28 pt-32 pb-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-md px-4">

                    <Link
                        href="/news"
                        className="text-primary text-base font-medium underline"
                    >
                        ← Back to news
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mt-8 mb-3">
                        {item.version && (
                            <span className="text-sm font-semibold text-darkmode bg-primary rounded px-2.5 py-1">
                                v{item.version}
                            </span>
                        )}
                        {item.date && (
                            <span className="text-sm font-medium text-muted text-opacity-60">
                                {dateLabel(item.date)}
                            </span>
                        )}
                    </div>

                    <h1 className="font-medium lg:text-54 md:text-44 text-40 text-white mb-8">
                        {item.title}
                    </h1>

                    <MarkdownContent className="markdown-content" html={html} />

                    {(older || newer) && (
                        <nav
                            aria-label="Adjacent news"
                            className="mt-16 pt-8 border-t border-dark_border border-opacity-60 flex gap-4 flex-col sm:flex-row sm:justify-between"
                        >
                            {older ? (
                                <Link
                                    href={`/news/${older.slug}`}
                                    className="group flex-1 min-w-0 p-5 rounded-md border border-dark_border border-opacity-60 hover:border-primary duration-200"
                                >
                                    <span className="block text-sm font-medium text-muted text-opacity-60 mb-1">
                                        ← Older
                                    </span>
                                    <span className="block text-base font-medium text-white group-hover:text-primary duration-200 truncate">
                                        {older.title}
                                    </span>
                                </Link>
                            ) : (
                                <span className="flex-1" aria-hidden="true" />
                            )}

                            {newer ? (
                                <Link
                                    href={`/news/${newer.slug}`}
                                    className="group flex-1 min-w-0 p-5 rounded-md border border-dark_border border-opacity-60 hover:border-primary duration-200 sm:text-right"
                                >
                                    <span className="block text-sm font-medium text-muted text-opacity-60 mb-1">
                                        Newer →
                                    </span>
                                    <span className="block text-base font-medium text-white group-hover:text-primary duration-200 truncate">
                                        {newer.title}
                                    </span>
                                </Link>
                            ) : (
                                <span className="flex-1" aria-hidden="true" />
                            )}
                        </nav>
                    )}

                </div>
            </section>
        </main>
    );
};