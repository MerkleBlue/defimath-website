import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "putOptionPrice — Options | DeFiMath docs",
    description: "Black-Scholes European put option pricing in Solidity, 18-decimal fixed-point. 2,887 gas — 4.6× cheaper than next-best on-chain. Max abs. error 5.4e-12 at $1,000 spot.",
    alternates: { canonical: "/docs/options/putoptionprice/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Options", href: "/docs/options" },
                { label: "putOptionPrice" },
            ]}
            module="Options"
            name="putOptionPrice"
            summary="Computes the Black-Scholes price of a European put option in 18-decimal fixed-point, at ~2,887 gas — the lowest on-chain implementation we've measured."
            gas="2,887"
            precision="5.4e-12"
            precisionLabel="Max abs. error"
            signature={`function putOptionPrice(
    uint128 spot,
    uint128 strike,
    uint32  timeToExp,
    uint64  volatility,
    uint64  rate
) internal pure returns (uint256 price)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price, 18-decimal fixed-point. Must satisfy MIN_SPOT < spot < MAX_SPOT (1e-6 < spot < 1e15)." },
                { name: "strike", type: "uint128", description: "Strike price, 18-decimal fixed-point. Must lie within [spot/5, spot·5] — the no-arbitrage band the function is precision-tuned for." },
                { name: "timeToExp", type: "uint32", description: "Time to expiration in seconds. Must satisfy timeToExp < MAX_EXPIRATION (63,072,000 s ≈ 2 years). timeToExp == 0 is allowed (handled as expired)." },
                { name: "volatility", type: "uint64", description: "Annualized implied volatility, 18-decimal fixed-point (e.g. 60% → 6e17)." },
                { name: "rate", type: "uint64", description: "Annualized risk-free rate, 18-decimal fixed-point. Must satisfy rate < MAX_RATE (4e18 = 400%)." },
            ]}
            returns={[
                { name: "price", type: "uint256", description: "Put option price in 18-decimal fixed-point. Always ≥ 0 (clamped at zero when Black-Scholes rounding produces a negative)." },
            ]}
            behaviorItems={[
                <>Validates all five inputs against module-wide constants (<code className="text-primary">MIN_SPOT</code>, <code className="text-primary">MAX_SPOT</code>, <code className="text-primary">MAX_STSP_RATIO</code>, <code className="text-primary">MAX_EXPIRATION</code>, <code className="text-primary">MAX_RATE</code>) and reverts with a typed error on any violation — see the <Link href="/docs/options#limits-and-errors" className="text-primary underline">limits &amp; errors table</Link>.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns intrinsic value <code className="text-primary">max(strike − spot, 0)</code> without running the pricer.</>,
                <>Composes four DeFiMath primitives — <Link href="/docs/math/ln" className="text-primary underline">ln</Link>, <code className="text-primary">sqrtTime</code> (specialized <Link href="/docs/math/sqrt" className="text-primary underline">sqrt</Link> for years), <code className="text-primary">expPositive</code> (rate is non-negative by validation), and <Link href="/docs/math/stdnormcdf" className="text-primary underline">stdNormCDF</Link> — each independently gas-tuned and validated.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
                <>Symmetric counterpart: <Link href="/docs/options/calloptionprice" className="text-primary underline">callOptionPrice</Link> uses identical input validation and the same d₁/d₂ machinery — substituting <code className="text-primary">Φ(d₁)</code>/<code className="text-primary">Φ(d₂)</code> for the put&apos;s <code className="text-primary">Φ(−d₁)</code>/<code className="text-primary">Φ(−d₂)</code>.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        <code className="text-primary">putOptionPrice</code> implements the closed-form Black-Scholes formula for a European put:
                    </p>
                    <pre>{`put = strike · e^(−rT) · Φ(−d₂) − spot · Φ(−d₁)

where d₁ = [ ln(spot/strike) + (r + σ²/2)·T ] / (σ·√T)
      d₂ = d₁ − σ·√T`}</pre>
                    <p>
                        The intermediate values <code className="text-primary">d₁</code> and <code className="text-primary">d₂</code> are computed exactly as in <Link href="/docs/options/calloptionprice" className="text-primary underline">callOptionPrice</Link>; the put&apos;s only structural difference is evaluating <code className="text-primary">Φ</code> at <code className="text-primary">−d₁</code>/<code className="text-primary">−d₂</code> instead of <code className="text-primary">d₁</code>/<code className="text-primary">d₂</code>, then reversing the order of the two terms in the final difference. Put-call parity guarantees the two prices stay consistent with each other to within the combined rounding of the underlying primitives.
                    </p>
                    <p>
                        Every transcendental maps to a DeFiMath primitive: <code className="text-primary">σ·√T</code> uses <code className="text-primary">DeFiMath.sqrtTime</code> (specialized for time-in-years inputs), <code className="text-primary">ln(spot/strike)</code> uses <Link href="/docs/math/ln" className="text-primary underline">DeFiMath.ln</Link>, the discount factor <code className="text-primary">e^(−rT)</code> is computed as <code className="text-primary">1 / DeFiMath.expPositive(rT)</code> (positive-input branch, since the input bounds guarantee <code className="text-primary">rT ≥ 0</code>), and the two normal CDFs use <Link href="/docs/math/stdnormcdf" className="text-primary underline">DeFiMath.stdNormCDF</Link>.
                    </p>
                    <p>
                        The annualization step converts <code className="text-primary">timeToExp</code> (seconds) to a year fraction by dividing by <code className="text-primary">SECONDS_IN_YEAR</code>, then scales volatility by <code className="text-primary">√T</code> once and reuses the result throughout. The <code className="text-primary">+1</code> on <code className="text-primary">scaledVol</code> keeps the division in <code className="text-primary">d₁</code> well-defined even for zero-vol edge cases. The final assembly computes <code className="text-primary">discountedStrike · Φ(−d₂) − spot · Φ(−d₁)</code> and clamps at zero — Black-Scholes can produce slightly negative values (on the order of <code className="text-primary">10⁻¹²</code>) due to rounding in the underlying primitives when the option is far out of the money. The 5.4e-12 max absolute error is benchmarked at <code className="text-primary">spot = $1,000</code> across a full sweep of strike, time, vol, and rate — reproducible from <Link href="https://github.com/MerkleBlue/defimath-compare" className="text-primary underline">defimath-compare</Link>.
                    </p>
                </>
            )}
            example={`import "defimath-lib/contracts/derivatives/Options.sol";

uint256 price = DeFiMathOptions.putOptionPrice(
    1000e18,         // spot = $1,000
    980e18,          // strike = $980
    60 * 1 days,     // 60 days to expiry
    0.60e18,         // 60% annualized vol
    0.05e18          // 5% risk-free rate
);
// price ≈ 71.4e18  (about $71.40 per option)`}
            parentSectionHref="/docs/options"
            parentSectionLabel="Back to Options overview"
        />
    );
}
