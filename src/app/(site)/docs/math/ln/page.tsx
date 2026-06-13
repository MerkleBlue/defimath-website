import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "ln — Math | DeFiMath docs",
    description: "Solidity natural logarithm in 18-decimal fixed-point. Gas-optimized at 375 gas, max rel. error 1.5e-14.",
    alternates: { canonical: "/docs/math/ln/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math" },
                { label: "ln" },
            ]}
            module="Math"
            name="ln"
            summary="Computes the natural logarithm ln(x) for a 18-decimal fixed-point input."
            gas="375"
            precision="1.5e-14"
            signature={`function ln(uint256 x) internal pure returns (int256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Input in 18-decimal fixed-point format (1e18 = 1.0). Must be > 0." },
            ]}
            returns={[
                { name: "y", type: "int256", description: "Natural logarithm ln(x) in 18-decimal fixed-point format. Signed — negative when x < 1." },
            ]}
            behaviorItems={[
                <>Supports inputs both above and below 1 — the result is signed accordingly.</>,
                <>Reverts with <code className="text-primary">LnLowerBoundError()</code> when <code className="text-primary">x == 0</code>.</>,
                <>Uses the <code className="text-primary">CLZ</code> opcode (Osaka) for fast integer-part extraction; see <a className="text-primary underline" href="https://eips.ethereum.org/EIPS/eip-7939" target="_blank" rel="noopener noreferrer">EIP-7939</a>.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Computing a natural logarithm in fixed-point requires both fast range reduction and a series that converges quickly on the reduced range. DeFiMath exploits the <code className="text-primary">CLZ</code> opcode (introduced in EVM Osaka) to do the reduction in one instruction: <code className="text-primary">floor(log2(x))</code> is just <code className="text-primary">255 − clz(integer_part)</code>. Dividing <code className="text-primary">x</code> by <code className="text-primary">2^k</code> lands the input in <code className="text-primary">[1, 2)</code>.
                    </p>
                    <p>
                        The Mercator series for <code className="text-primary">ln</code> converges slowly near <code className="text-primary">x = 2</code>, so we apply a second reduction: if the reduced <code className="text-primary">x &gt; √2</code>, divide by <code className="text-primary">√2</code>, narrowing the range to <code className="text-primary">[1, √2)</code>. We track the cumulative scale as <code className="text-primary">multiplier = 2k</code> or <code className="text-primary">2k + 1</code> and add <code className="text-primary">multiplier · ln(√2) ≈ multiplier · 0.34657…</code> to the series result at the end.
                    </p>
                    <p>
                        On <code className="text-primary">[1, √2)</code> we use the symmetric substitution <code className="text-primary">t = (x − 1) / (x + 1)</code> (which maps to <code className="text-primary">|t| &lt; 0.172</code>) and evaluate
                    </p>
                    <pre>{`ln(x) = 2 · (t + t³/3 + t⁵/5 + t⁷/7 + … + t¹⁹/19)`}</pre>
                    <p>
                        via Horner's method on <code className="text-primary">t²</code> — ten terms is enough for full 18-decimal precision on this interval. For <code className="text-primary">x &lt; 1</code> the function computes <code className="text-primary">−ln(1/x)</code> instead. Reverts on <code className="text-primary">x = 0</code> (mathematically undefined); ~375 gas including the CLZ opcode.
                    </p>
                </>
            )}
            limits={{
                errors: [
                    { name: "LnLowerBoundError", trigger: <><code className="text-primary">x == 0</code> — the natural-log domain is <code className="text-primary">x &gt; 0</code></> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

uint256 x = 2e18;            // x = 2.0
int256  y = DeFiMath.ln(x);  // y ≈ 0.69314718e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
