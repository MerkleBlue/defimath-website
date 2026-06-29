import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "sqrt — Math | DeFiMath docs",
    description: "Solidity square root in 18-decimal fixed-point — 245 gas, 2.8e-16 max rel. error. CLZ-derived initial guess (EIP-7939, EVM Osaka) plus Newton's iteration.",
    alternates: { canonical: "/docs/math/sqrt/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "sqrt" },
            ]}
            module="Math"
            name="sqrt"
            summary="Computes the principal square root of an 18-decimal fixed-point input."
            gas="245"
            precision="2.8e-16"
            signature={`function sqrt(uint256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "Square root √x in 18-decimal fixed-point format." },
            ]}
            behaviorItems={[
                <>Returns <code className="text-primary">0</code> when <code className="text-primary">x == 0</code> (no revert).</>,
                <>Reverts with <code className="text-primary">SqrtUpperBoundError()</code> only at the input magnitude where the FP18 scaling step (<code className="text-primary">x · 1e18</code>) would overflow <code className="text-primary">uint256</code> — i.e. <code className="text-primary">x ≥ ⌊(2²⁵⁶ − 1) / 1e18⌋ + 1 ≈ 1.158e59</code>.</>,
                <>Uses the <code className="text-primary">CLZ</code> opcode (Osaka) for a near-optimal initial guess; see <a className="text-primary underline" href="https://eips.ethereum.org/EIPS/eip-7939" target="_blank" rel="noopener noreferrer">EIP-7939</a>.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Square root in fixed-point reduces to two well-known problems: getting a fast initial guess and converging quickly with Newton's iteration. DeFiMath does both in assembly. The <code className="text-primary">CLZ</code> opcode (introduced in EVM Osaka) gives us <code className="text-primary">floor(log2(x))</code> for free, and from there an initial guess <code className="text-primary">y₀ = 2^⌈bits/2⌉</code> lands within a factor of <code className="text-primary">√2</code> (~1.41) of the true root — a one-bit error. Newton's iteration
                    </p>
                    <pre>{`y ← (y + x/y) / 2`}</pre>
                    <p>
                        then doubles the number of correct bits every step, so six iterations carry us from one correct bit to 64 — comfortably bit-exact at the 1e18 fixed-point scale.
                    </p>
                    <p>
                        To compute <code className="text-primary">sqrt(v) · 1e18</code> we scale the input first: <code className="text-primary">sqrt(x · 1e18) = sqrt(v · 1e36) = sqrt(v) · 1e18</code>. So for inputs ≥ 1.0 we multiply by 1e18 once, run the iteration, and we're done. The input cap is set at exactly the boundary where this scaling multiplication would overflow <code className="text-primary">uint256</code> — no earlier, so the function accepts the full precision-safe input range.
                    </p>
                    <p>
                        For inputs below 1.0 we invert instead of scaling: compute <code className="text-primary">sqrt(1e54 / x)</code>, then divide <code className="text-primary">1e36</code> by the result. This preserves bit precision — a naive <code className="text-primary">sqrt(x · 1e18)</code> for tiny <code className="text-primary">x</code> would land in too few high-order bits and lose accuracy. The whole hot path stays in <code className="text-primary">unchecked</code> Yul assembly with no branches inside Newton — ~245 gas, the cheapest sqrt of any on-chain library we've measured.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "SQRT_UPPER_BOUND", value: <><code className="text-primary">⌊(2²⁵⁶ − 1) / 1e18⌋ + 1 ≈ 1.158e59</code> — the smallest input where the FP18 scaling step <code className="text-primary">x · 1e18</code> would overflow <code className="text-primary">uint256</code>. <code className="text-primary">x == 0</code> returns <code className="text-primary">0</code> without revert.</> },
                ],
                errors: [
                    { name: "SqrtUpperBoundError", trigger: <><code className="text-primary">x ≥ SQRT_UPPER_BOUND</code></> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

uint256 x = 2e18;             // x = 2.0
uint256 y = DeFiMath.sqrt(x); // y ≈ 1.41421356e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
