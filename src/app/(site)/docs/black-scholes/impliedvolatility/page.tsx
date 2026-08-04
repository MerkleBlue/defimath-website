import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-Scholes Implied Volatility - 11668/11743 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-Scholes implied volatility solver (Newton-Raphson), 18-decimal fixed-point — 11,668 / 11,743 gas (call / put), 1e-6 max rel. error. Inverts the pricer to recover σ from a market price.",
    alternates: { canonical: "/docs/black-scholes/impliedvolatility/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-Scholes", href: "/docs/black-scholes/" },
                { label: "impliedVolatility" },
            ]}
            module="Black-Scholes"
            name="impliedVolatility"
            summary="Computes implied volatility from a market option price using Newton-Raphson."
            gas="11,668 / 11,743"
            relError="1e-6"
            relErrorWhen="when σ ≥ 1"
            absError="2e-6"
            absErrorWhen="when σ < 1"
            signature={`function impliedVolatility(
    uint128 spot,
    uint128 strike,
    uint32  timeToExp,
    uint64  rate,
    uint128 optionPrice,
    bool    isCall
) internal pure returns (uint256 volatility)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price, 18-decimal fixed-point." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against spot — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. Must be > 0 — timeToExp == 0 reverts (unlike the pricer, which treats it as expired)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free rate, 18-decimal fixed-point." },
                { name: "optionPrice", type: "uint128", description: "Observed market option price, 18-decimal fixed-point. Must lie within the no-arbitrage band, otherwise the solver reverts." },
                { name: "isCall", type: "bool", description: "true if optionPrice is a call price, false if it's a put price." },
            ]}
            returns={[
                { name: "volatility", type: "uint256", description: "Implied volatility in 18-decimal fixed-point, clamped to [0.01%, 1800%]." },
            ]}
            behaviorItems={[
                <>Validates all inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Unlike the pricer and greeks, <code className="text-primary">timeToExp == 0</code> is <span className="text-white font-semibold">not</span> allowed — a zero expiry reverts with <code className="text-primary">TimeToExpiryLowerBoundError</code> (there is no volatility to recover from an expired option).</>,
                <>The observed <code className="text-primary">optionPrice</code> must lie within the no-arbitrage band <code className="text-primary">[max(S − K·e^(−rT), 0), S]</code> for calls (analogously for puts) — otherwise <code className="text-primary">PriceOutOfBoundsError</code>.</>,
                <>Newton-Raphson from a fixed <code className="text-primary">55%</code> seed, up to <code className="text-primary">30</code> iterations, converging when the price residual falls within <code className="text-primary">~1e6</code> wei. Reverts <code className="text-primary">NoConvergenceError</code> if it fails to converge or if vega gets too small to invert. Typical convergence is 4–6 iterations.</>,
                <>The recovered volatility is clamped to <code className="text-primary">[MIN_VOL_IV, MAX_VOL_IV]</code> — i.e. <code className="text-primary">[0.01%, 1800%]</code> — on every step.</>,
                <>Each iteration reuses precomputed state and evaluates the <Link href="/docs/black-scholes/call/" className="text-primary underline">call</Link> / <Link href="/docs/black-scholes/put/" className="text-primary underline">put</Link> price together with <Link href="/docs/black-scholes/vega/" className="text-primary underline">vega</Link> (the derivative Newton-Raphson needs) in a single pass. Pure <code className="text-primary">internal</code> function; no external calls, no storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">impliedVolatility</code> inverts the Black-Scholes pricer: given a market price, it finds the volatility <code className="text-primary">σ</code> that reproduces it. There is no closed form, so DeFiMath uses Newton-Raphson on the pricing residual:
                    </p>
                    <MathBlock>{String.raw`\sigma_{n+1} = \sigma_n - \frac{\text{BS}(\sigma_n) - P_{\text{market}}}{\text{vega}(\sigma_n)}`}</MathBlock>
                    <p>
                        Each step needs both the option price and its derivative with respect to vol (<Link href="/docs/black-scholes/vega/" className="text-primary underline">vega</Link>) at the current <code className="text-primary">σ</code>. These share almost all of their intermediate work — <code className="text-primary">d₁</code>, <code className="text-primary">d₂</code>, the density and CDF — so DeFiMath computes them together from cached state (<code className="text-primary">ln(S/K)</code>, <code className="text-primary">√T</code>, the discount factor) that never changes across iterations, keeping each step cheap.
                    </p>
                    <p>
                        The solver seeds at <code className="text-primary">σ₀ = 55%</code>, caps at 30 iterations, and stops once the price residual is within <code className="text-primary">IV_TOLERANCE ≈ 1e6</code> wei; the running estimate is clamped into <code className="text-primary">[0.01%, 1800%]</code> each step so it can&apos;t wander out of the supported range. Convergence is a round-trip guarantee: <code className="text-primary">IV(price(σ)) ≈ σ</code> to within a <span className="text-white font-semibold">relative</span> <code className="text-primary">1e-6</code> where <code className="text-primary">σ ≥ 1</code> and an <span className="text-white font-semibold">absolute</span> <code className="text-primary">2e-6</code> where <code className="text-primary">σ &lt; 1</code> — head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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
                    { name: "MIN_VOL_IV", value: <>0.01% floor on the recovered vol (<code className="text-primary">1e14</code>)</> },
                    { name: "MAX_VOL_IV", value: <>1800% ceiling on the recovered vol (<code className="text-primary">18e18</code>)</> },
                    { name: "IV_MAX_ITER", value: <>30 Newton-Raphson iterations before reverting</> },
                ],
                errors: [
                    { name: "SpotLowerBoundError", trigger: <><code className="text-primary">spot ≤ MIN_SPOT</code></> },
                    { name: "SpotUpperBoundError", trigger: <><code className="text-primary">spot ≥ MAX_SPOT</code></> },
                    { name: "StrikeLowerBoundError", trigger: <><code className="text-primary">strike · 5 &lt; spot</code></> },
                    { name: "StrikeUpperBoundError", trigger: <><code className="text-primary">spot · 5 &lt; strike</code></> },
                    { name: "TimeToExpiryUpperBoundError", trigger: <><code className="text-primary">timeToExp ≥ MAX_EXPIRATION</code></> },
                    { name: "TimeToExpiryLowerBoundError", trigger: <><code className="text-primary">timeToExp == 0</code></> },
                    { name: "RateUpperBoundError", trigger: <><code className="text-primary">rate ≥ MAX_RATE</code></> },
                    { name: "PriceOutOfBoundsError", trigger: <><code className="text-primary">optionPrice</code> outside the no-arbitrage band</> },
                    { name: "NoConvergenceError", trigger: <>solver failed to converge (or vega too small to invert)</> },
                ],
            }}
            example={`import "defimath-lib/contracts/derivatives/BlackScholes.sol";

uint256 iv = BlackScholes.impliedVolatility(
    1000e18,         // spot = $1,000
    980e18,          // strike = $980
    60 days,         // 60 days to expiry
    0.05e18,         // 5% risk-free rate
    99.4e18,         // observed market price ≈ $99.40
    true             // call
);
// iv ≈ 0.60e18  (recovers ~60% vol)`}
            parentSectionHref="/docs/black-scholes"
            parentSectionLabel="Back to Black-Scholes overview"
        />
    );
}
