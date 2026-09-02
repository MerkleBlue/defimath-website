import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "Solidity Exp Function - 289 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity e^x in 18-decimal fixed-point — 289 gas, 2.2e-14 max rel. / 3.0e-16 max abs. error. Range reduction plus Padé approximant in pure Yul assembly.",
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
            summary="Computes the natural exponential of x in 18-decimal fixed-point."
            gas="289"
            absError="3.0e-16"
            absErrorWhen="when exp(x) < 1"
            relError="2.2e-14"
            relErrorWhen="when exp(x) ≥ 1"
            signature={`function exp(int256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "int256", description: "Signed input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "Result e^x in 18-decimal fixed-point format." },
            ]}
            behaviorItems={[
                <>Handles negative inputs internally via reciprocal logic — pass any signed <code className="text-primary">int256</code>.</>,
                <>Reverts with <code className="text-primary">ExpUpperBoundError()</code> when <code className="text-primary">x ≥ 135e18</code>.</>,
                <>For very negative inputs (roughly <code className="text-primary">x &lt; −41.45e18</code>) returns 0 — a graceful underflow, not a revert.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Reduce, approximate, recover:
                    </p>
                    <pre>{`// 1. Two-stage range reduction — x = k·ln(2) + r, then r/64
uint256 k = x / LN_2;   x -= k * LN_2;   x >>= 6;   // leaves [0, ~0.0108]

// 2. Padé[3/3] on that narrow interval — a few muls, one div
(120 + 60x + 12x² + x³) / (120 − 60x + 12x² − x³)

// 3. Recover in reverse — six squarings undo the /64, a shift undoes the ln(2)
y = y * y;   y = y * y / 1e54;   // ×3  →  y⁶⁴
y <<= k;                         // × 2^k`}</pre>
                    <p>
                        Confining the costly part to an interval of width <code className="text-primary">0.0108</code> is what buys the gas: there a Padé[3/3] approximant is accurate to <code className="text-primary">1.7e-19</code>, and both reductions unwind with six squarings and a left shift. Fixed-point truncation, not the approximant, is what sets the published bound of <code className="text-primary">2.2e-14</code> relative (<code className="text-primary">3.0e-16</code> absolute near <code className="text-primary">x = 0</code>). Negative inputs run the same path on <code className="text-primary">|x|</code> and reciprocate. Full derivation in the walkthrough:{" "}
                        <a className="text-primary underline" href="/blog/solidity-exp-a-fixed-point-exponential-in-289-gas/">Solidity exp(): a fixed-point exponential in 289 gas</a>.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "EXP_UPPER_BOUND", value: <><code className="text-primary">135e18</code> — positive-input ceiling; at or above it the function reverts. Chosen just below the <code className="text-primary">~135.306e18</code> <code className="text-primary">uint256</code> wrap point so <code className="text-primary">int256(exp(x))</code> stays safe in <code className="text-primary">expm1</code>.</> },
                    { name: "EXP_LOWER_BOUND", value: <><code className="text-primary">−41.446531…e18</code> — negative-input floor. At <code className="text-primary">x ≤ EXP_LOWER_BOUND</code> the true result is below <code className="text-primary">1e-18</code>, so the function returns <code className="text-primary">0</code> silently (no revert).</> },
                ],
                errors: [
                    { name: "ExpUpperBoundError", trigger: <><code className="text-primary">x ≥ EXP_UPPER_BOUND</code> (positive overflow only — the negative branch underflows silently to 0)</> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

int256  x = 1e18;             // x = 1.0
uint256 y = Math.exp(x);  // y ≈ 2.71828e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
