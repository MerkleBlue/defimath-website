"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type FunctionLink = { name: string; href: string | null };
type NavSection = {
  id: number;
  label: string;
  hash: string;
  /** Path of the section's index anchor on the /docs page. */
  anchorHref: string;
  /** When present, the section is expandable. */
  functions?: FunctionLink[];
};

const DocsNav: NavSection[] = [
  { id: 1, label: "Overview", hash: "overview", anchorHref: "/docs#overview" },
  { id: 2, label: "Installation", hash: "installation", anchorHref: "/docs#installation" },
  {
    id: 3,
    label: "Math",
    hash: "math",
    anchorHref: "/docs#math",
    functions: [
      { name: "exp", href: "/docs/math/exp" },
      { name: "expm1", href: null },
      { name: "ln", href: "/docs/math/ln" },
      { name: "log1p", href: null },
      { name: "log2", href: null },
      { name: "log10", href: null },
      { name: "pow", href: null },
      { name: "sqrt", href: null },
      { name: "stdNormCDF", href: null },
      { name: "erf", href: null },
    ],
  },
  { id: 4, label: "Options", hash: "options", anchorHref: "/docs#options" },
  { id: 5, label: "Binary options", hash: "binary", anchorHref: "/docs#binary" },
  { id: 6, label: "Futures", hash: "futures", anchorHref: "/docs#futures" },
  { id: 7, label: "Rates", hash: "rates", anchorHref: "/docs#rates" },
  { id: 8, label: "Statistics", hash: "statistics", anchorHref: "/docs#statistics" },
];

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
  const pathname = usePathname() ?? "/docs";
  const isIndex = pathname === "/docs" || pathname === "/docs/";

  // Active section from URL when on a function page; otherwise from scroll-spy.
  const activeFromPath = DocsNav.find(
    (s) => s.functions?.some((f) => f.href === pathname || f.href + "/" === pathname)
  );
  const activeFunctionName = activeFromPath?.functions?.find(
    (f) => f.href === pathname || f.href + "/" === pathname
  )?.name;

  const [scrollActive, setScrollActive] = useState("overview");
  const visibleRef = useRef<Set<string>>(new Set());
  // On a function page, only the function sub-link is highlighted (parent
  // section is just expanded). On the /docs index, the scroll-spy section is.
  const topLevelActive = isIndex ? scrollActive : null;

  // Scroll-spy — only when on the index page
  useEffect(() => {
    if (!isIndex) return;

    const sections = DocsNav
      .map((item) => document.getElementById(item.hash))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleRef.current.add(entry.target.id);
          } else {
            visibleRef.current.delete(entry.target.id);
          }
        }
        const topmost = DocsNav.find((item) => visibleRef.current.has(item.hash));
        if (topmost) setScrollActive(topmost.hash);
      },
      { rootMargin: "-200px 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isIndex]);

  // Expanded sections — auto-expand the active section; remember user-toggled state.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    return new Set(activeFromPath ? [activeFromPath.hash] : []);
  });
  useEffect(() => {
    if (activeFromPath) {
      setExpanded((prev) => {
        if (prev.has(activeFromPath.hash)) return prev;
        const next = new Set(prev);
        next.add(activeFromPath.hash);
        return next;
      });
    }
  }, [activeFromPath]);

  const toggle = (hash: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(hash)) next.delete(hash);
      else next.add(hash);
      return next;
    });

  const topClass = (isActive: boolean) =>
    `flex-1 py-2.5 px-4 rounded-md text-base font-medium ${
      isActive
        ? "bg-primary text-darkmode"
        : "text-muted text-opacity-60 hover:bg-primary/20 hover:text-primary"
    }`;

  return (
    <div className="flex flex-col gap-0.5 mt-4 items-stretch fixed pe-4 xl:min-w-60 lg:min-w-52">
      {DocsNav.map((item) => {
        const isActive = item.hash === topLevelActive;
        const expandable = !!item.functions?.length;
        const isOpen = expanded.has(item.hash);

        return (
          <div key={item.id} className="flex flex-col">
            <div className="flex items-center gap-1">
              <Link
                href={item.anchorHref}
                onClick={() => isIndex && setScrollActive(item.hash)}
                className={topClass(isActive)}
              >
                {item.label}
              </Link>
              {expandable && (
                <button
                  type="button"
                  onClick={() => toggle(item.hash)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                  className="p-2 rounded-md text-muted text-opacity-60 hover:bg-primary/20 hover:text-primary"
                >
                  <ChevronIcon open={isOpen} />
                </button>
              )}
            </div>

            {expandable && isOpen && (
              <ul className="mt-0.5 mb-1 ms-3 ps-3 border-s border-dark_border border-opacity-40 flex flex-col gap-0.5">
                {item.functions!.map((fn) => {
                  const isCurrent = fn.name === activeFunctionName;
                  const baseClass = "block py-1.5 px-3 rounded-md text-sm font-mono";
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
      })}
    </div>
  );
};
