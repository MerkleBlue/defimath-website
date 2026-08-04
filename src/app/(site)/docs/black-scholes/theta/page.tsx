import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-Scholes Theta - 3101 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-Scholes theta (time decay per day) for call and put, 18-decimal fixed-point — 3,101 gas, 5e-12 max rel. / 1.9e-12 max abs. error at $1,000 spot.",
    alternates: { canonical: "/docs/black-scholes/theta/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-Scholes", href: "/docs/black-scholes/" },
                { label: "theta" },
            ]}
            module="Black-Scholes"
            name="theta"
            summary="Computes Theta of the option using the Black-Scholes model (time decay per day)."
            gas="3,101"
            relError="5e-12"
            relErrorWhen="when |θ| ≥ 1"
            absError="1.9e-12"
            absErrorWhen="when |θ| < 1"
            signature={`function theta(
    uint128 spot,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (int128 thetaCall, int128 thetaPut)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price, 18-decimal fixed-point." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against spot — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "thetaCall", type: "int128", description: "Call theta per day in 18-decimal fixed-point. Typically ≤ 0 (value decays as time passes)." },
                { name: "thetaPut", type: "int128", description: "Put theta per day in 18-decimal fixed-point." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns theta <span className="text-white font-semibold">per day</span> (the annual figure divided by 365) for both call and put, sharing the common time-decay term across the two.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized). The <code className="text-primary">MIN_VOL_IV</code> / <code className="text-primary">MAX_VOL_IV</code> constants apply only to the <Link href="/docs/black-scholes/impliedvolatility/" className="text-primary underline">impliedVolatility</Link> solver, not the greeks.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">(0, 0)</code>.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (the discount factor <code className="text-primary">e^(−rT)</code>), <code className="text-primary">exp</code> (the density <code className="text-primary">φ(d₁)</code>), and <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link> (the carry term). Its higher gas reflects that fuller composition.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">theta</code> is the derivative of option value with respect to the passage of time. DeFiMath returns it <span className="text-white font-semibold">per day</span> — the annualized Black-Scholes theta divided by 365:
                    </p>
                    <MathBlock>{String.raw`\Theta_{call} = \frac{1}{365}\left[ -\frac{S \, \varphi(d_1) \, \sigma}{2\sqrt{T}} - r K e^{-rT} \Phi(d_2) \right]`}</MathBlock>
                    <MathBlock>{String.raw`\Theta_{put} = \frac{1}{365}\left[ -\frac{S \, \varphi(d_1) \, \sigma}{2\sqrt{T}} + r K e^{-rT} \Phi(-d_2) \right]`}</MathBlock>
                    <p>
                        The shared <span className="text-white font-semibold">time-decay</span> term <code className="text-primary">S·φ(d₁)·σ / (2√T)</code> is computed once and reused for both call and put; only the sign and the <span className="text-white font-semibold">carry</span> term <code className="text-primary">r·K·e^(−rT)·Φ(±d₂)</code> differ. The density <code className="text-primary">φ(d₁)</code> uses <code className="text-primary">Math.exp</code>, the discount factor <code className="text-primary">e^(−rT)</code> uses <code className="text-primary">Math.expPositive</code>, the carry CDF uses <Link href="/docs/math/stdnormcdf/" className="text-primary underline">Math.stdNormCDF</Link>, and <code className="text-primary">√T</code> / <code className="text-primary">ln(spot/strike)</code> use <code className="text-primary">Math.sqrtTime</code> / <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link>.
                    </p>
                    <p>
                        Precision follows the dual-metric rule: a <span className="text-white font-semibold">relative</span> bound of <code className="text-primary">5e-12</code> where <code className="text-primary">|θ| ≥ 1</code> and an <span className="text-white font-semibold">absolute</span> bound of <code className="text-primary">1.9e-12</code> where <code className="text-primary">|θ| &lt; 1</code>. Both are enforced at <code className="text-primary">spot = $1,000</code> across a full sweep of strike, time, vol, and rate — head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

(int128 thetaCall, int128 thetaPut) = BlackScholes.theta(
    1000e18,         // spot = $1,000
    980e18,          // strike = $980
    60 days,         // 60 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// thetaCall ≈ -0.45e18 per day (about -$0.45/day)`}
            parentSectionHref="/docs/black-scholes"
            parentSectionLabel="Back to Black-Scholes overview"
        />
    );
}
