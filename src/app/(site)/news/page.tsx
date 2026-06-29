import { Metadata } from "next";
import { getNewsPage, getNewsTotalPages } from "@/utils/news";
import { NewsListing } from "@/components/News/NewsListing";

export const metadata: Metadata = {
    title: "Latest News | DefiMath",
    description: "Latest DeFiMath news and release notes for the open-source Solidity library — Black-Scholes options pricing, Greeks, gas optimizations, and library milestones.",
    alternates: { canonical: "/news/" },
};

export default function Page() {
    const items = getNewsPage(1);
    const totalPages = getNewsTotalPages();

    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 pt-32 pb-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-md px-4">

                    <h1 className="font-medium lg:text-54 md:text-44 text-40 lg:text-start text-center text-white mb-10">
                        Latest News
                    </h1>

                    <NewsListing items={items} currentPage={1} totalPages={totalPages} />

                </div>
            </section>
        </main>
    );
};