import Link from "next/link";
import { ReactNode } from "react";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";
import { CodeBlock } from "../CodeBlock";
import { DocPageNav } from "./DocPageNav";

type ParamRow = { name: string; type: string; description: ReactNode };

type Props = {
  /** Breadcrumb segments after the leading "Docs" link (which is auto-prepended). */
  breadcrumb: BreadcrumbItem[];
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
  /** Label for the precision stat. Defaults to "Max rel. error" (math/rates/stats).
   *  Pass "Max abs. error" for derivatives (options/binary/futures) where the
   *  benchmark is absolute error in price/Greek units. */
  precisionLabel?: string;
  /** Full Solidity signature, shown verbatim in a code block */
  signature: string;
  parameters?: ParamRow[];
  returns?: ParamRow[];
  /** Free-form behavior notes (rendered as a <ul> of items you pass) */
  behaviorItems?: ReactNode[];
  /** Optional algorithm/implementation explainer, rendered as paragraphs */
  howItWorks?: ReactNode;
  /** Optional limits section — constants and/or errors specific to this function. */
  limits?: {
    constants?: { name: string; value: ReactNode }[];
    errors?: { name: string; trigger: ReactNode }[];
  };
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

export const FunctionDetail = async ({
  breadcrumb,
  module,
  name,
  summary,
  gas,
  precision,
  precisionLabel = "Max rel. error",
  signature,
  parameters,
  returns,
  behaviorItems,
  howItWorks,
  limits,
  example,
  parentSectionHref,
  parentSectionLabel,
}: Props) => {
  return (
    <article className="pb-10">
      <Breadcrumb items={[{ label: "Docs", href: "/docs" }, ...breadcrumb]} />

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h1 className="font-mono text-white text-40 md:text-44 lg:text-54 font-semibold">
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
          {precision && <Stat label={precisionLabel} value={precision} />}
        </div>
      )}

      <h2 id="signature" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Signature</h2>
      <CodeBlock code={signature} variant="accent" />

      {parameters && parameters.length > 0 && (
        <>
          <h2 id="parameters" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Parameters</h2>
          <ParamTable rows={parameters} />
        </>
      )}

      {returns && returns.length > 0 && (
        <>
          <h2 id="returns" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Returns</h2>
          <ParamTable rows={returns} />
        </>
      )}

      {limits?.constants && limits.constants.length > 0 && (
        <>
          <h2 id="limits" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Limits</h2>
          <div className="rounded-md border border-dark_border border-opacity-60 overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Bound</th>
                  <th className="py-3 px-4 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {limits.constants.map((c, i) => (
                  <tr
                    key={c.name}
                    className={i < limits.constants!.length - 1 ? "border-b border-dark_border border-opacity-20" : ""}
                  >
                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">{c.name}</td>
                    <td className="py-2 px-4 text-muted text-opacity-95">{c.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {behaviorItems && behaviorItems.length > 0 && (
        <>
          <h2 id="behavior" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Behavior</h2>
          <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
            {behaviorItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {howItWorks && (
        <>
          <h2 id="how-it-works" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">How it works</h2>
          <div className="space-y-4 text-base font-medium text-muted text-opacity-95 [&>pre]:rounded-md [&>pre]:bg-dark_grey [&>pre]:px-4 [&>pre]:py-3 [&>pre]:text-sm [&>pre]:font-mono [&>pre]:overflow-x-auto">
            {howItWorks}
          </div>
        </>
      )}

      {limits?.errors && limits.errors.length > 0 && (
        <>
          <h2 id="errors" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Errors</h2>
          <div className="rounded-md border border-dark_border border-opacity-60 overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Error</th>
                  <th className="py-3 px-4 font-medium">Trigger</th>
                </tr>
              </thead>
              <tbody>
                {limits.errors.map((e, i) => (
                  <tr
                    key={e.name}
                    className={i < limits.errors!.length - 1 ? "border-b border-dark_border border-opacity-20" : ""}
                  >
                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">{e.name}</td>
                    <td className="py-2 px-4 text-muted text-opacity-95">{e.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {example && (
        <>
          <h2 id="example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Example</h2>
          <CodeBlock code={example} variant="accent" />
        </>
      )}

      {parentSectionHref && parentSectionLabel && (
        <div className="mt-12 pt-6 border-t border-dark_border border-opacity-60">
          <Link href={parentSectionHref} className="text-primary text-base font-medium underline">
            ← {parentSectionLabel}
          </Link>
        </div>
      )}

      <DocPageNav />
    </article>
  );
};
