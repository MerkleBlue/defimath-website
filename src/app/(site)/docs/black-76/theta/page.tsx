import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-76 Theta - 3255 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-76 theta (time decay per day) for call and put on a future, 18-decimal fixed-point — 3,255 gas, 5e-12 max rel. / 1.9e-12 max abs. error.",
    alternates: { canonical: "/docs/black-76/theta/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-76", href: "/docs/black-76/" },
                { label: "theta" },
            ]}
            module="Black-76"
            name="theta"
            summary="Computes Theta of the option on a future using the Black-76 model (time decay per day)."
            gas="3,255"
            relError="5e-12"
            relErrorWhen="when |θ| ≥ 1"
            absError="1.9e-12"
            absErrorWhen="when |θ| < 1"
            signature={`function theta(
    uint128 future,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (int128 thetaCall, int128 thetaPut)`}
            parameters={[
                { name: "future", type: "uint128", description: "Current future price in 18-decimal fixed-point format." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against the future — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free (discount) rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "thetaCall", type: "int128", description: "Call theta per day in 18-decimal fixed-point." },
                { name: "thetaPut", type: "int128", description: "Put theta per day in 18-decimal fixed-point." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Returns theta <span className="text-white font-semibold">per day</span> (the annual figure divided by 365) for both call and put, sharing the common time-decay term across the two.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">(0, 0)</code>.</>,
                <>Composes five DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code>, <code className="text-primary">expPositive</code> (the discount factor), <code className="text-primary">exp</code> (the density <code className="text-primary">φ(d₁)</code>), and <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link> (the carry term). Its higher gas reflects that fuller composition.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">theta</code> is the derivative of option value with respect to the passage of time, returned <span className="text-white font-semibold">per day</span> (÷365). Under Black-76 the discount factor adds a carry term to the usual time decay:
                    </p>
                    <MathBlock>{String.raw`\Theta = \frac{1}{365}\left[ r \cdot \text{price} - \frac{e^{-rT} F \, \varphi(d_1) \, \sigma}{2\sqrt{T}} \right]`}</MathBlock>
                    <p>
                        The shared <span className="text-white font-semibold">time-decay</span> term <code className="text-primary">e^(−rT)·F·φ(d₁)·σ / (2√T)</code> is computed once and reused for both call and put; only the sign and the <span className="text-white font-semibold">carry</span> term <code className="text-primary">r·price</code> differ (the call and put prices differ, so their carries do too). The density <code className="text-primary">φ(d₁)</code> uses <code className="text-primary">Math.exp</code>, the discount <code className="text-primary">Math.expPositive</code>, the carry CDFs <Link href="/docs/math/stdnormcdf/" className="text-primary underline">Math.stdNormCDF</Link>.
                    </p>
                    <p>
                        Precision follows the dual-metric rule: a <span className="text-white font-semibold">relative</span> bound of <code className="text-primary">5e-12</code> where <code className="text-primary">|θ| ≥ 1</code> and an <span className="text-white font-semibold">absolute</span> bound of <code className="text-primary">1.9e-12</code> where <code className="text-primary">|θ| &lt; 1</code>, at <code className="text-primary">future = $1,000</code> — head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

(int128 thetaCall, int128 thetaPut) = Black76.theta(
    1000e18,         // future = $1,000
    1050e18,         // strike = $1,050
    90 days,         // 90 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% discount rate
);
// thetaCall, thetaPut per day (signed)`}
            parentSectionHref="/docs/black-76"
            parentSectionLabel="Back to Black-76 overview"
        />
    );
}
