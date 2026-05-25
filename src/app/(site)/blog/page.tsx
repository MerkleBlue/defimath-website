import { Metadata } from "next";
import { getBlogPage, getBlogTotalPages } from "@/utils/blog";
import { BlogListing } from "@/components/Blog/BlogListing";

export const metadata: Metadata = {
    title: "Blog | DefiMath",
    description: "Articles and insights from the DefiMath team",
};

export default function Page() {
    const posts = getBlogPage(1);
    const totalPages = getBlogTotalPages();

    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 pt-32 pb-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-xl px-4">

                    <h1 className="font-medium lg:text-54 md:text-44 text-40 lg:text-start text-center text-white mb-10">
                        Blog
                    </h1>

                    <BlogListing posts={posts} currentPage={1} totalPages={totalPages} />

                </div>
            </section>
        </main>
    );
};