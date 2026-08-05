import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-76 Vega - 1659 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-76 vega (per 1% vol move) on a future, 18-decimal fixed-point — 1,659 gas, 5e-12 max rel. / 4e-13 max abs. error. ν = e^(−rτ)·F·φ(d₁)·√τ / 100.",
    alternates: { canonical: "/docs/black-76/vega/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-76", href: "/docs/black-76/" },
                { label: "vega" },
            ]}
            module="Black-76"
            name="vega"
            summary="Computes Vega of the option on a future using the Black-76 model (sensitivity to volatility change)."
            gas="1,659"
            relError="5e-12"
            relErrorWhen="when ν ≥ 1"
            absError="4e-13"
            absErrorWhen="when ν < 1"
            signature={`function vega(
    uint128 future,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (uint256 vegaOut)`}
            parameters={[
                { name: "future", type: "uint128", description: "Current future price in 18-decimal fixed-point format." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against the future — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free (discount) rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "vegaOut", type: "uint256", description: "Vega per 1% vol move in 18-decimal fixed-point. ν ≥ 0; identical for call and put under put-call parity." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns vega <span className="text-white font-semibold">per 1% vol move</span> as a <span className="text-white font-semibold">single</span> value — call and put vega are identical under put-call parity.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">0</code>.</>,
                <>Composes three DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), and <code className="text-primary">exp</code> (for the density <code className="text-primary">φ(d₁)</code>), plus <code className="text-primary">expPositive</code> for the discount.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">vega</code> is the derivative of option value with respect to volatility, returned <span className="text-white font-semibold">per 1% vol move</span> (the raw figure divided by 100):
                    </p>
                    <MathBlock>{String.raw`\nu = \frac{e^{-rT} F \sqrt{T} \, \varphi(d_1)}{100}, \qquad \varphi(d_1) = \frac{e^{-d_1^2 / 2}}{\sqrt{2\pi}}`}</MathBlock>
                    <MathBlock>{String.raw`d_1 = \frac{\ln(F/K) + \tfrac{\sigma^2}{2} T}{\sigma \sqrt{T}}`}</MathBlock>
                    <p>
                        The density <code className="text-primary">φ(d₁)</code> is evaluated as <code className="text-primary">Math.exp(−d₁²/2) / √(2π)</code>, multiplied by <code className="text-primary">future · √T</code>, discounted by <code className="text-primary">e^(−rT)</code>, and divided by 100 for the per-1% convention. Vega is symmetric across the call/put boundary, so only one value is returned.
                    </p>
                    <p>
                        Precision follows the dual-metric rule: a <span className="text-white font-semibold">relative</span> bound of <code className="text-primary">5e-12</code> where <code className="text-primary">ν ≥ 1</code> and an <span className="text-white font-semibold">absolute</span> bound of <code className="text-primary">4e-13</code> where <code className="text-primary">ν &lt; 1</code>, at <code className="text-primary">future = $1,000</code> — head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "MIN_FUTURE", value: <>1e-6 smallest allowed future price (<code className="text-primary">1e12</code>)</> },
                    { name: "MAX_FUTURE", value: <>1e15 largest allowed future price (<code className="text-primary">1e33</code>)</> },
                    { name: "MAX_STSP_RATIO", value: <>5× (strike must lie within [future/5, future·5])</> },
                    { name: "MAX_EXPIRATION", value: <>32 years (1,009,152,000 seconds)</> },
                    { name: "MAX_RATE", value: <>400% annual (<code className="text-primary">4e18</code>)</> },
                ],
                errors: [
                    { name: "FutureLowerBoundError", trigger: <><code className="text-primary">future ≤ MIN_FUTURE</code></> },
                    { name: "FutureUpperBoundError", trigger: <><code className="text-primary">future ≥ MAX_FUTURE</code></> },
                    { name: "StrikeLowerBoundError", trigger: <><code className="text-primary">strike · 5 &lt; future</code></> },
                    { name: "StrikeUpperBoundError", trigger: <><code className="text-primary">future · 5 &lt; strike</code></> },
                    { name: "TimeToExpiryUpperBoundError", trigger: <><code className="text-primary">timeToExp ≥ MAX_EXPIRATION</code></> },
                    { name: "RateUpperBoundError", trigger: <><code className="text-primary">rate ≥ MAX_RATE</code></> },
                ],
            }}
            example={`import "defimath-lib/contracts/derivatives/Black76.sol";

uint256 v = Black76.vega(
    1000e18,         // future = $1,000
    1050e18,         // strike = $1,050
    90 days,         // 90 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% discount rate
);
// v ≈ 1.9e18 per 1% change in volatility`}
            parentSectionHref="/docs/black-76"
            parentSectionLabel="Back to Black-76 overview"
        />
    );
}
