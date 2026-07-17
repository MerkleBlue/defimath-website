import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "expm1 — Math | DeFiMath docs",
    description: "Solidity e^x − 1 in 18-decimal fixed-point — 407 gas, 1.0e-13 max rel. / 1.5e-13 max abs. error. Taylor branch for |x| < 0.01 preserves precision where naive exp(x) − 1 cancels.",
    alternates: { canonical: "/docs/math/expm1/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "expm1" },
            ]}
            module="Math"
            name="expm1"
            summary="Computes e^x − 1 while preserving full 18-digit precision near zero, where the naive exp(x) − 1 formula catastrophically cancels."
            gas="407"
            precision="1.0e-13 / 1.5e-13"
            precisionLabel="Max rel. / abs. error"
            signature={`function expm1(int256 x) internal pure returns (int256 y)`}
            parameters={[
                { name: "x", type: "int256", description: "Signed input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "int256", description: "Result e^x − 1 in 18-decimal fixed-point format. Signed — returns negative values for x < 0." },
            ]}
            behaviorItems={[
                <>For <code className="text-primary">|x| &lt; 0.01</code>: evaluates a 10-term Taylor series <code className="text-primary">x + x²/2! + x³/3! + … + x¹⁰/10!</code>, accurate to ~1e-29 truncation error at the interval boundary.</>,
                <>For <code className="text-primary">|x| ≥ 0.01</code>: falls through to <code className="text-primary">int256(<Link href="/docs/math/exp/" className="text-primary underline">exp</Link>(x)) − 1e18</code>, which has sufficient headroom that the subtraction no longer loses precision.</>,
                <>Inherits <Link href="/docs/math/exp/" className="text-primary underline">exp</Link>&apos;s bound: reverts with <code className="text-primary">ExpUpperBoundError()</code> when <code className="text-primary">x ≥ 135.305999…e18</code>.</>,
                <>For very negative inputs (roughly <code className="text-primary">x &lt; −41.45e18</code>) returns <code className="text-primary">−1e18</code> — the asymptotic limit of <code className="text-primary">e^x − 1</code> as <code className="text-primary">x → −∞</code>.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Computing <code className="text-primary">e^x − 1</code> naively as <code className="text-primary">exp(x) − 1e18</code> is precise everywhere <em>except</em> near zero, where both operands approach <code className="text-primary">1e18</code> and the subtraction loses most of its significant digits — classic catastrophic cancellation. At <code className="text-primary">x = 0.001</code> the true value is ~<code className="text-primary">1.0005e15</code>, but the subtraction <code className="text-primary">exp(0.001e18) − 1e18</code> can easily drop 15+ digits to rounding noise.
                    </p>
                    <p>
                        <code className="text-primary">expm1</code> sidesteps this by switching strategies on the magnitude of <code className="text-primary">x</code>. For <code className="text-primary">|x| &lt; 0.01</code> we evaluate the Maclaurin series directly:
                    </p>
                    <pre>{`e^x − 1 = x + x²/2! + x³/3! + x⁴/4! + … + x¹⁰/10!`}</pre>
                    <p>
                        With 10 terms the truncation error at the interval boundary (<code className="text-primary">|x| = 0.01</code>) is on the order of <code className="text-primary">0.01¹¹ / 11!</code> ≈ <code className="text-primary">2.5e-30</code>, well below 18-digit precision. Every term is computed as an integer multiply-and-divide, no exponential machinery needed — and because each <code className="text-primary">x</code> in the small range stays well-conditioned, no digits are lost to cancellation.
                    </p>
                    <p>
                        For <code className="text-primary">|x| ≥ 0.01</code> the cancellation problem disappears: <code className="text-primary">exp(x)</code> and <code className="text-primary">1</code> are no longer near-equal, so the function falls through to <code className="text-primary">int256(<Link href="/docs/math/exp/" className="text-primary underline">exp</Link>(x)) − 1e18</code> and inherits <code className="text-primary">exp</code>&apos;s ~5e-14 precision. The split point at <code className="text-primary">0.01</code> is where the two error profiles meet — below it the Taylor branch dominates, above it the <code className="text-primary">exp</code> branch does.
                    </p>
                    <p>
                        Note the return type is <code className="text-primary">int256</code>, not <code className="text-primary">uint256</code> like <Link href="/docs/math/exp/" className="text-primary underline">exp</Link> — <code className="text-primary">expm1</code> returns negative values for <code className="text-primary">x &lt; 0</code> (e.g. <code className="text-primary">expm1(−1) ≈ −0.632</code>).
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "EXP_UPPER_BOUND", value: <><code className="text-primary">135.305999…e18</code> — inherited from <code className="text-primary">exp</code> on the fallback branch (<code className="text-primary">|x| ≥ 0.01</code>). At <code className="text-primary">x ≥ EXP_UPPER_BOUND</code> the function reverts.</> },
                    { name: "EXP_LOWER_BOUND", value: <><code className="text-primary">−41.446531…e18</code> — also inherited from <code className="text-primary">exp</code>. At <code className="text-primary">x ≤ EXP_LOWER_BOUND</code> the inner <code className="text-primary">exp(x)</code> silently returns <code className="text-primary">0</code>, so <code className="text-primary">expm1</code> returns <code className="text-primary">−1e18</code> (the asymptotic limit of <code className="text-primary">e^x − 1</code> as <code className="text-primary">x → −∞</code>) — no revert.</> },
                ],
                errors: [
                    { name: "ExpUpperBoundError", trigger: <><code className="text-primary">x ≥ EXP_UPPER_BOUND</code> (positive overflow only — via the internal call to <code className="text-primary">exp</code>; the negative branch silently underflows to <code className="text-primary">−1e18</code>)</> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

int256 x      = 1e15;                  // x = 0.001  (small input — Taylor branch)
int256 result = DeFiMath.expm1(x);     // result ≈ 1.0005e15

int256 y      = 1e18;                  // y = 1.0    (exp fallback branch)
int256 ey     = DeFiMath.expm1(y);     // ey     ≈ 1.71828e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
