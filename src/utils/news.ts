import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const newsDirectory = join(process.cwd(), "markdown/news");

export type NewsItem = {
  slug: string;
  title: string;
  date: string; // ISO string
  version?: string;
  excerpt?: string;
  content: string; // raw markdown body
};

function toISO(value: unknown): string {
  if (!value) return "";
  const d = new Date(value as string | number | Date);
  return isNaN(d.getTime()) ? String(value) : d.toISOString();
}

/**
 * Reads every .md/.mdx file from markdown/news/, parses frontmatter, and
 * returns the items sorted newest-first. Runs at build time (static export).
 */
export function getAllNews(): NewsItem[] {
  if (!fs.existsSync(newsDirectory)) return [];

  return fs
    .readdirSync(newsDirectory)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const { data, content } = matter(
        fs.readFileSync(join(newsDirectory, file), "utf8")
      );
      return {
        slug,
        title: typeof data.title === "string" ? data.title : slug,
        date: toISO(data.date),
        version: data.version != null ? String(data.version) : undefined,
        excerpt: typeof data.excerpt === "string" ? data.excerpt : undefined,
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getNewsItem(slug: string): NewsItem | undefined {
  return getAllNews().find((item) => item.slug === slug);
}

/** Adjacent items in chronological order: `older` = previous in time, `newer` = next in time. */
export function getAdjacentNews(slug: string): { older?: NewsItem; newer?: NewsItem } {
  const all = getAllNews(); // sorted newest-first
  const idx = all.findIndex((item) => item.slug === slug);
  if (idx < 0) return {};
  return {
    newer: idx > 0 ? all[idx - 1] : undefined,
    older: idx < all.length - 1 ? all[idx + 1] : undefined,
  };
}

export const NEWS_PAGE_SIZE = 10;

export function getNewsTotalPages(): number {
  return Math.max(1, Math.ceil(getAllNews().length / NEWS_PAGE_SIZE));
}

export function getNewsPage(page: number): NewsItem[] {
  const all = getAllNews();
  const start = (page - 1) * NEWS_PAGE_SIZE;
  return all.slice(start, start + NEWS_PAGE_SIZE);
}

/** Page 1 → "/news", page N → "/news/page/N". */
export function newsPageHref(page: number): string {
  return page <= 1 ? "/news" : `/news/page/${page}`;
}