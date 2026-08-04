import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Binary Option Vega - 1805 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity binary cash-or-nothing vega (per 1% vol move) for call and put, 18-decimal fixed-point — 1,805 gas, 1e-14 max abs. error. Signed; changes sign at the strike.",
    alternates: { canonical: "/docs/binary/vega/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Binary options", href: "/docs/binary/" },
                { label: "vega" },
            ]}
            module="Binary options"
            name="vega"
            summary="Computes Vega for binary cash-or-nothing call and put options using the Black-Scholes model (per 1% vol move)."
            gas="1,805"
            absError="1e-14"
            signature={`function vega(
    uint128 spot,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (int128 vegaCall, int128 vegaPut)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price, 18-decimal fixed-point." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against spot — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "vegaCall", type: "int128", description: "Binary call vega per 1% vol for unit payout in 18-decimal fixed-point. Signed." },
                { name: "vegaPut", type: "int128", description: "Binary put vega per 1% vol for unit payout in 18-decimal fixed-point. Equal to −vegaCall." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns vega <span className="text-white font-semibold">per 1% vol move</span>. Binary vega is <span className="text-white font-semibold">signed</span> and changes sign at <code className="text-primary">d₁ = 0</code> (around the strike) — unlike vanilla vega, which is always ≥ 0. <code className="text-primary">νput = −νcall</code>.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized).</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">(0, 0)</code>.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (the discount factor), and <code className="text-primary">exp</code> (the density <code className="text-primary">φ(d₂)</code>).</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Binary vega is the sensitivity of the cash-or-nothing price to volatility, returned <span className="text-white font-semibold">per 1% vol move</span> (the raw figure divided by 100):
                    </p>
                    <MathBlock>{String.raw`\nu_{call} = -\frac{1}{100} \cdot \frac{e^{-rT} \, \varphi(d_2) \, d_1}{\sigma}, \qquad \nu_{put} = -\nu_{call}`}</MathBlock>
                    <p>
                        Like <Link href="/docs/binary/gamma/" className="text-primary underline">binary gamma</Link>, the <code className="text-primary">d₁</code> factor makes it sign-changing: raising volatility pushes probability toward the tail on one side of the strike and away on the other, so vega flips sign at-the-money. The density <code className="text-primary">φ(d₂)</code> uses <code className="text-primary">Math.exp</code>, the discount factor <code className="text-primary">e^(−rT)</code> uses <code className="text-primary">Math.expPositive</code>, and <code className="text-primary">√T</code> / <code className="text-primary">ln(spot/strike)</code> use <code className="text-primary">Math.sqrtTime</code> / <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link>.
                    </p>
                    <p>
                        On the supported domain the magnitude stays well below 1, so the suite enforces an <span className="text-white font-semibold">absolute</span> error only — <code className="text-primary">1e-14</code> per 1% vol — with no relative bound. Head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

(int128 vegaCall, int128 vegaPut) = BinaryOptions.vega(
    1000e18,         // spot = $1,000
    1050e18,         // strike = $1,050
    30 days,         // 30 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// vegaCall per 1% vol (sign flips across the strike), vegaPut = -vegaCall`}
            parentSectionHref="/docs/binary"
            parentSectionLabel="Back to Binary options overview"
        />
    );
}
