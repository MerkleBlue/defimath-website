import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";
import { MathBlock } from "@/components/Documentation/Formula";

export const metadata: Metadata = {
    title: "Solidity Futures Pricing - 400 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity continuous-compounding futures pricing, 18-decimal fixed-point — 400 gas, 2e-12 max rel. error. price = spot · e^(r·τ).",
    alternates: { canonical: "/docs/futures/futureprice/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Derivatives" },
                { label: "Futures", href: "/docs/futures/" },
                { label: "futurePrice" },
            ]}
            module="Futures"
            name="futurePrice"
            summary="Computes the fair price of a futures contract using continuous compounding."
            gas="400"
            relError="2e-12"
            absError="1.2e-9"
            absErrorWhen="at a $1,000 spot"
            signature={`function futurePrice(
    uint128 spot,
    uint32  timeToExp,
    uint64  rate
) internal pure returns (uint256 price)`}
            parameters={[
                { name: "spot", type: "uint128", description: "Current spot price of the underlying, 18-decimal fixed-point." },
                { name: "timeToExp", type: "uint32", description: "Time to contract expiration in seconds. timeToExp == 0 returns spot unchanged." },
                { name: "rate", type: "uint64", description: "Annualized cost-of-carry (risk-free) rate, 18-decimal fixed-point." },
            ]}
            returns={[
                { name: "price", type: "uint256", description: "Futures price in 18-decimal fixed-point. Always ≥ spot for a non-negative rate." },
            ]}
            behaviorItems={[
                <>Validates all three inputs against module-wide constants and reverts with a typed error on any violation.</>,
                <>No strike and no volatility — a futures price depends only on spot, time, and the cost-of-carry rate.</>,
                <>Fast-path on expiration: when <code className="text-primary">timeToExp == 0</code>, returns <code className="text-primary">spot</code> unchanged (the carry factor is <code className="text-primary">e⁰ = 1</code>).</>,
                <>Shorter horizon than the options modules: <code className="text-primary">MAX_EXPIRATION</code> is <span className="text-white font-semibold">2 years</span>, not 32.</>,
                <>Composes a single DeFiMath primitive — <code className="text-primary">expPositive</code>, a fast path of <Link href="/docs/math/exp/" className="text-primary underline">exp</Link> for the non-negative <code className="text-primary">r·τ</code> guaranteed by validation.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls, no storage. Inlined into the caller&apos;s bytecode at compile time.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        The fair forward/futures price is the spot compounded continuously at the cost-of-carry rate to expiry:
                    </p>
                    <MathBlock>{String.raw`F = S \cdot e^{r T}`}</MathBlock>
                    <p>
                        <code className="text-primary">timeToExp</code> (seconds) is annualized by dividing by <code className="text-primary">SECONDS_IN_YEAR</code>, the exponent <code className="text-primary">r·τ</code> is formed, and the carry factor <code className="text-primary">e^(r·τ)</code> is evaluated with <code className="text-primary">Math.expPositive</code> — a branch of <Link href="/docs/math/exp/" className="text-primary underline">exp</Link> specialized for non-negative inputs, which the input bounds guarantee. A single multiply by <code className="text-primary">spot</code> gives the price. That one transcendental is why it lands at just <code className="text-primary">~400 gas</code>.
                    </p>
                    <p>
                        Because the price scales linearly with spot, its error is fundamentally <span className="text-white font-semibold">relative</span> and scale-invariant: <code className="text-primary">2e-12</code>, inherited from <code className="text-primary">exp</code>. The <code className="text-primary">1.2e-9</code> absolute figure is that same error expressed in dollars at a <code className="text-primary">$1,000</code> spot; it scales with the underlying. Head-to-head measurements live in <a href="https://github.com/MerkleBlue/defimath-compare" target="_blank" rel="noopener noreferrer" className="text-primary underline">defimath-compare</a>.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "MIN_SPOT", value: <>1e-6 smallest allowed spot price (<code className="text-primary">1e12</code>)</> },
                    { name: "MAX_SPOT", value: <>1e15 largest allowed spot price (<code className="text-primary">1e33</code>)</> },
                    { name: "MAX_EXPIRATION", value: <>2 years (63,072,000 seconds)</> },
                    { name: "MAX_RATE", value: <>400% annual (<code className="text-primary">4e18</code>)</> },
                ],
                errors: [
                    { name: "SpotLowerBoundError", trigger: <><code className="text-primary">spot ≤ MIN_SPOT</code></> },
                    { name: "SpotUpperBoundError", trigger: <><code className="text-primary">spot ≥ MAX_SPOT</code></> },
                    { name: "TimeToExpiryUpperBoundError", trigger: <><code className="text-primary">timeToExp ≥ MAX_EXPIRATION</code></> },
                    { name: "RateUpperBoundError", trigger: <><code className="text-primary">rate ≥ MAX_RATE</code></> },
                ],
            }}
            example={`import "defimath-lib/contracts/derivatives/Futures.sol";

uint256 price = Futures.futurePrice(
    1000e18,         // spot = $1,000
    90 days,         // 90 days to expiry
    0.05e18          // 5% cost-of-carry rate
);
// price ≈ 1012.4e18  (spot compounded at 5% for 90 days)`}
            parentSectionHref="/docs/futures"
            parentSectionLabel="Back to Futures overview"
        />
    );
}
