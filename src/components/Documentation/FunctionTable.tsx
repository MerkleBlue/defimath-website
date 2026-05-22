import Link from "next/link";

type Row = {
  name: string;
  gas: string;
  description: string;
  /** When set, the function name renders as a link to this URL (its Layer-3 page). */
  href?: string;
};

export const FunctionTable = ({ rows }: { rows: Row[] }) => {
  return (
    <div className="mt-6 p-2 md:p-4 rounded-md border border-dark_border border-opacity-60 overflow-x-auto">
      <table className="w-full text-base">
        <thead>
          <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
            <th className="py-3 px-3 font-medium">Function</th>
            <th className="py-3 px-3 font-medium whitespace-nowrap">Gas</th>
            <th className="py-3 px-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.name}
              className={
                i < rows.length - 1
                  ? "border-b border-dark_border border-opacity-20"
                  : ""
              }
            >
              <td className="py-2 px-3 font-mono text-primary whitespace-nowrap">
                {r.href ? (
                  <Link href={r.href} className="hover:underline">
                    {r.name}
                  </Link>
                ) : (
                  r.name
                )}
              </td>
              <td className="py-2 px-3 text-muted text-opacity-95 whitespace-nowrap">
                {r.gas}
              </td>
              <td className="py-2 px-3 text-muted text-opacity-95">
                {r.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
