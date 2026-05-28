import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPage, getBlogTotalPages } from "@/utils/blog";
import { BlogListing } from "@/components/Blog/BlogListing";

type Params = { params: Promise<{ page: string }> };

export function generateStaticParams() {
    // Page 1 lives at /blog, so only generate pages 2..N here.
    // `output: export` requires ≥1 entry — when there is no real page 2, emit a
    // placeholder that the page handler turns into a 404 via notFound().
    const total = Math.max(2, getBlogTotalPages());
    return Array.from({ length: total - 1 }, (_, i) => ({
        page: String(i + 2),
    }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { page } = await params;
    return {
        title: `Blog — Page ${page} | DefiMath`,
        description: "Older posts from the DefiMath blog",
        alternates: { canonical: `/blog/page/${page}/` },
    };
}

export default async function Page({ params }: Params) {
    const { page } = await params;
    const pageNum = Number(page);
    const totalPages = getBlogTotalPages();
    if (!Number.isInteger(pageNum) || pageNum < 2 || pageNum > totalPages) {
        notFound();
    }

    const posts = getBlogPage(pageNum);

    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 pt-32 pb-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-xl px-4">

                    <h1 className="font-medium lg:text-54 md:text-44 text-40 lg:text-start text-center text-white mb-10">
                        Blog
                    </h1>

                    <BlogListing posts={posts} currentPage={pageNum} totalPages={totalPages} />

                </div>
            </section>
        </main>
    );
};