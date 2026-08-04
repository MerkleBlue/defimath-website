import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Binary Option Theta - 3161 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity binary cash-or-nothing theta (time decay per day) for call and put, 18-decimal fixed-point — 3,161 gas, 1e-14 max abs. error.",
    alternates: { canonical: "/docs/binary/theta/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Binary options", href: "/docs/binary/" },
                { label: "theta" },
            ]}
            module="Binary options"
            name="theta"
            summary="Computes Theta for binary cash-or-nothing call and put options using the Black-Scholes model (per day)."
            gas="3,161"
            absError="1e-14"
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
                { name: "thetaCall", type: "int128", description: "Binary call theta per day for unit payout in 18-decimal fixed-point. Signed." },
                { name: "thetaPut", type: "int128", description: "Binary put theta per day for unit payout in 18-decimal fixed-point. Signed." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns theta <span className="text-white font-semibold">per day</span> (the annual figure divided by 365) for both call and put. Binary theta is <span className="text-white font-semibold">signed</span> and can be either sign depending on moneyness.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized).</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">(0, 0)</code>.</>,
                <>Composes five DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (the discount factor), <code className="text-primary">exp</code> (the density <code className="text-primary">φ(d₂)</code>), and <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link> (the carry term). Its higher gas reflects that fuller composition.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Binary theta is the derivative of the cash-or-nothing price with respect to the passage of time. DeFiMath returns it <span className="text-white font-semibold">per day</span> — the annualized figure divided by 365:
                    </p>
                    <MathBlock>{String.raw`\Theta_{call} = \frac{1}{365}\left[ r \, e^{-rT} \Phi(d_2) + e^{-rT} \varphi(d_2)\left(\frac{d_1}{2T} - \frac{r}{\sigma\sqrt{T}}\right) \right]`}</MathBlock>
                    <MathBlock>{String.raw`\Theta_{put} = \frac{1}{365}\left[ r \, e^{-rT} \Phi(-d_2) - e^{-rT} \varphi(d_2)\left(\frac{d_1}{2T} - \frac{r}{\sigma\sqrt{T}}\right) \right]`}</MathBlock>
                    <p>
                        The shared decay term <code className="text-primary">e^(−rT)·φ(d₂)·(d₁/2T − r/σ√T)</code> is computed once and reused for both; only the sign and the carry term <code className="text-primary">r·e^(−rT)·Φ(±d₂)</code> differ. The density uses <code className="text-primary">Math.exp</code>, the discount factor <code className="text-primary">Math.expPositive</code>, the carry CDF <Link href="/docs/math/stdnormcdf/" className="text-primary underline">Math.stdNormCDF</Link>, and <code className="text-primary">√T</code> / <code className="text-primary">ln(spot/strike)</code> use <code className="text-primary">Math.sqrtTime</code> / <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link>.
                    </p>
                    <p>
                        On the supported domain the magnitude stays well below 1, so the suite enforces an <span className="text-white font-semibold">absolute</span> error only — <code className="text-primary">1e-14</code> per day — with no relative bound. Head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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
            example={`import "defimath-lib/contracts/derivatives/BinaryOptions.sol";

(int128 thetaCall, int128 thetaPut) = BinaryOptions.theta(
    1000e18,         // spot = $1,000
    1050e18,         // strike = $1,050
    30 days,         // 30 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// thetaCall, thetaPut per day (signed by moneyness)`}
            parentSectionHref="/docs/binary"
            parentSectionLabel="Back to Binary options overview"
        />
    );
}
