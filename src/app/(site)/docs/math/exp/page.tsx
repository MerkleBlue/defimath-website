import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "exp — Math | DeFiMath docs",
    description: "Solidity exponential function e^x in 18-decimal fixed-point. Gas-optimized at 333 gas, max rel. error 5.1e-14.",
    alternates: { canonical: "/docs/math/exp/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math" },
                { label: "exp" },
            ]}
            module="Math"
            name="exp"
            summary="Computes the exponential function e^x for a signed 18-decimal fixed-point input."
            gas="333"
            precision="5.1e-14"
            signature={`function exp(int256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "int256", description: "Signed input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "Result e^x in 18-decimal fixed-point format." },
            ]}
            behaviorItems={[
                <>Handles negative inputs internally via reciprocal logic — pass any signed <code className="text-primary">int256</code>.</>,
                <>Reverts with <code className="text-primary">ExpUpperBoundError()</code> when <code className="text-primary">x ≥ 135.305999…e18</code>.</>,
                <>For very negative inputs (roughly <code className="text-primary">x &lt; −41.45e18</code>) returns 0 — a graceful underflow, not a revert.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        The fundamental challenge is approximating <code className="text-primary">e^x</code> accurately across a wide input range using only integer arithmetic. DeFiMath uses a three-stage reduction: split <code className="text-primary">x = k · ln(2) + r</code> where <code className="text-primary">k</code> is an integer and <code className="text-primary">r ∈ [0, ln(2)]</code>, then <code className="text-primary">e^x = 2^k · e^r</code>. This turns the <code className="text-primary">2^k</code> factor into a free left shift and confines the costly part to a small interval.
                    </p>
                    <p>
                        We then reduce <code className="text-primary">r</code> further by dividing by 256, giving <code className="text-primary">r' ∈ [0, ~0.0027]</code>. On this tiny interval the [2,2] Padé approximant
                    </p>
                    <pre>{`e^r' ≈ ((r' + 3)² + 3) / ((r' − 3)² + 3)`}</pre>
                    <p>
                        is accurate to well below 18-decimal precision in just two squarings and a single integer division. To undo the 256× reduction we raise the result to the 256th power — four quartic squarings (<code className="text-primary">y⁴</code>, then <code className="text-primary">y¹⁶</code>, <code className="text-primary">y⁶⁴</code>, <code className="text-primary">y²⁵⁶</code>). Finally we shift left by <code className="text-primary">k</code> to apply the <code className="text-primary">2^k</code> factor.
                    </p>
                    <p>
                        Negative inputs use the same machinery on <code className="text-primary">|x|</code>, then reciprocate: <code className="text-primary">exp(−x) = 1 / exp(x)</code>. Inputs with <code className="text-primary">|x| ≥ 135.305…</code> would overflow <code className="text-primary">uint256</code>, so the function reverts above that bound; inputs below <code className="text-primary">−41.45e18</code> underflow to 0 (the true value is sub-1e-18). The whole hot path stays in <code className="text-primary">unchecked</code> Yul assembly — no library calls, ~333 gas.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "Input |x|", value: <><code className="text-primary">&lt; 135.305999…e18</code> (reverts above this magnitude; for very negative <code className="text-primary">x &lt; −41.45e18</code> underflows silently to 0)</> },
                ],
                errors: [
                    { name: "ExpUpperBoundError", trigger: <><code className="text-primary">|x| ≥ 135.305999…e18</code></> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

int256  x = 1e18;             // x = 1.0
uint256 y = DeFiMath.exp(x);  // y ≈ 2.71828e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
