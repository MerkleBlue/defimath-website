import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "log1p — Math | DeFiMath docs",
    description: "Solidity ln(1 + x) in 18-decimal fixed-point — 476 gas, 1.6e-15 max rel. / 1.0e-15 max abs. error. Taylor branch for small x preserves precision where forming 1 + x would lose it.",
    alternates: { canonical: "/docs/math/log1p/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "log1p" },
            ]}
            module="Math"
            name="log1p"
            summary="Computes ln(1 + x) while preserving full 18-digit precision near zero, where forming 1 + x for tiny x would lose most of x's significant digits."
            gas="476"
            absError="1.0e-15"
            absErrorWhen="when |log1p(x)| < 1"
            relError="1.6e-15"
            relErrorWhen="when |log1p(x)| ≥ 1"
            signature={`function log1p(int256 x) internal pure returns (int256 y)`}
            parameters={[
                { name: "x", type: "int256", description: "Signed input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "int256", description: "Result ln(1 + x) in 18-decimal fixed-point format. Signed — returns negative values for x < 0." },
            ]}
            behaviorItems={[
                <>For <code className="text-primary">|x| &lt; 0.01</code>: evaluates a 10-term alternating Taylor series <code className="text-primary">x − x²/2 + x³/3 − … − x¹⁰/10</code>, accurate to ~1e-21 truncation error at the interval boundary.</>,
                <>For <code className="text-primary">|x| ≥ 0.01</code>: falls through to <code className="text-primary"><Link href="/docs/math/ln/" className="text-primary underline">ln</Link>(uint256(1e18 + x))</code>, which has sufficient headroom that forming <code className="text-primary">1 + x</code> no longer loses precision.</>,
                <>Reverts with <code className="text-primary">Log1pLowerBoundError()</code> when <code className="text-primary">x ≤ −1e18</code> — the domain requires <code className="text-primary">1 + x &gt; 0</code>.</>,
                <>Returns 0 exactly when <code className="text-primary">x == 0</code> (Taylor series with <code className="text-primary">x = 0</code> collapses cleanly).</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Computing <code className="text-primary">ln(1 + x)</code> naively via <code className="text-primary"><Link href="/docs/math/ln/" className="text-primary underline">ln</Link>(1e18 + x)</code> is precise everywhere <em>except</em> near zero, where <code className="text-primary">1e18 + x</code> rounds away most of <code className="text-primary">x</code>&apos;s significant digits before <code className="text-primary">ln</code> even sees it. At <code className="text-primary">x = 1e3</code> (i.e. <code className="text-primary">10⁻¹⁵</code> in real terms), the addition <code className="text-primary">1e18 + 1e3</code> preserves only 3 of <code className="text-primary">x</code>&apos;s digits — the rest are lost to representational precision. The result <code className="text-primary">ln</code> returns is dominated by rounding noise.
                    </p>
                    <p>
                        <code className="text-primary">log1p</code> sidesteps this by switching strategies on the magnitude of <code className="text-primary">x</code>. For <code className="text-primary">|x| &lt; 0.01</code> we evaluate the Maclaurin series directly:
                    </p>
                    <pre>{`ln(1 + x) = x − x²/2 + x³/3 − x⁴/4 + … − x¹⁰/10`}</pre>
                    <p>
                        With 10 terms the truncation error at the interval boundary (<code className="text-primary">|x| = 0.01</code>) is on the order of <code className="text-primary">0.01¹¹ / 11</code> ≈ <code className="text-primary">9e-24</code>, well below 18-digit precision. Every term is a single integer multiply-and-divide, and crucially <code className="text-primary">x</code> never has to be added to <code className="text-primary">1</code> — its digits are preserved through every term.
                    </p>
                    <p>
                        For <code className="text-primary">|x| ≥ 0.01</code> the cancellation problem disappears: <code className="text-primary">1 + x</code> no longer rounds away <code className="text-primary">x</code>&apos;s digits, so the function falls through to <code className="text-primary"><Link href="/docs/math/ln/" className="text-primary underline">ln</Link>(uint256(1e18 + x))</code> and inherits <code className="text-primary">ln</code>&apos;s ~1e-14 precision. The split point at <code className="text-primary">0.01</code> is where the two error profiles meet.
                    </p>
                    <p>
                        The domain check <code className="text-primary">x &gt; −1e18</code> guards <code className="text-primary">ln</code>&apos;s domain: <code className="text-primary">ln</code> is only defined for positive arguments, so <code className="text-primary">1 + x</code> must be strictly positive. The function reverts cleanly with <code className="text-primary">Log1pLowerBoundError()</code> on violations rather than passing an invalid argument down the stack.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "Input domain", value: <>Signed <code className="text-primary">int256</code> with <code className="text-primary">x &gt; −1e18</code> (equivalently <code className="text-primary">1 + x &gt; 0</code>) — no named upper bound. The lower bound is enforced via Errors below.</> },
                ],
                errors: [
                    { name: "Log1pLowerBoundError", trigger: <><code className="text-primary">x ≤ −1e18</code></> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

int256 x      = 1e15;                   // x = 0.001  (small input — Taylor branch)
int256 result = DeFiMath.log1p(x);      // result ≈ 9.995e14  (≈ 0.0009995)

int256 y      = 1e18;                   // y = 1.0    (ln fallback branch)
int256 ly     = DeFiMath.log1p(y);      // ly     ≈ 0.69315e18  (= ln(2))`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
