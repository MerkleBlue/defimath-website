import type { MetadataRoute } from "next";
import { getAllBlogPosts, getBlogTotalPages } from "@/utils/blog";
import { getAllNews, getNewsTotalPages } from "@/utils/news";

// Required by Next.js 16 with `output: "export"` — generates sitemap.xml at
// build time rather than treating this route as dynamic.
export const dynamic = "force-static";

/**
 * Generates sitemap.xml at build time. Next.js writes it to the export root,
 * so it's served at https://defimath.com/sitemap.xml.
 *
 * When you add a new page, add its path to STATIC_PAGES below. Blog and news
 * posts are auto-discovered from `markdown/{blog,news}/*.mdx`, so those need
 * no manual update.
 */
type Entry = {
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

// Update this list when you add a new static page (anything except blog/news
// detail pages, which are picked up automatically). The path must include
// trailing slash to match the trailingSlash: true config.
const STATIC_PAGES: Entry[] = [
  // Marketing + landing
  { path: "/", changeFrequency: "weekly", priority: 1.0 },

  // Docs landing + module overviews
  { path: "/docs/", changeFrequency: "weekly", priority: 0.9 },
  { path: "/docs/math/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/docs/options/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/docs/binary/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/docs/futures/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/docs/rates/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/docs/statistics/", changeFrequency: "monthly", priority: 0.9 },

  // Per-function pages
  { path: "/docs/math/exp/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/math/ln/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/math/pow/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/math/sqrt/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/math/cbrt/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/math/erf/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/docs/math/stdnormcdf/", changeFrequency: "monthly", priority: 0.8 },

  // Blog + news index
  { path: "/blog/", changeFrequency: "weekly", priority: 0.7 },
  { path: "/news/", changeFrequency: "weekly", priority: 0.7 },

  // Legal
  { path: "/privacy/", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms/", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://defimath.com";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Blog detail pages — auto-discovered, lastModified = post date
  const blogPosts = getAllBlogPosts().map((post) => ({
    url: `${base}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  // News detail pages — same treatment
  const newsPosts = getAllNews().map((item) => ({
    url: `${base}/news/${item.slug}/`,
    lastModified: item.date ? new Date(item.date) : now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  // Pagination pages 2..N (page 1 lives at /blog and /news, already listed)
  const blogPages: MetadataRoute.Sitemap = [];
  for (let i = 2; i <= getBlogTotalPages(); i++) {
    blogPages.push({
      url: `${base}/blog/page/${i}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    });
  }
  const newsPages: MetadataRoute.Sitemap = [];
  for (let i = 2; i <= getNewsTotalPages(); i++) {
    newsPages.push({
      url: `${base}/news/page/${i}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    });
  }

  return [...staticEntries, ...blogPosts, ...newsPosts, ...blogPages, ...newsPages];
}
