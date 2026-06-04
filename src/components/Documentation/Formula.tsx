import { BlockMath, InlineMath } from "react-katex";

export function MathBlock({ children }: { children: string }) {
  return (
    <div className="my-4 overflow-x-auto text-base text-muted text-opacity-95">
      <BlockMath math={children} />
    </div>
  );
}

export function MathInline({ children }: { children: string }) {
  return <InlineMath math={children} />;
}
