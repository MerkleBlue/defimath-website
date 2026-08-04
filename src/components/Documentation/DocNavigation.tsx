"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type FunctionLink = { name: string; href: string | null };
type NavNode = {
  id: number;
  label: string;
  hash: string;
  /**
   * Where the top-level link navigates. `null` marks a **category** — a
   * clickable node that only expands/collapses and has no page of its own
   * (e.g. Derivatives). Categories carry `children`; modules carry `functions`.
   */
  topHref: string | null;
  /** Any pathname equal to this marks the node active. Omit for categories. */
  basePath?: string;
  /** Per-function doc pages, shown as an expandable sub-list under a module. */
  functions?: FunctionLink[];
  /** Sub-modules, shown as an expandable sub-list under a category. */
  children?: NavNode[];
};

const DocsNav: NavNode[] = [
  { id: 1, label: "Introduction", hash: "introduction", topHref: "/docs/" },
  {
    id: 3,
    label: "Math",
    hash: "math",
    topHref: "/docs/math/",
    basePath: "/docs/math/",
    functions: [
      { name: "exp", href: "/docs/math/exp/" },
      { name: "expm1", href: "/docs/math/expm1/" },
      { name: "ln", href: "/docs/math/ln/" },
      { name: "log1p", href: "/docs/math/log1p/" },
      { name: "log2", href: "/docs/math/log2/" },
      { name: "log10", href: "/docs/math/log10/" },
      { name: "pow", href: "/docs/math/pow/" },
      { name: "sqrt", href: "/docs/math/sqrt/" },
      { name: "cbrt", href: "/docs/math/cbrt/" },
      { name: "stdNormCDF", href: "/docs/math/stdnormcdf/" },
      { name: "erf", href: "/docs/math/erf/" },
    ],
  },
  {
    // Category: no page of its own — clicking only expands. New derivative
    // modules (Bachelier, Black-76, Barrier, Everlasting) slot in here; new
    // categories (Volatility, Markets) mirror this shape at the top level.
    id: 4,
    label: "Derivatives",
    hash: "derivatives",
    topHref: null,
    children: [
      {
        id: 41,
        label: "Black-Scholes",
        hash: "blackscholes",
        topHref: "/docs/black-scholes/",
        basePath: "/docs/black-scholes/",
        functions: [
          { name: "call", href: "/docs/black-scholes/call/" },
          { name: "put", href: "/docs/black-scholes/put/" },
          { name: "delta", href: "/docs/black-scholes/delta/" },
          { name: "gamma", href: "/docs/black-scholes/gamma/" },
          { name: "theta", href: "/docs/black-scholes/theta/" },
          { name: "vega", href: "/docs/black-scholes/vega/" },
          { name: "impliedVolatility", href: null },
        ],
      },
      { id: 42, label: "Binary options", hash: "binary", topHref: "/docs/binary/", basePath: "/docs/binary/" },
      { id: 43, label: "Futures", hash: "futures", topHref: "/docs/futures/", basePath: "/docs/futures/" },
    ],
  },
  { id: 7, label: "Rates", hash: "rates", topHref: "/docs/rates/", basePath: "/docs/rates/" },
  { id: 8, label: "Statistics", hash: "statistics", topHref: "/docs/statistics/", basePath: "/docs/statistics/" },
];

function withTrailingSlash(p: string) {
  return p.endsWith("/") ? p : p + "/";
}

type ActiveMatch = { module: NavNode; parent: NavNode | null; fn?: FunctionLink };

