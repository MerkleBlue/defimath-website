import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-76 Gamma - 1704 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-76 gamma on a future, 18-decimal fixed-point — 1,704 gas, 5e-12 max rel. / 3.2e-15 max abs. error. Γ = e^(−rτ)·φ(d₁)/(F·σ·√τ).",
    alternates: { canonical: "/docs/black-76/gamma/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-76", href: "/docs/black-76/" },
                { label: "gamma" },
            ]}
            module="Black-76"
            name="gamma"
            summary="Computes Gamma of the option on a future using the Black-76 model (sensitivity to delta change)."
            gas="1,704"
            relError="5e-12"
            relErrorWhen="when γ ≥ 1"
            absError="3.2e-15"
            absErrorWhen="when γ < 1"
            signature={`function gamma(
    uint128 future,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (uint256 gammaOut)`}
            parameters={[
                { name: "future", type: "uint128", description: "Current future price in 18-decimal fixed-point format." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against the future — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free (discount) rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "gammaOut", type: "uint256", description: "Gamma in 18-decimal fixed-point. Γ ≥ 0; identical for call and put under put-call parity." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns a <span className="text-white font-semibold">single</span> value — call and put gamma are identical under put-call parity, so there is no tuple.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">0</code>.</>,
                <>Composes three DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), and <code className="text-primary">exp</code> (for the density <code className="text-primary">φ(d₁)</code>), plus <code className="text-primary">expPositive</code> for the discount.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">gamma</code> is the second derivative of option value with respect to the future — the rate at which <Link href="/docs/black-76/delta/" className="text-primary underline">delta</Link> changes. Under Black-76 it is the discounted standard normal density at <code className="text-primary">d₁</code> scaled by <code className="text-primary">1 / (F·σ·√T)</code>:
                    </p>
                    <MathBlock>{String.raw`\Gamma = \frac{e^{-rT}\,\varphi(d_1)}{F \, \sigma \sqrt{T}}, \qquad \varphi(d_1) = \frac{e^{-d_1^2 / 2}}{\sqrt{2\pi}}`}</MathBlock>
                    <MathBlock>{String.raw`d_1 = \frac{\ln(F/K) + \tfrac{\sigma^2}{2} T}{\sigma \sqrt{T}}`}</MathBlock>
                    <p>
                        The density <code className="text-primary">φ(d₁)</code> is evaluated as <code className="text-primary">Math.exp(−d₁²/2) / √(2π)</code>, divided by <code className="text-primary">future · σ√T</code>, and discounted by <code className="text-primary">e^(−rT)</code> (from <code className="text-primary">Math.expPositive(rT)</code>). Gamma is symmetric across the call/put boundary, so only one value is returned.
                    </p>
                    <p>
                        Precision follows the dual-metric rule: a <span className="text-white font-semibold">relative</span> bound of <code className="text-primary">5e-12</code> where <code className="text-primary">γ ≥ 1</code> (low vol / short time) and an <span className="text-white font-semibold">absolute</span> bound of <code className="text-primary">3.2e-15</code> where <code className="text-primary">γ &lt; 1</code>, at <code className="text-primary">future = $1,000</code> — head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

uint256 g = Black76.gamma(
    1000e18,         // future = $1,000
    1050e18,         // strike = $1,050
    90 days,         // 90 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% discount rate
);
// g ≈ 0.0013e18 (per $1 move in the future)`}
            parentSectionHref="/docs/black-76"
            parentSectionLabel="Back to Black-76 overview"
        />
    );
}
