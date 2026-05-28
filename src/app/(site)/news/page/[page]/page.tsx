import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsPage, getNewsTotalPages } from "@/utils/news";
import { NewsListing } from "@/components/News/NewsListing";

type Params = { params: Promise<{ page: string }> };

export function generateStaticParams() {
    // Page 1 lives at /news, so only generate pages 2..N here.
    // `output: export` requires ≥1 entry — when there is no real page 2, emit a
    // placeholder that the page handler turns into a 404 via notFound().
    const total = Math.max(2, getNewsTotalPages());
    return Array.from({ length: total - 1 }, (_, i) => ({
        page: String(i + 2),
    }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { page } = await params;
    return {
        title: `News — Page ${page} | DefiMath`,
        description: "Older news and release notes from DefiMath",
        alternates: { canonical: `/news/page/${page}/` },
    };
}

export default async function Page({ params }: Params) {
    const { page } = await params;
    const pageNum = Number(page);
    const totalPages = getNewsTotalPages();
    if (!Number.isInteger(pageNum) || pageNum < 2 || pageNum > totalPages) {
        notFound();
    }

    const items = getNewsPage(pageNum);

    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 pt-32 pb-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-md px-4">

                    <h1 className="font-medium lg:text-54 md:text-44 text-40 lg:text-start text-center text-white mb-10">
                        Latest News
                    </h1>

                    <NewsListing items={items} currentPage={pageNum} totalPages={totalPages} />

                </div>
            </section>
        </main>
    );
};