import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "exp — Math | DeFiMath docs",
    description: "Solidity e^x in 18-decimal fixed-point — 327 gas, 7.2e-14 max rel. / 5.0e-14 max abs. error. Range reduction plus Padé approximant in pure Yul assembly.",
    alternates: { canonical: "/docs/math/exp/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "exp" },
            ]}
            module="Math"
            name="exp"
            summary="Computes the exponential function e^x for a signed 18-decimal fixed-point input."
            gas="327"
            absError="5.0e-14"
            absErrorWhen="when |exp(x)| < 1"
            relError="7.2e-14"
            relErrorWhen="when |exp(x)| ≥ 1"
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
                        Negative inputs use the same machinery on <code className="text-primary">|x|</code>, then reciprocate: <code className="text-primary">exp(−x) = 1 / exp(x)</code>. The two endpoints are asymmetric: at <code className="text-primary">x ≥ EXP_UPPER_BOUND</code> (≈ <code className="text-primary">135.306e18</code>) a positive result would overflow <code className="text-primary">uint256</code>, so the function reverts with <code className="text-primary">ExpUpperBoundError</code>. At <code className="text-primary">x ≤ EXP_LOWER_BOUND</code> (≈ <code className="text-primary">−41.446e18</code>) the true result is sub-<code className="text-primary">1e-18</code> — not representable in 18-decimal fixed-point — so the function returns <code className="text-primary">0</code> silently as a graceful underflow rather than reverting. The whole hot path stays in <code className="text-primary">unchecked</code> Yul assembly — no library calls, ~327 gas.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "EXP_UPPER_BOUND", value: <><code className="text-primary">135.305999…e18</code> — positive-input ceiling. Above this the true result overflows <code className="text-primary">uint256</code>, so the function reverts.</> },
                    { name: "EXP_LOWER_BOUND", value: <><code className="text-primary">−41.446531…e18</code> — negative-input floor. At <code className="text-primary">x ≤ EXP_LOWER_BOUND</code> the true result is below <code className="text-primary">1e-18</code>, so the function returns <code className="text-primary">0</code> silently (no revert).</> },
                ],
                errors: [
                    { name: "ExpUpperBoundError", trigger: <><code className="text-primary">x ≥ EXP_UPPER_BOUND</code> (positive overflow only — the negative branch underflows silently to 0)</> },
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
