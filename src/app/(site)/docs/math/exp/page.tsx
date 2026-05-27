import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "exp — Math | DeFiMath docs",
    description: "Solidity exponential function e^x in 18-decimal fixed-point. Gas-optimized at 333 gas, max abs. error 5.1e-14.",
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math" },
                { label: "exp" },
            ]}
            module="Math"
            name="exp"
            summary="Computes the exponential function e^x for a signed 18-decimal fixed-point input."
            gas="333"
            precision="5.1e-14"
            signature={`function exp(int256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "int256", description: "Signed input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "Result e^x in 18-decimal fixed-point format." },
            ]}
            behaviorItems={[
                <>Handles negative inputs internally via reciprocal logic — pass any signed <code className="text-primary">int256</code>.</>,
                <>Reverts with <code className="text-primary">ExpUpperBoundError()</code> when <code className="text-primary">x ≥ 135.305999…e18</code>.</>,
                <>For very negative inputs (roughly <code className="text-primary">x &lt; −41.45e18</code>) returns 0 — a graceful underflow, not a revert.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            example={`import "defimath-lib/contracts/math/Math.sol";

int256  x = 1e18;             // x = 1.0
uint256 y = DeFiMath.exp(x);  // y ≈ 2.71828e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
