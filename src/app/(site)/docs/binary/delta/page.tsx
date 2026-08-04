import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Binary Option Delta - 1717 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity binary cash-or-nothing delta for call and put, 18-decimal fixed-point — 1,717 gas, 1e-13 max abs. error. ΔPut = −ΔCall.",
    alternates: { canonical: "/docs/binary/delta/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Binary options", href: "/docs/binary/" },
                { label: "delta" },
            ]}
            module="Binary options"
            name="delta"
            summary="Computes Delta for binary cash-or-nothing call and put options using the Black-Scholes model."
            gas="1,717"
            absError="1e-13"
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
                { name: "deltaCall", type: "int128", description: "Binary call delta for unit payout in 18-decimal fixed-point." },
                { name: "deltaPut", type: "int128", description: "Binary put delta for unit payout in 18-decimal fixed-point. Equal to −deltaCall." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns <span className="text-white font-semibold">both</span> call and put delta from one evaluation — <code className="text-primary">δput = −δcall</code>, so the second value is free.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized).</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">(0, 0)</code>.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (the discount factor), and <code className="text-primary">exp</code> (the density <code className="text-primary">φ(d₂)</code>).</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Binary delta is the sensitivity of the cash-or-nothing price to spot. Unlike a vanilla delta it is a sharp density peak at the strike, not a smooth <code className="text-primary">[0, 1]</code> ramp:
                    </p>
                    <MathBlock>{String.raw`\delta_{call} = \frac{e^{-rT} \, \varphi(d_2)}{S \, \sigma \sqrt{T}}, \qquad \delta_{put} = -\delta_{call}`}</MathBlock>
                    <p>
                        The density <code className="text-primary">φ(d₂)</code> is evaluated as <code className="text-primary">Math.exp(−d₂²/2) / √(2π)</code> via the precomputed <code className="text-primary">SQRT_2PI</code> constant, discounted by <code className="text-primary">1 / Math.expPositive(rT)</code>, and divided by <code className="text-primary">spot · σ√T</code> (<code className="text-primary">√T</code> from <code className="text-primary">Math.sqrtTime</code>, <code className="text-primary">ln(spot/strike)</code> from <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link>). Put delta is the exact negative of call delta.
                    </p>
                    <p>
                        On the supported domain the magnitude stays well below 1 (the <code className="text-primary">1/S</code> factor with an <code className="text-primary">$1,000</code>-scale spot crushes it), so the suite enforces an <span className="text-white font-semibold">absolute</span> error only — <code className="text-primary">1e-13</code> — with no relative bound. Head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

(int128 deltaCall, int128 deltaPut) = BinaryOptions.delta(
    1000e18,         // spot = $1,000
    1050e18,         // strike = $1,050
    30 days,         // 30 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// deltaCall ≈ 0.0037e18 per $1, deltaPut = -deltaCall`}
            parentSectionHref="/docs/binary"
            parentSectionLabel="Back to Binary options overview"
        />
    );
}
