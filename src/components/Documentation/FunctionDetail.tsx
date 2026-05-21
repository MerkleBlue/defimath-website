import Link from "next/link";
import { ReactNode } from "react";

type ParamRow = { name: string; type: string; description: ReactNode };

type Props = {
  /** e.g. ["Math", "exp"] — last segment is the page title */
  breadcrumb: string[];
  /** Module label shown as a pill next to the heading (e.g. "Math") */
  module: string;
  /** Function name without parens — heading shows it monospace */
  name: string;
  /** One-line summary under the heading */
  summary: ReactNode;
  /** Gas cost label (e.g. "333") */
  gas?: string;
  /** Precision (e.g. "5.1e-14") */
  precision?: string;
  /** Full Solidity signature, shown verbatim in a code block */
  signature: string;
  parameters?: ParamRow[];
  returns?: ParamRow[];
  /** Free-form behavior notes (rendered as a <ul> of items you pass) */
  behaviorItems?: ReactNode[];
  /** Solidity usage example, shown verbatim in a code block */
  example?: string;
  /** Optional related-section link shown at the bottom */
  parentSectionHref?: string;
  parentSectionLabel?: string;
};

const ParamTable = ({ rows }: { rows: ParamRow[] }) => (
  <div className="mt-4 rounded-md border border-dark_border border-opacity-60 overflow-x-auto">
    <table className="w-full text-base">
      <thead>
        <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
          <th className="py-3 px-4 font-medium whitespace-nowrap">Name</th>
          <th className="py-3 px-4 font-medium whitespace-nowrap">Type</th>
          <th className="py-3 px-4 font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={r.name}
            className={i < rows.length - 1 ? "border-b border-dark_border border-opacity-20" : ""}
          >
            <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">{r.name}</td>
            <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">{r.type}</td>
            <td className="py-2 px-4 text-muted text-opacity-95">{r.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 rounded-md border border-dark_border border-opacity-60">
    <p className="text-sm font-medium text-muted text-opacity-60">{label}</p>
    <p className="text-primary text-xl font-semibold mt-1">{value}</p>
  </div>
);

export const FunctionDetail = ({
  breadcrumb,
  module,
  name,
  summary,
  gas,
  precision,
  signature,
  parameters,
  returns,
  behaviorItems,
  example,
  parentSectionHref,
  parentSectionLabel,
}: Props) => {
  return (
    <article className="pt-4 pb-10">
      <nav aria-label="Breadcrumb" className="text-sm font-medium text-muted text-opacity-60">
        <Link href="/docs" className="hover:text-primary">Docs</Link>
        {breadcrumb.map((segment, i) => (
          <span key={i}>
            {" / "}
            {i === breadcrumb.length - 1 ? (
              <span className="text-white">{segment}</span>
            ) : (
              <span>{segment}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-3 mt-6 mb-3">
        <h1 className="font-mono text-white text-3xl md:text-4xl font-semibold">
          {name}
        </h1>
        <span className="text-sm font-semibold text-darkmode bg-primary rounded px-2.5 py-1">
          {module}
        </span>
      </div>

      <p className="text-base font-medium text-muted text-opacity-95 mt-2">
        {summary}
      </p>

      {(gas || precision) && (
        <div className="grid grid-cols-2 gap-4 mt-6 max-w-md">
          {gas && <Stat label="Gas" value={gas} />}
          {precision && <Stat label="Max abs. error" value={precision} />}
        </div>
      )}

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Signature</h2>
      <pre className="py-4 px-4 rounded-md bg-darkmode border-l-4 border-[#FF7A66] overflow-x-auto">
        <code className="text-base text-[#FF7A66] font-mono whitespace-pre">{signature}</code>
      </pre>

      {parameters && parameters.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-white mt-10 mb-3">Parameters</h2>
          <ParamTable rows={parameters} />
        </>
      )}

      {returns && returns.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-white mt-10 mb-3">Returns</h2>
          <ParamTable rows={returns} />
        </>
      )}

      {behaviorItems && behaviorItems.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-white mt-10 mb-3">Behavior</h2>
          <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
            {behaviorItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {example && (
        <>
          <h2 className="text-xl font-semibold text-white mt-10 mb-3">Example</h2>
          <pre className="py-4 px-4 rounded-md bg-darkmode border-l-4 border-[#FF7A66] overflow-x-auto">
            <code className="text-base text-[#FF7A66] font-mono whitespace-pre">{example}</code>
          </pre>
        </>
      )}

      {parentSectionHref && parentSectionLabel && (
        <div className="mt-12 pt-6 border-t border-dark_border border-opacity-60">
          <Link href={parentSectionHref} className="text-primary text-base font-medium hover:underline">
            ← {parentSectionLabel}
          </Link>
        </div>
      )}
    </article>
  );
};
