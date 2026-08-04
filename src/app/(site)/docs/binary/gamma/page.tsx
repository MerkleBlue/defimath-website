import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Binary Option Gamma - 1859 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity binary cash-or-nothing gamma for call and put, 18-decimal fixed-point — 1,859 gas, 1e-15 max abs. error. Signed; changes sign at the strike.",
    alternates: { canonical: "/docs/binary/gamma/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Binary options", href: "/docs/binary/" },
                { label: "gamma" },
            ]}
            module="Binary options"
            name="gamma"
            summary="Computes Gamma for binary cash-or-nothing call and put options using the Black-Scholes model."
            gas="1,859"
            absError="1e-15"
            signature={`function gamma(
    uint128 spot,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (int128 gammaCall, int128 gammaPut)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price, 18-decimal fixed-point." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against spot — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "gammaCall", type: "int128", description: "Binary call gamma for unit payout in 18-decimal fixed-point. Signed." },
                { name: "gammaPut", type: "int128", description: "Binary put gamma for unit payout in 18-decimal fixed-point. Equal to −gammaCall." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Binary gamma is <span className="text-white font-semibold">signed</span> and changes sign at-the-money (<code className="text-primary">d₁ = 0</code>) — unlike vanilla gamma, which is always ≥ 0. <code className="text-primary">γput = −γcall</code>.</>,
                <>Volatility has no explicit revert — it&apos;s bounded only by its <code className="text-primary">uint64</code> type (max ≈ <code className="text-primary">1.84e19</code>, i.e. ~1840% annualized).</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">(0, 0)</code>.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (the discount factor), and <code className="text-primary">exp</code> (the density <code className="text-primary">φ(d₂)</code>).</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Binary gamma is the second derivative of the cash-or-nothing price with respect to spot — the rate at which <Link href="/docs/binary/delta/" className="text-primary underline">binary delta</Link> changes:
                    </p>
                    <MathBlock>{String.raw`\Gamma_{call} = -\frac{e^{-rT} \, \varphi(d_2) \, d_1}{S^2 \, \sigma^2 \, T}, \qquad \Gamma_{put} = -\Gamma_{call}`}</MathBlock>
                    <p>
                        The <code className="text-primary">d₁</code> factor in the numerator is what makes it sign-changing: gamma is positive on one side of the strike and negative on the other, passing through zero at-the-money. The density <code className="text-primary">φ(d₂)</code> uses <code className="text-primary">Math.exp</code>, the discount factor <code className="text-primary">e^(−rT)</code> uses <code className="text-primary">Math.expPositive</code>, and <code className="text-primary">√T</code> / <code className="text-primary">ln(spot/strike)</code> use <code className="text-primary">Math.sqrtTime</code> / <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link>.
                    </p>
                    <p>
                        On the supported domain the magnitude stays well below 1 (the <code className="text-primary">1/S²</code> factor at an <code className="text-primary">$1,000</code>-scale spot crushes it), so the suite enforces an <span className="text-white font-semibold">absolute</span> error only — <code className="text-primary">1e-15</code> — with no relative bound. Head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

(int128 gammaCall, int128 gammaPut) = BinaryOptions.gamma(
    1000e18,         // spot = $1,000
    1050e18,         // strike = $1,050
    30 days,         // 30 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// gammaCall signed (sign flips across the strike), gammaPut = -gammaCall`}
            parentSectionHref="/docs/binary"
            parentSectionLabel="Back to Binary options overview"
        />
    );
}