// Resolve the current pathname to the module it belongs to (walking one level
// into categories), plus the function page if we're on one.
function findActive(pathname: string): ActiveMatch | null {
  for (const top of DocsNav) {
    const candidates: { node: NavNode; parent: NavNode | null }[] = top.children
      ? top.children.map((c) => ({ node: c, parent: top }))
      : [{ node: top, parent: null }];
    for (const { node, parent } of candidates) {
      const fn = node.functions?.find((f) => f.href === pathname);
      if (fn) return { module: node, parent, fn };
      if (node.basePath && pathname === node.basePath) return { module: node, parent };
    }
  }
  return null;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export const DocNavigation = () => {
  const pathname = withTrailingSlash(usePathname() ?? "/docs/");
  const isIndex = pathname === "/docs/";
  const active = findActive(pathname);

  const [scrollActive, setScrollActive] = useState("introduction");
  const visibleRef = useRef<Set<string>>(new Set());

  // Scroll-spy — only when on the index page. Categories have no anchor, so
  // getElementById filters them out; in practice this tracks "introduction".
  useEffect(() => {
    if (!isIndex) return;

    const sections = DocsNav
      .map((item) => document.getElementById(item.hash))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleRef.current.add(entry.target.id);
          else visibleRef.current.delete(entry.target.id);
        }
        const topmost = DocsNav.find((item) => visibleRef.current.has(item.hash));
        if (topmost) setScrollActive(topmost.hash);
      },
      { rootMargin: "-200px 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isIndex]);

  // Expanded nodes — the path to the current page (its module, and the parent
  // category if nested) opens; navigating elsewhere collapses the rest, so the
  // sidebar reflects "where am I now." Manual toggles persist until you move.
  const pathExpanded = () => {
    const s = new Set<string>();
    if (active) {
      s.add(active.module.hash);
      if (active.parent) s.add(active.parent.hash);
    }
    return s;
  };
  const [expanded, setExpanded] = useState<Set<string>>(pathExpanded);
  useEffect(() => {
    setExpanded(pathExpanded());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggle = (hash: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(hash)) next.delete(hash);
      else next.add(hash);
      return next;
    });

  // A module row is filled when we're on its own page (not a function page).
  // On the index, the scroll-spied top-level section is filled instead.
  const isModuleFilled = (node: NavNode) =>
    isIndex
      ? node.hash === scrollActive
      : !!active && active.module.hash === node.hash && !active.fn;

  const renderModule = (item: NavNode) => {
    const expandable = !!item.functions?.length;
    const isOpen = expanded.has(item.hash);
    const filled = isModuleFilled(item);

    return (
      <div key={item.id} className="flex flex-col">
        <div
          className={`flex items-stretch rounded-md overflow-hidden ${
            filled ? "bg-primary" : "hover:bg-primary/20"
          }`}
        >
          <Link
            href={item.topHref!}
            onClick={() => isIndex && setScrollActive(item.hash)}
            className={`flex-1 py-2.5 px-4 text-base font-medium ${
              filled ? "text-darkmode" : "text-muted text-opacity-60"
            }`}
          >
            {item.label}
          </Link>
          {expandable && (
            <button
              type="button"
              onClick={() => toggle(item.hash)}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
              className={`px-3 flex items-center ${filled ? "text-darkmode" : "text-muted text-opacity-60"}`}
            >
              <ChevronIcon open={isOpen} />
            </button>
          )}
        </div>

        {expandable && isOpen && (
          <ul className="mt-0.5 mb-1 ms-3 ps-3 border-s border-dark_border border-opacity-40 flex flex-col gap-0.5">
            {item.functions!.map((fn) => {
              const isCurrent = fn.href !== null && fn.href === pathname;
              const baseClass = "block py-1.5 px-3 rounded-md text-base";
              if (fn.href) {
                return (
                  <li key={fn.name}>
                    <Link
                      href={fn.href}
                      className={`${baseClass} ${
                        isCurrent
                          ? "bg-primary text-darkmode"
                          : "text-muted text-opacity-80 hover:bg-primary/20 hover:text-primary"
                      }`}
                    >
                      {fn.name}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={fn.name}>
                  <span
                    title="Documentation coming soon"
                    className={`${baseClass} text-muted text-opacity-30 cursor-not-allowed`}
                  >
                    {fn.name}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  const renderCategory = (cat: NavNode) => {
    const isOpen = expanded.has(cat.hash);
    const hasActiveChild = active?.parent?.hash === cat.hash;

    return (
      <div key={cat.id} className="flex flex-col">
        <button
          type="button"
          onClick={() => toggle(cat.hash)}
          aria-expanded={isOpen}
          className={`flex items-center justify-between rounded-md py-2.5 px-4 text-base font-medium text-left hover:bg-primary/20 ${
            hasActiveChild ? "text-primary" : "text-muted text-opacity-60"
          }`}
        >
          <span>{cat.label}</span>
          <ChevronIcon open={isOpen} />
        </button>

        {isOpen && (
          <div className="mt-0.5 mb-1 ms-3 ps-3 border-s border-dark_border border-opacity-40 flex flex-col gap-0.5">
            {cat.children!.map((child) => renderModule(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-0.5 mt-4 items-stretch sticky top-32 pe-4 max-h-[calc(100vh-9rem)] overflow-y-auto">
      {DocsNav.map((item) => (item.children ? renderCategory(item) : renderModule(item)))}
    </div>
  );
};
