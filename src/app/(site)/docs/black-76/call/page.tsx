import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-76 Call Pricing - 2552 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-76 European call pricing on a future, 18-decimal fixed-point — 2,552 gas, 5e-12 max rel. / 1.3e-10 max abs. error at $1,000 future. e^(−rτ)·[F·Φ(d₁) − K·Φ(d₂)].",
    alternates: { canonical: "/docs/black-76/call/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-76", href: "/docs/black-76/" },
                { label: "call" },
            ]}
            module="Black-76"
            name="call"
            summary="Computes the price of a European call option on a future using the Black-76 model."
            gas="2,552"
            relError="5e-12"
            relErrorWhen="when price ≥ 1"
            absError="1.3e-10"
            absErrorWhen="when price < 1"
            signature={`function call(
    uint128 future,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (uint256 price)`}
            parameters={[
                { name: "future", type: "uint128", description: "Current future price in 18-decimal fixed-point format." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against the future — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free (discount) rate, 18-decimal fixed-point. The future already embeds the cost of carry." },
            ]}
            returns={[
                { name: "price", type: "uint256", description: "Call option price in 18-decimal fixed-point. Always ≥ 0." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Prices options on a <span className="text-white font-semibold">future</span>, not spot: <code className="text-primary">d₁</code> carries no rate term and the whole payoff is discounted by <code className="text-primary">e^(−rτ)</code>, since the future already embeds the cost of carry.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns intrinsic value <code className="text-primary">max(future − strike, 0)</code> without running the pricer.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt/" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (the discount factor), and <Link href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</Link>.</>,
                <>Equivalent to <code className="text-primary">e^(−rτ) · </code><Link href="/docs/black-scholes/call/" className="text-primary underline">BlackScholes.call</Link><code className="text-primary">(spot = F, rate = 0)</code> — use Black-Scholes instead when the underlying is a spot asset.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">call</code> implements the closed-form Black-76 formula for a European call on a future:
                    </p>
                    <MathBlock>{String.raw`C = e^{-rT}\left[ F \, \Phi(d_1) - K \, \Phi(d_2) \right]`}</MathBlock>
                    <MathBlock>{String.raw`d_1 = \frac{\ln(F/K) + \tfrac{\sigma^2}{2} T}{\sigma \sqrt{T}}, \qquad d_2 = d_1 - \sigma \sqrt{T}`}</MathBlock>
                    <p>
                        Unlike Black-Scholes, <code className="text-primary">d₁</code> has <span className="text-white font-semibold">no rate term</span> — the future already carries the cost of carry. <code className="text-primary">σ·√T</code> uses <code className="text-primary">Math.sqrtTime</code>, <code className="text-primary">ln(future/strike)</code> uses <Link href="/docs/math/ln/" className="text-primary underline">Math.ln</Link>, and the two normal CDFs use <Link href="/docs/math/stdnormcdf/" className="text-primary underline">Math.stdNormCDF</Link>. The whole bracket is discounted once by <code className="text-primary">e^(−rT)</code> via <code className="text-primary">Math.expPositive(rT)</code> (input bounds guarantee <code className="text-primary">rT ≥ 0</code>).
                    </p>
                    <p>
                        The suite enforces a 5e-12 relative bound where the price is ≥ 1 and a 1.3e-10 absolute bound for the sub-$1 (deep-OTM) tail, both at <code className="text-primary">future = $1,000</code> across a full sweep of strike, time, vol, and rate — head-to-head measurements against other libraries live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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

uint256 price = Black76.call(
    1000e18,         // future = $1,000
    1050e18,         // strike = $1,050
    90 days,         // 90 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% discount rate
);
// price ≈ 96.9e18  (about $96.90 per option)`}
            parentSectionHref="/docs/black-76"
            parentSectionLabel="Back to Black-76 overview"
        />
    );
}
