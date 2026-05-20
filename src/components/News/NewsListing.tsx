import Link from "next/link";
import { format } from "date-fns";
import type { NewsItem } from "@/utils/news";
import { newsPageHref } from "@/utils/news";

function dateLabel(iso: string): string {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : format(d, "MMM dd, yyyy");
}

type Props = {
    items: NewsItem[];
    currentPage: number;
    totalPages: number;
};

export function NewsListing({ items, currentPage, totalPages }: Props) {
    return (
        <>
            {items.length === 0 && (
                <p className="text-base font-medium text-muted text-opacity-95">
                    No news yet — check back soon.
                </p>
            )}

            <div className="flex flex-col gap-6">
                {items.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/news/${item.slug}`}
                        className="group block p-6 md:p-8 rounded-md border border-dark_border border-opacity-60 hover:border-primary duration-200"
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-3">
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
                        <h2 className="font-medium lg:text-32 md:text-28 text-24 text-white mb-3 group-hover:text-primary duration-200">
                            {item.title}
                        </h2>
                        {item.excerpt && (
                            <p className="text-base font-medium text-muted text-opacity-95 mb-3">
                                {item.excerpt}
                            </p>
                        )}
                        <span className="text-primary text-base font-medium">
                            Read more
                        </span>
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
        </>
    );
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    const pageBtn = "min-w-[2.5rem] h-10 px-3 inline-flex items-center justify-center rounded-md text-base font-medium border";
    const active = "bg-primary text-darkmode border-primary";
    const inactive = "text-muted text-opacity-80 border-dark_border border-opacity-60 hover:border-primary hover:text-primary duration-200";
    const disabled = "text-muted text-opacity-30 border-dark_border border-opacity-30 pointer-events-none";

    return (
        <nav
            aria-label="News pagination"
            className="flex items-center justify-center gap-2 mt-10 flex-wrap"
        >
            {prevPage ? (
                <Link href={newsPageHref(prevPage)} className={`${pageBtn} ${inactive}`} aria-label="Previous page">
                    ← Prev
                </Link>
            ) : (
                <span className={`${pageBtn} ${disabled}`} aria-hidden="true">← Prev</span>
            )}

            {pages.map((p) =>
                p === currentPage ? (
                    <span key={p} className={`${pageBtn} ${active}`} aria-current="page">
                        {p}
                    </span>
                ) : (
                    <Link key={p} href={newsPageHref(p)} className={`${pageBtn} ${inactive}`}>
                        {p}
                    </Link>
                )
            )}

            {nextPage ? (
                <Link href={newsPageHref(nextPage)} className={`${pageBtn} ${inactive}`} aria-label="Next page">
                    Next →
                </Link>
            ) : (
                <span className={`${pageBtn} ${disabled}`} aria-hidden="true">Next →</span>
            )}
        </nav>
    );
}