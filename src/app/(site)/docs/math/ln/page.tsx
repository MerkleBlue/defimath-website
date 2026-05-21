import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "ln — Math | DeFiMath docs",
    description: "Natural logarithm in 18-decimal fixed-point. Gas-optimized at 375 gas, max abs. error 1.5e-14.",
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math" },
                { label: "ln" },
            ]}
            module="Math"
            name="ln"
            summary="Computes the natural logarithm ln(x) for a 18-decimal fixed-point input."
            gas="375"
            precision="1.5e-14"
            signature={`function ln(uint256 x) internal pure returns (int256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Input in 18-decimal fixed-point format (1e18 = 1.0). Must be > 0." },
            ]}
            returns={[
                { name: "y", type: "int256", description: "Natural logarithm ln(x) in 18-decimal fixed-point format. Signed — negative when x < 1." },
            ]}
            behaviorItems={[
                <>Supports inputs both above and below 1 — the result is signed accordingly.</>,
                <>Reverts with <code className="text-primary">LnLowerBoundError()</code> when <code className="text-primary">x == 0</code>.</>,
                <>Uses the <code className="text-primary">CLZ</code> opcode (Osaka) for fast integer-part extraction; see <a className="text-primary hover:underline" href="https://eips.ethereum.org/EIPS/eip-7939" target="_blank" rel="noopener noreferrer">EIP-7939</a>.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            example={`import { DeFiMath } from "defimath-lib/contracts/math/Math.sol";

using DeFiMath for uint256;

uint256 x = 2e18;         // x = 2.0
int256  y = x.ln();       // y ≈ 0.69314718e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
