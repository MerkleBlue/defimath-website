"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/// Flat ordered list of every docs page, matching the sidebar order in
/// DocNavigation.tsx. Drop the <DocPageNav /> component at the bottom of any
/// docs page; it auto-locates the current pathname and renders prev/next links.
type DocPage = { href: string; title: string };

const PAGES: DocPage[] = [
  { href: "/docs/", title: "Introduction" },
  { href: "/docs/math/", title: "Math" },
  { href: "/docs/math/exp/", title: "exp" },
  { href: "/docs/math/expm1/", title: "expm1" },
  { href: "/docs/math/ln/", title: "ln" },
  { href: "/docs/math/log1p/", title: "log1p" },
  { href: "/docs/math/log2/", title: "log2" },
  { href: "/docs/math/log10/", title: "log10" },
  { href: "/docs/math/pow/", title: "pow" },
  { href: "/docs/math/sqrt/", title: "sqrt" },
  { href: "/docs/math/cbrt/", title: "cbrt" },
  { href: "/docs/math/stdnormcdf/", title: "stdNormCDF" },
  { href: "/docs/math/erf/", title: "erf" },
  { href: "/docs/options/", title: "Options" },
  { href: "/docs/options/calloptionprice/", title: "callOptionPrice" },
  { href: "/docs/options/putoptionprice/", title: "putOptionPrice" },
  { href: "/docs/binary/", title: "Binary options" },
  { href: "/docs/futures/", title: "Futures" },
  { href: "/docs/rates/", title: "Rates" },
  { href: "/docs/statistics/", title: "Statistics" },
];

function stripTrailingSlash(p: string) {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

export const DocPageNav = () => {
  const pathname = stripTrailingSlash(usePathname() ?? "/docs");
  const idx = PAGES.findIndex((p) => p.href === pathname);
  if (idx < 0) return null;

  const prev = idx > 0 ? PAGES[idx - 1] : null;
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Adjacent docs pages"
      className="mt-16 pt-8 border-t border-dark_border border-opacity-60 flex gap-4 flex-col sm:flex-row sm:justify-between"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex-1 min-w-0 p-5 rounded-md border border-dark_border border-opacity-60 hover:border-primary duration-200"
        >
          <span className="block text-sm font-medium text-muted text-opacity-60 mb-1">← Previous</span>
          <span className="block text-base font-medium text-white group-hover:text-primary duration-200 truncate">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1" aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex-1 min-w-0 p-5 rounded-md border border-dark_border border-opacity-60 hover:border-primary duration-200 sm:text-right"
        >
          <span className="block text-sm font-medium text-muted text-opacity-60 mb-1">Next →</span>
          <span className="block text-base font-medium text-white group-hover:text-primary duration-200 truncate">
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1" aria-hidden="true" />
      )}
    </nav>
  );
};
