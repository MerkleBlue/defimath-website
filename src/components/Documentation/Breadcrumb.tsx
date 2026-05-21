import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm font-medium text-muted text-opacity-60 mb-6"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i}>
            {i > 0 && <span className="px-2">/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
};
