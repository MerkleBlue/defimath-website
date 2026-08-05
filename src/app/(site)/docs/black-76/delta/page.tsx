import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-76 Delta - 1915 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-76 delta for call and put on a future, 18-decimal fixed-point — 1,915 gas, 1.2e-13 max abs. error. δcall = e^(−rτ)·Φ(d₁); δput = δcall − e^(−rτ).",
    alternates: { canonical: "/docs/black-76/delta/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-76", href: "/docs/black-76/" },
                { label: "delta" },
            ]}
            module="Black-76"
            name="delta"
            summary="Computes Delta for both call and put options on a future using the Black-76 model (sensitivity to future price change)."
            gas="1,915"
            absError="1.2e-13"
            signature={`function delta(
    uint128 future,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (int128 deltaCall, int128 deltaPut)`}
            parameters={[
                { name: "future", type: "uint128", description: "Current future price in 18-decimal fixed-point format." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against the future — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free (discount) rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "deltaCall", type: "int128", description: "Call delta in 18-decimal fixed-point. δcall ∈ [0, e^(−rτ)]." },
                { name: "deltaPut", type: "int128", description: "Put delta in 18-decimal fixed-point. δput = δcall − e^(−rτ) ∈ [−e^(−rτ), 0]." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns <span className="text-white font-semibold">both</span> call and put delta from a <span className="text-white font-semibold">single</span> <code className="text-primary">Φ(d₁)</code> evaluation — <code className="text-primary">δput = δcall − e^(−rτ)</code>, so the second value is free.</>,
                <>Discounted, unlike Black-Scholes: Black-76 delta is <code className="text-primary">e^(−rτ)·Φ(d₁)</code>, bounded to <code className="text-primary">[−e^(−rτ), e^(−rτ)]</code> — so only an absolute error applies.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, delta collapses to its degenerate expiry value (<code className="text-primary">0</code> or <code className="text-primary">±1</code> by moneyness) without running the pricer.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (the discount factor), and <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link>.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">delta</code> is the first derivative of option value with respect to the future price. Under Black-76 it is the discounted standard normal CDF of <code className="text-primary">d₁</code>:
                    </p>
                    <MathBlock>{String.raw`\delta_{call} = e^{-rT}\,\Phi(d_1), \qquad \delta_{put} = e^{-rT}\left(\Phi(d_1) - 1\right)`}</MathBlock>
                    <MathBlock>{String.raw`d_1 = \frac{\ln(F/K) + \tfrac{\sigma^2}{2} T}{\sigma \sqrt{T}}`}</MathBlock>
                    <p>
                        The discount factor <code className="text-primary">e^(−rT)</code> (from <code className="text-primary">Math.expPositive(rT)</code>) is what distinguishes it from the vanilla delta <code className="text-primary">Φ(d₁)</code>. Because put delta differs from call delta by exactly the discount factor, both are returned from one <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link> evaluation.
                    </p>
                    <p>
                        Delta is bounded to <code className="text-primary">[−e^(−rτ), e^(−rτ)] ⊂ [−1, 1]</code>, so the suite enforces an <span className="text-white font-semibold">absolute</span> error only — <code className="text-primary">1.2e-13</code> — with no relative bound. Head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

(int128 deltaCall, int128 deltaPut) = Black76.delta(
    1000e18,         // future = $1,000
    1050e18,         // strike = $1,050
    90 days,         // 90 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% discount rate
);
// deltaCall ≈ 0.49e18, deltaPut = deltaCall − e^(−rτ) ≈ -0.50e18`}
            parentSectionHref="/docs/black-76"
            parentSectionLabel="Back to Black-76 overview"
        />
    );
}
