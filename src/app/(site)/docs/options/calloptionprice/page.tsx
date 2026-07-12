import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "callOptionPrice — Options | DeFiMath docs",
    description: "Solidity Black-Scholes European call pricing, 18-decimal fixed-point — 2,708 gas, 5.6e-12 max abs. error at $1,000 spot. Built from ln, sqrtTime, exp, and Φ.",
    alternates: { canonical: "/docs/options/calloptionprice/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Options", href: "/docs/options/" },
                { label: "callOptionPrice" },
            ]}
            module="Options"
            name="callOptionPrice"
            summary="Computes the Black-Scholes price of a European call option in 18-decimal fixed-point, at ~2,708 gas."
            gas="2,708"
            precision="5.6e-12"
            precisionLabel="Max abs. error"
            signature={`function callOptionPrice(
    uint128 spot,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (uint256 price)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price, 18-decimal fixed-point." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against spot — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "price", type: "uint256", description: "Call option price in 18-decimal fixed-point. Always ≥ 0." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized). Practical inputs stay well below that ceiling; the <code className="text-primary">MIN_VOL_IV</code> / <code className="text-primary">MAX_VOL_IV</code> constants in the source apply only to the <Link href="/docs/options/" className="text-primary underline">impliedVolatility</Link> solver, not the pricer.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns intrinsic value <code className="text-primary">max(spot − strike, 0)</code> without running the pricer.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (rate is non-negative by validation), and <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link> — each independently gas-tuned and validated.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
                <>Symmetric counterpart: <Link href="/docs/options/putoptionprice/" className="text-primary underline">putOptionPrice</Link> uses identical input validation and the same d₁/d₂ machinery — substituting <code className="text-primary">Φ(−d₁)</code>/<code className="text-primary">Φ(−d₂)</code> for the call&apos;s <code className="text-primary">Φ(d₁)</code>/<code className="text-primary">Φ(d₂)</code>.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">callOptionPrice</code> implements the closed-form Black-Scholes formula for a European call:
                    </p>
                    <MathBlock>{String.raw`C = S \cdot \Phi(d_1) - K \, e^{-rT} \cdot \Phi(d_2)`}</MathBlock>
                    <MathBlock>{String.raw`d_1 = \frac{\ln(S/K) + \left(r + \tfrac{\sigma^2}{2}\right) T}{\sigma \sqrt{T}}, \qquad d_2 = d_1 - \sigma \sqrt{T}`}</MathBlock>
                    <p>
                        Every transcendental in the formula maps to a DeFiMath primitive: <code className="text-primary">σ·√T</code> uses <code className="text-primary">DeFiMath.sqrtTime</code> (a specialized square root tuned for time-in-years inputs), <code className="text-primary">ln(spot/strike)</code> uses <Link href="/docs/math/ln/" className="text-primary underline">DeFiMath.ln</Link>, the discount factor <code className="text-primary">e^(−rT)</code> is computed as <code className="text-primary">1 / DeFiMath.expPositive(rT)</code> (since the input bounds guarantee <code className="text-primary">rT ≥ 0</code>, we skip the negative-input reciprocal branch), and the two normal CDFs use <Link href="/docs/math/stdnormcdf/" className="text-primary underline">DeFiMath.stdNormCDF</Link>.
                    </p>
                    <p>
                        The annualization step converts <code className="text-primary">timeToExp</code> (seconds) to a year fraction by dividing by <code className="text-primary">SECONDS_IN_YEAR</code>, then scales volatility by <code className="text-primary">√T</code> once and reuses the result through <code className="text-primary">d₁</code>, <code className="text-primary">d₂</code>, and the integral bounds. The <code className="text-primary">+1</code> on <code className="text-primary">scaledVol</code> is a defensive bump to keep the division in <code className="text-primary">d₁</code> well-defined even for zero-vol edge cases.
                    </p>
                    <p>
                        The final assembly computes <code className="text-primary">spot · Φ(d₁) − discountedStrike · Φ(d₂)</code> and clamps the result at zero — Black-Scholes can produce slightly negative values (on the order of <code className="text-primary">10⁻¹²</code>) due to rounding in the rounded primitives when the option is far out of the money. The clamp guarantees the function never returns a nonsensical negative price. The 5.6e-12 max absolute error is benchmarked at <code className="text-primary">spot = $1,000</code> across a full sweep of strike, time, vol, and rate — reproducible from <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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
            example={`import "defimath-lib/contracts/derivatives/Options.sol";

uint256 price = DeFiMathOptions.callOptionPrice(
    1000e18,         // spot = $1,000
    980e18,          // strike = $980
    60 days,         // 60 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// price ≈ 99.4e18  (about $99.40 per option)`}
            parentSectionHref="/docs/options"
            parentSectionLabel="Back to Options overview"
        />
    );
}
