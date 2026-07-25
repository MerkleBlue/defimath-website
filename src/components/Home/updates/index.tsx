import Link from "next/link";
import type { ReactNode } from "react";
import { format } from "date-fns";
import { getAllBlogPosts } from "@/utils/blog";
import { getAllNews } from "@/utils/news";

const MAX_ITEMS = 3;

function dateLabel(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : format(d, "MMM dd, yyyy");
}

type CardProps = {
  href: string;
  title: string;
  date?: string;
  excerpt?: string;
};

function UpdateCard({ href, title, date, excerpt }: CardProps) {
  return (
    <Link
      href={href}
      className="group block p-5 md:p-6 rounded-md border border-dark_border border-opacity-60 hover:border-primary duration-200"
    >
      {date && (
        <div className="mb-2">
          <span className="text-sm font-medium text-muted text-opacity-60">
            {dateLabel(date)}
          </span>
        </div>
      )}
      <h3 className="text-20 font-bold text-primary">
        {title}
      </h3>
      {excerpt && (
        <p className="text-base font-semibold text-muted text-opacity-95 mt-2 line-clamp-2">
          {excerpt}
        </p>
      )}
    </Link>
  );
}

type ColumnProps = {
  heading: string;
  viewAllHref: string;
  viewAllLabel: string;
  emptyLabel: string;
  children: ReactNode;
  hasItems: boolean;
};

function Column({ heading, viewAllHref, viewAllLabel, emptyLabel, children, hasItems }: ColumnProps) {
  return (
    <div className="flex flex-col">
      <h3 className="text-white text-24 font-medium mb-6">{heading}</h3>
      {hasItems ? (
        <div className="flex flex-col gap-5">{children}</div>
      ) : (
        <p className="text-base font-medium text-muted text-opacity-95">{emptyLabel}</p>
      )}
      {hasItems && (
        <Link
          href={viewAllHref}
          className="text-primary text-base font-medium mt-6 hover:underline"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}

const Updates = () => {
  const posts = getAllBlogPosts().slice(0, MAX_ITEMS);
  const news = getAllNews().slice(0, MAX_ITEMS);

  if (posts.length === 0 && news.length === 0) return null;

  return (
    <section className="md:pt-10 sm:pt-8 pt-5" id="updates">
      <div className="container mx-auto lg:max-w-screen-xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-white sm:text-40 text-30 font-medium">
            Stay <span className="text-primary">Updated</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <Column
            heading="Latest news"
            viewAllHref="/news/"
            viewAllLabel="View all news"
            emptyLabel="No news yet — check back soon."
            hasItems={news.length > 0}
          >
            {news.map((item) => (
              <UpdateCard
                key={item.slug}
                href={`/news/${item.slug}/`}
                title={item.title}
                date={item.date}
                excerpt={item.excerpt}
              />
            ))}
          </Column>

          <Column
            heading="From the blog"
            viewAllHref="/blog/"
            viewAllLabel="View all posts"
            emptyLabel="No posts yet — check back soon."
            hasItems={posts.length > 0}
          >
            {posts.map((post) => (
              <UpdateCard
                key={post.slug}
                href={`/blog/${post.slug}/`}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
              />
            ))}
          </Column>
        </div>
      </div>
    </section>
  );
};

export default Updates;
