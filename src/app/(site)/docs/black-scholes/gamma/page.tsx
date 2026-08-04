import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-Scholes Gamma - 1433 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-Scholes gamma, 18-decimal fixed-point — 1,433 gas, 5e-12 max rel. / 3.2e-15 max abs. error at $1,000 spot. Identical for call and put under put-call parity.",
    alternates: { canonical: "/docs/black-scholes/gamma/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-Scholes", href: "/docs/black-scholes/" },
                { label: "gamma" },
            ]}
            module="Black-Scholes"
            name="gamma"
            summary="Computes Gamma of the option using the Black-Scholes model (sensitivity to delta change)."
            gas="1,433"
            relError="5e-12"
            relErrorWhen="when γ ≥ 1"
            absError="3.2e-15"
            absErrorWhen="when γ < 1"
            signature={`function gamma(
    uint128 spot,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (uint256 gammaOut)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price, 18-decimal fixed-point." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against spot — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "gammaOut", type: "uint256", description: "Gamma in 18-decimal fixed-point. Γ ≥ 0; identical for call and put under put-call parity." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns a <span className="text-white font-semibold">single</span> value — call and put gamma are identical under put-call parity, so there is no tuple.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized). The <code className="text-primary">MIN_VOL_IV</code> / <code className="text-primary">MAX_VOL_IV</code> constants apply only to the <Link href="/docs/black-scholes/impliedvolatility/" className="text-primary underline">impliedVolatility</Link> solver, not the greeks.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">0</code>.</>,
                <>Composes three DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), and <code className="text-primary">exp</code> (for the density <code className="text-primary">φ(d₁)</code>). Gamma needs no CDF and no discount factor.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">gamma</code> is the second derivative of option value with respect to spot — the rate at which <Link href="/docs/black-scholes/delta/" className="text-primary underline">delta</Link> changes. Under Black-Scholes it is the standard normal density at <code className="text-primary">d₁</code> scaled by <code className="text-primary">1 / (S·σ·√T)</code>:
                    </p>
                    <MathBlock>{String.raw`\Gamma = \frac{\varphi(d_1)}{S \, \sigma \sqrt{T}}, \qquad \varphi(d_1) = \frac{e^{-d_1^2 / 2}}{\sqrt{2\pi}}`}</MathBlock>
                    <MathBlock>{String.raw`d_1 = \frac{\ln(S/K) + \left(r + \tfrac{\sigma^2}{2}\right) T}{\sigma \sqrt{T}}`}</MathBlock>
                    <p>
                        The density <code className="text-primary">φ(d₁)</code> is evaluated as <code className="text-primary">Math.exp(−d₁²/2) / √(2π)</code> using the precomputed <code className="text-primary">SQRT_2PI</code> constant, then divided by <code className="text-primary">spot · σ√T</code>. <code className="text-primary">√T</code> comes from <code className="text-primary">Math.sqrtTime</code> and <code className="text-primary">ln(spot/strike)</code> from <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link>. Gamma is symmetric across the call/put boundary, so only one value is returned.
                    </p>
                    <p>
                        Precision follows the dual-metric rule: a <span className="text-white font-semibold">relative</span> bound of <code className="text-primary">5e-12</code> where <code className="text-primary">γ ≥ 1</code> (low vol / short time, where gamma spikes) and an <span className="text-white font-semibold">absolute</span> bound of <code className="text-primary">3.2e-15</code> where <code className="text-primary">γ &lt; 1</code>. Both are enforced at <code className="text-primary">spot = $1,000</code> across a full sweep of strike, time, vol, and rate — head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "MIN_SPOT", value: <>1e-6 smallest allowed spot price (<code className="text-primary">1e12</code>)</> },
                    { name: "MAX_SPOT", value: <>1e15 largest allowed spot price (<code className="text-primary">1e33</code>)</> },
                    { name: "MAX_STSP_RATIO", value: <>5× (strike must lie within [spot/5, spot·5])</> },
                    { name: "MAX_EXPIRATION", value: <>32 years (1,009,152,000 seconds)</> },
                    { name: "MAX_RATE", value: <>400% annual (<code className="text-primary">4e18</code>)</> },
                ],
                errors: [
                    { name: "SpotLowerBoundError", trigger: <><code className="text-primary">spot ≤ MIN_SPOT</code></> },
                    { name: "SpotUpperBoundError", trigger: <><code className="text-primary">spot ≥ MAX_SPOT</code></> },
                    { name: "StrikeLowerBoundError", trigger: <><code className="text-primary">strike · 5 &lt; spot</code></> },
                    { name: "StrikeUpperBoundError", trigger: <><code className="text-primary">spot · 5 &lt; strike</code></> },
                    { name: "TimeToExpiryUpperBoundError", trigger: <><code className="text-primary">timeToExp ≥ MAX_EXPIRATION</code></> },
                    { name: "RateUpperBoundError", trigger: <><code className="text-primary">rate ≥ MAX_RATE</code></> },
                ],
            }}
            example={`import "defimath-lib/contracts/derivatives/BlackScholes.sol";

uint256 g = BlackScholes.gamma(
    1000e18,         // spot = $1,000
    980e18,          // strike = $980
    60 days,         // 60 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// g ≈ 0.0026e18 (per $1 move in spot)`}
            parentSectionHref="/docs/black-scholes"
            parentSectionLabel="Back to Black-Scholes overview"
        />
    );
}
