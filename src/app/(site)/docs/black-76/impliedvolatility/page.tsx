import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Black-76 Implied Volatility - 11760/11802 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity Black-76 implied volatility solver (Newton-Raphson) on a future, 18-decimal fixed-point — 11,760 / 11,802 gas (call / put), 1e-6 max rel. error. Inverts the pricer to recover σ.",
    alternates: { canonical: "/docs/black-76/impliedvolatility/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Black-76", href: "/docs/black-76/" },
                { label: "impliedVolatility" },
            ]}
            module="Black-76"
            name="impliedVolatility"
            summary="Computes implied volatility from a market option price on a future using Newton-Raphson."
            gas="11,760 / 11,802"
            relError="1e-6"
            relErrorWhen="when σ ≥ 1"
            absError="2e-6"
            absErrorWhen="when σ < 1"
            signature={`function impliedVolatility(
    uint128 future,
    uint128 strike,
    uint32  timeToExp,
    uint64  rate,
    uint128 optionPrice,
    bool    isCall
) internal pure returns (uint256 volatility)`}
            parameters={[
                { name: "future", type: "uint128", description: "Current future price in 18-decimal fixed-point format." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Precision-tuned for the no-arbitrage band against the future — see Bounds." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. Must be > 0 — timeToExp == 0 reverts (unlike the pricer, which treats it as expired)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free (discount) rate, 18-decimal fixed-point." },
                { name: "optionPrice", type: "uint128", description: "Observed market option price, 18-decimal fixed-point. Must lie within the no-arbitrage band, otherwise the solver reverts." },
                { name: "isCall", type: "bool", description: "true if optionPrice is a call price, false if it's a put price." },
            ]}
            returns={[
                { name: "volatility", type: "uint256", description: "Implied volatility in 18-decimal fixed-point, clamped to [0.01%, 1800%]." },
            ]}
            behaviorItems={[
                <>Validates all inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>Unlike the pricer and greeks, <code className="text-primary">timeToExp == 0</code> is <span className="text-white font-semibold">not</span> allowed — a zero expiry reverts with <code className="text-primary">TimeToExpiryLowerBoundError</code>.</>,
                <>The observed <code className="text-primary">optionPrice</code> must lie within the discounted no-arbitrage band <code className="text-primary">[max(e^(−rτ)(F − K), 0), e^(−rτ)F]</code> for calls (analogously for puts) — otherwise <code className="text-primary">PriceOutOfBoundsError</code>.</>,
                <>Newton-Raphson from a fixed <code className="text-primary">55%</code> seed, up to <code className="text-primary">30</code> iterations, converging when the price residual falls within <code className="text-primary">~1e6</code> wei. Reverts <code className="text-primary">NoConvergenceError</code> if it fails to converge or if vega gets too small to invert. Typical convergence is 4–6 iterations.</>,
                <>The recovered volatility is clamped to <code className="text-primary">[MIN_VOL_IV, MAX_VOL_IV]</code> — i.e. <code className="text-primary">[0.01%, 1800%]</code> — on every step.</>,
                <>Each iteration reuses precomputed state and evaluates the <Link href="/docs/black-76/call/" className="text-primary underline">call</Link> / <Link href="/docs/black-76/put/" className="text-primary underline">put</Link> price together with <Link href="/docs/black-76/vega/" className="text-primary underline">vega</Link> in a single pass. Pure <code className="text-primary">internal</code> function; no external calls, no storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">impliedVolatility</code> inverts the Black-76 pricer: given a market price, it finds the volatility <code className="text-primary">σ</code> that reproduces it. There is no closed form, so DeFiMath uses Newton-Raphson on the pricing residual:
                    </p>
                    <MathBlock>{String.raw`\sigma_{n+1} = \sigma_n - \frac{\text{Black76}(\sigma_n) - P_{\text{market}}}{\text{vega}(\sigma_n)}`}</MathBlock>
                    <p>
                        Each step needs both the option price and its derivative with respect to vol (<Link href="/docs/black-76/vega/" className="text-primary underline">vega</Link>) at the current <code className="text-primary">σ</code>. These share almost all of their intermediate work — <code className="text-primary">d₁</code>, <code className="text-primary">d₂</code>, the density and CDF — so DeFiMath computes them together from cached state (<code className="text-primary">ln(F/K)</code>, <code className="text-primary">√T</code>, the discount factor) that never changes across iterations.
                    </p>
                    <p>
                        The solver seeds at <code className="text-primary">σ₀ = 55%</code>, caps at 30 iterations, and stops once the price residual is within <code className="text-primary">~1e6</code> wei; the running estimate is clamped into <code className="text-primary">[0.01%, 1800%]</code> each step. Convergence is a round-trip guarantee: <code className="text-primary">IV(price(σ)) ≈ σ</code> to within a <span className="text-white font-semibold">relative</span> <code className="text-primary">1e-6</code> where <code className="text-primary">σ ≥ 1</code> and an <span className="text-white font-semibold">absolute</span> <code className="text-primary">2e-6</code> where <code className="text-primary">σ &lt; 1</code> — head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
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
                    { name: "MIN_VOL_IV", value: <>0.01% floor on the recovered vol (<code className="text-primary">1e14</code>)</> },
                    { name: "MAX_VOL_IV", value: <>1800% ceiling on the recovered vol (<code className="text-primary">18e18</code>)</> },
                    { name: "IV_MAX_ITER", value: <>30 Newton-Raphson iterations before reverting</> },
                ],
                errors: [
                    { name: "FutureLowerBoundError", trigger: <><code className="text-primary">future ≤ MIN_FUTURE</code></> },
                    { name: "FutureUpperBoundError", trigger: <><code className="text-primary">future ≥ MAX_FUTURE</code></> },
                    { name: "StrikeLowerBoundError", trigger: <><code className="text-primary">strike · 5 &lt; future</code></> },
                    { name: "StrikeUpperBoundError", trigger: <><code className="text-primary">future · 5 &lt; strike</code></> },
                    { name: "TimeToExpiryUpperBoundError", trigger: <><code className="text-primary">timeToExp ≥ MAX_EXPIRATION</code></> },
                    { name: "TimeToExpiryLowerBoundError", trigger: <><code className="text-primary">timeToExp == 0</code></> },
                    { name: "RateUpperBoundError", trigger: <><code className="text-primary">rate ≥ MAX_RATE</code></> },
                    { name: "PriceOutOfBoundsError", trigger: <><code className="text-primary">optionPrice</code> outside the no-arbitrage band</> },
                    { name: "NoConvergenceError", trigger: <>solver failed to converge (or vega too small to invert)</> },
                ],
            }}
            example={`import "defimath-lib/contracts/derivatives/Black76.sol";

uint256 iv = Black76.impliedVolatility(
    1000e18,         // future = $1,000
    1050e18,         // strike = $1,050
    90 days,         // 90 days to expiry
    0.05e18,         // 5% discount rate
    96.9e18,         // observed market price ≈ $96.90
    true             // call
);
// iv ≈ 0.60e18  (recovers ~60% vol)`}
            parentSectionHref="/docs/black-76"
            parentSectionLabel="Back to Black-76 overview"
        />
    );
}
