import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Binary Cash-or-Nothing Put - 1918 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity binary cash-or-nothing put pricing, 18-decimal fixed-point — 1,918 gas, 2e-12 max abs. error. Unit payout; e^(−r·τ)·Φ(−d₂).",
    alternates: { canonical: "/docs/binary/put/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Binary options", href: "/docs/binary/" },
                { label: "put" },
            ]}
            module="Binary options"
            name="put"
            summary="Computes the price of a binary cash-or-nothing put option using the Black-Scholes model."
            gas="1,918"
            absError="2e-12"
            signature={`function put(
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
                { name: "price", type: "uint256", description: "Binary put price for unit payout in 18-decimal fixed-point — a discounted probability in [0, 1]. Scale externally for other payouts." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Pays out <span className="text-white font-semibold">1 unit</span> if the option finishes in-the-money (<code className="text-primary">strike &gt; spot</code>), 0 otherwise. The returned price is the discounted probability of that — multiply by your notional for any other payout.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized).</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">1</code> if in-the-money (<code className="text-primary">strike &gt; spot</code>), else <code className="text-primary">0</code>.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (the discount factor), and <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link>.</>,
                <>Symmetric counterpart of the binary <Link href="/docs/binary/call/" className="text-primary underline">call</Link>: same machinery with <code className="text-primary">Φ(−d₂)</code> in place of <code className="text-primary">Φ(d₂)</code>. Pure <code className="text-primary">internal</code> function; no external calls, no storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        A binary (cash-or-nothing) put pays a fixed unit if <code className="text-primary">strike &gt; spot</code> at expiry. Under Black-Scholes its price is the discounted risk-neutral probability of that event:
                    </p>
                    <MathBlock>{String.raw`P_{bin} = e^{-rT} \, \Phi(-d_2), \qquad d_2 = \frac{\ln(S/K) + \left(r - \tfrac{\sigma^2}{2}\right) T}{\sigma \sqrt{T}}`}</MathBlock>
                    <p>
                        It reuses the same <code className="text-primary">d₂</code> machinery as the binary call — <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link> for <code className="text-primary">ln(spot/strike)</code>, <code className="text-primary">Math.sqrtTime</code> for <code className="text-primary">σ·√T</code>, <code className="text-primary">1 / Math.expPositive(rT)</code> for the discount factor — but evaluates <code className="text-primary">Φ(−d₂)</code> with <Link href="/docs/math/stdnormcdf/" className="text-primary underline">Math.stdNormCDF</Link>. By put-call parity the two prices sum to the discount factor <code className="text-primary">e^(−rT)</code>.
                    </p>
                    <p>
                        The price is a discounted probability, always in <code className="text-primary">[0, 1]</code>, so the suite enforces an <span className="text-white font-semibold">absolute</span> error only — no relative bound. The <code className="text-primary">2e-12</code> max absolute error is enforced across a full sweep of strike, time, vol, and rate — head-to-head measurements against other libraries live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

uint256 price = BinaryOptions.put(
    1000e18,         // spot = $1,000
    950e18,          // strike = $950
    30 days,         // 30 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// price ≈ 0.36e18  (~36% risk-neutral probability, discounted)`}
            parentSectionHref="/docs/binary"
            parentSectionLabel="Back to Binary options overview"
        />
    );
}
