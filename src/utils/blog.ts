import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const blogDirectory = join(process.cwd(), "markdown/blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO string
  excerpt?: string;
  metaDescription?: string; // <meta name="description">; falls back to excerpt
  metaKeywords?: string[]; // <meta name="keywords">; accept YAML list or comma string
  coverImage?: string;
  author?: string;
  authorImage?: string;
  content: string; // raw markdown body
};

function toISO(value: unknown): string {
  if (!value) return "";
  const d = new Date(value as string | number | Date);
  return isNaN(d.getTime()) ? String(value) : d.toISOString();
}

function parseKeywords(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const cleaned = value.map((v) => String(v).trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (typeof value === "string") {
    const cleaned = value.split(",").map((s) => s.trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  return undefined;
}

/**
 * Reads every .md/.mdx file from markdown/blog/, parses frontmatter, and
 * returns the posts sorted newest-first. Runs at build time (static export).
 */
export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) return [];

  return fs
    .readdirSync(blogDirectory)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const { data, content } = matter(
        fs.readFileSync(join(blogDirectory, file), "utf8")
      );
      return {
        slug,
        title: typeof data.title === "string" ? data.title : slug,
        date: toISO(data.date),
        excerpt: typeof data.excerpt === "string" ? data.excerpt : undefined,
        metaDescription:
          typeof data.metaDescription === "string" ? data.metaDescription : undefined,
        metaKeywords: parseKeywords(data.metaKeywords),
        coverImage:
          typeof data.coverImage === "string" ? data.coverImage : undefined,
        author: typeof data.author === "string" ? data.author : undefined,
        authorImage:
          typeof data.authorImage === "string" ? data.authorImage : undefined,
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug);
}

export const BLOG_PAGE_SIZE = 10;

export function getBlogTotalPages(): number {
  return Math.max(1, Math.ceil(getAllBlogPosts().length / BLOG_PAGE_SIZE));
}

export function getBlogPage(page: number): BlogPost[] {
  const all = getAllBlogPosts();
  const start = (page - 1) * BLOG_PAGE_SIZE;
  return all.slice(start, start + BLOG_PAGE_SIZE);
}

/** Page 1 → "/blog", page N → "/blog/page/N". */
export function blogPageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}