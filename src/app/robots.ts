import type { MetadataRoute } from "next";

/**
 * Generates robots.txt at build time. Next.js writes it to the export root,
 * so it's served at https://defimath.com/robots.txt.
 *
 * Crawl rules and the sitemap pointer live here. Update if specific paths
 * need to be disallowed (e.g. a paywall or auth-gated section).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://defimath.com/sitemap.xml",
  };
}
