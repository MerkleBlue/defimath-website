import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-Scholes Delta - 1661 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-Scholes delta for call and put, 18-decimal fixed-point — 1,661 gas, 1.2e-13 max abs. error at $1,000 spot. One CDF evaluation amortized across both.",
    alternates: { canonical: "/docs/black-scholes/delta/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-Scholes", href: "/docs/black-scholes/" },
                { label: "delta" },
            ]}
            module="Black-Scholes"
            name="delta"
            summary="Computes Delta for both call and put options using the Black-Scholes model (sensitivity to spot price change)."
            gas="1,661"
            absError="1.2e-13"
            signature={`function delta(
    uint128 spot,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (int128 deltaCall, int128 deltaPut)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price, 18-decimal fixed-point." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against spot — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "deltaCall", type: "int128", description: "Call delta in 18-decimal fixed-point. δcall ∈ [0, 1]." },
                { name: "deltaPut", type: "int128", description: "Put delta in 18-decimal fixed-point. δput = δcall − 1 ∈ [−1, 0]." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns <span className="text-white font-semibold">both</span> call and put delta from a <span className="text-white font-semibold">single</span> <code className="text-primary">Φ(d₁)</code> evaluation — <code className="text-primary">δput = δcall − 1</code> by put-call parity, so the second value is free.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized). The <code className="text-primary">MIN_VOL_IV</code> / <code className="text-primary">MAX_VOL_IV</code> constants apply only to the <Link href="/docs/black-scholes/" className="text-primary underline">impliedVolatility</Link> solver, not the greeks.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, delta collapses to its degenerate expiry value (<code className="text-primary">0</code> or <code className="text-primary">±1</code> by moneyness) without running the pricer.</>,
                <>Composes three DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), and <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link>. Delta needs no discount factor, so there is no <code className="text-primary">exp</code> call.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">delta</code> is the first derivative of option value with respect to spot. Under Black-Scholes it is simply the standard normal CDF of <code className="text-primary">d₁</code>:
                    </p>
                    <MathBlock>{String.raw`\delta_{call} = \Phi(d_1), \qquad \delta_{put} = \Phi(d_1) - 1`}</MathBlock>
                    <MathBlock>{String.raw`d_1 = \frac{\ln(S/K) + \left(r + \tfrac{\sigma^2}{2}\right) T}{\sigma \sqrt{T}}`}</MathBlock>
                    <p>
                        The function annualizes <code className="text-primary">timeToExp</code> (seconds) by dividing by <code className="text-primary">SECONDS_IN_YEAR</code>, scales volatility by <code className="text-primary">√T</code> with <code className="text-primary">Math.sqrtTime</code>, forms <code className="text-primary">ln(spot/strike)</code> with <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link>, and evaluates <code className="text-primary">Φ(d₁)</code> with <Link href="/docs/math/stdnormcdf/" className="text-primary underline">Math.stdNormCDF</Link>. Because put delta differs from call delta by exactly 1, both are returned from one CDF evaluation — roughly halving gas versus computing them separately.
                    </p>
                    <p>
                        Delta is bounded to <code className="text-primary">[−1, 1]</code>, so the suite enforces an <span className="text-white font-semibold">absolute</span> error only — no relative bound. The <code className="text-primary">1.2e-13</code> max absolute error is the bound enforced at <code className="text-primary">spot = $1,000</code> across a full sweep of strike, time, vol, and rate — head-to-head measurements against other libraries live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

(int128 deltaCall, int128 deltaPut) = BlackScholes.delta(
    1000e18,         // spot = $1,000
    980e18,          // strike = $980
    60 days,         // 60 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// deltaCall ≈ 0.58e18, deltaPut ≈ -0.42e18`}
            parentSectionHref="/docs/black-scholes"
            parentSectionLabel="Back to Black-Scholes overview"
        />
    );
}
