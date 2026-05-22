import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getAllBlogPosts, getBlogPost } from "@/utils/blog";
import markdownToHtml from "@/utils/markdownToHtml";
import { MarkdownContent } from "@/components/MarkdownContent";

type Params = { params: { slug: string } };

export function generateStaticParams() {
    const posts = getAllBlogPosts();
    if (posts.length === 0) return [{ slug: "__placeholder__" }];
    return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
    const post = getBlogPost(params.slug);
    if (!post) return { title: "Blog | DefiMath" };
    return {
        title: `${post.title} | DefiMath`,
        description: post.metaDescription ?? post.excerpt ?? `DefiMath blog — ${post.title}`,
        keywords: post.metaKeywords,
    };
}

function dateLabel(iso: string): string {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : format(d, "MMM dd, yyyy");
}

export default async function Page({ params }: Params) {
    const post = getBlogPost(params.slug);
    if (!post) notFound();

    const html = await markdownToHtml(post.content);

    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-md px-4">

                    <Link
                        href="/blog"
                        className="text-primary text-base font-medium hover:underline"
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
                                · {post.author}
                            </span>
                        )}
                    </div>

                    <h1 className="font-medium lg:text-48 md:text-40 text-32 text-white mb-8">
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