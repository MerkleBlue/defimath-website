import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getAllNews, getNewsItem } from "@/utils/news";
import markdownToHtml from "@/utils/markdownToHtml";

type Params = { params: { slug: string } };

export function generateStaticParams() {
    return getAllNews().map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
    const item = getNewsItem(params.slug);
    if (!item) return { title: "News | DefiMath" };
    return {
        title: `${item.title} | DefiMath`,
        description: item.excerpt ?? `DefiMath news — ${item.title}`,
    };
}

function dateLabel(iso: string): string {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : format(d, "MMM dd, yyyy");
}

export default async function Page({ params }: Params) {
    const item = getNewsItem(params.slug);
    if (!item) notFound();

    const html = await markdownToHtml(item.content);

    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-md px-4">

                    <Link
                        href="/news"
                        className="text-primary text-base font-medium hover:underline"
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

                    <h1 className="font-medium lg:text-48 md:text-40 text-32 text-white mb-8">
                        {item.title}
                    </h1>

                    <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />

                </div>
            </section>
        </main>
    );
};