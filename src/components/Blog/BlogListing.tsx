import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { BlogPost } from "@/utils/blog";
import { blogPageHref } from "@/utils/blog";

function dateLabel(iso: string): string {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : format(d, "MMM dd, yyyy");
}

type Props = {
    posts: BlogPost[];
    currentPage: number;
    totalPages: number;
};

export function BlogListing({ posts, currentPage, totalPages }: Props) {
    return (
        <>
            {posts.length === 0 && (
                <p className="text-base font-medium text-muted text-opacity-95">
                    No posts yet — check back soon.
                </p>
            )}

            <div className="grid grid-cols-12 gap-7">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}/`}
                        className="group md:col-span-4 col-span-12 flex flex-col rounded-md border border-dark_border border-opacity-60 overflow-hidden hover:border-primary duration-200"
                    >
                        {post.coverImage && (
                            <div className="overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    width={400}
                                    height={250}
                                    className="w-full h-auto group-hover:scale-110 duration-300"
                                />
                            </div>
                        )}
                        <div className="p-6 flex flex-col gap-2">
                            {post.date && (
                                <span className="text-sm font-medium text-muted text-opacity-60">
                                    {dateLabel(post.date)}
                                </span>
                            )}
                            <h2 className="text-22 font-medium text-white group-hover:text-primary duration-200">
                                {post.title}
                            </h2>
                            {post.excerpt && (
                                <p className="text-base font-medium text-muted text-opacity-95">
                                    {post.excerpt}
                                </p>
                            )}
                            <span className="text-primary text-base font-medium mt-1">
                                Read more
                            </span>
                        </div>
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
            aria-label="Blog pagination"
            className="flex items-center justify-center gap-2 mt-10 flex-wrap"
        >
            {prevPage ? (
                <Link href={blogPageHref(prevPage)} className={`${pageBtn} ${inactive}`} aria-label="Previous page">
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
                    <Link key={p} href={blogPageHref(p)} className={`${pageBtn} ${inactive}`}>
                        {p}
                    </Link>
                )
            )}

            {nextPage ? (
                <Link href={blogPageHref(nextPage)} className={`${pageBtn} ${inactive}`} aria-label="Next page">
                    Next →
                </Link>
            ) : (
                <span className={`${pageBtn} ${disabled}`} aria-hidden="true">Next →</span>
            )}
        </nav>
    );
}