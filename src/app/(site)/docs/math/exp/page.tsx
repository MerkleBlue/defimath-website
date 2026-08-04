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
                        The challenge is approximating <code className="text-primary">e^x</code> accurately across a wide input range with only integer arithmetic. DeFiMath applies a two-stage range reduction. <strong>Stage 1</strong> splits <code className="text-primary">x = k · ln(2) + r</code> with integer <code className="text-primary">k</code> and <code className="text-primary">r ∈ [0, ln(2))</code>, so <code className="text-primary">e^x = 2^k · e^r</code> — the <code className="text-primary">2^k</code> factor becomes a free left shift. <strong>Stage 2</strong> divides <code className="text-primary">r</code> by 64 (a right-shift by 6): <code className="text-primary">r' = r / 64 ∈ [0, ~0.0108]</code>, confining the costly part to a tiny interval.
                    </p>
                    <p>
                        On that interval a <strong>[3,3] Padé approximant</strong> approximates <code className="text-primary">e^r&apos;</code> with a handful of multiplies and a single integer division:
                    </p>
                    <pre>{`e^r' ≈ (120 + 60r' + 12r'² + r'³) / (120 − 60r' + 12r'² − r'³)`}</pre>
                    <p>
                        The two reductions are then undone in reverse: the result is raised to the 64th power via six successive squarings (<code className="text-primary">y² → y⁴ → … → y⁶⁴</code>) to invert the <code className="text-primary">r / 64</code> step, then left-shifted by <code className="text-primary">k</code> to apply the <code className="text-primary">2^k</code> factor. Those squarings amplify the approximant&apos;s relative error, so the finished <code className="text-primary">exp</code> holds to a max relative error of <code className="text-primary">2.2e-14</code> (and <code className="text-primary">3.0e-16</code> absolute near the root <code className="text-primary">x = 0</code>).
                    </p>
                    <p>
                        Negative inputs use the same machinery on <code className="text-primary">|x|</code>, then reciprocate: <code className="text-primary">exp(−x) = 1 / exp(x)</code>. The two endpoints are asymmetric: at <code className="text-primary">x ≥ EXP_UPPER_BOUND</code> (<code className="text-primary">135e18</code>) the function reverts with <code className="text-primary">ExpUpperBoundError</code>. The cap sits just below the <code className="text-primary">~135.306e18</code> point where the result would wrap <code className="text-primary">uint256</code> — the small margin keeps <code className="text-primary">int256(exp(x))</code> safe inside <code className="text-primary">expm1</code> even after approximation-error headroom, and <code className="text-primary">exp(135) ≈ 4.3e58</code> is already astronomically large. At <code className="text-primary">x ≤ EXP_LOWER_BOUND</code> (≈ <code className="text-primary">−41.446e18</code>) the true result is sub-<code className="text-primary">1e-18</code> — not representable in 18-decimal fixed-point — so the function returns <code className="text-primary">0</code> silently as a graceful underflow rather than reverting. The whole hot path stays in <code className="text-primary">unchecked</code> Yul assembly — no library calls, ~289 gas.
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
