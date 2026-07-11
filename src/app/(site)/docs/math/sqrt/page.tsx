import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "sqrt — Math | DeFiMath docs",
    description: "Solidity square root in 18-decimal fixed-point — 212 gas, 2.2e-16 max rel. error. Minimax linear seed on a Q0.30 mantissa + 4 Newton iterations. Full uint256 domain, no revert.",
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
            summary="Computes the principal square root of an 18-decimal fixed-point input. Accepts the full uint256 domain without reverting."
            gas="212"
            precision="2.2e-16"
            signature={`function sqrt(uint256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Input in 18-decimal fixed-point format (1e18 = 1.0). Any value in [0, uint256.max] accepted." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "Square root √x in 18-decimal fixed-point format." },
            ]}
            behaviorItems={[
                <>Returns <code className="text-primary">0</code> when <code className="text-primary">x == 0</code> — handled by the algorithm's natural underflow via EVM&apos;s <code className="text-primary">div(0, 0) = 0</code> semantic, no explicit guard.</>,
                <>Never reverts. Handles the full <code className="text-primary">[0, uint256.max]</code> range via a two-branch split at <code className="text-primary">type(uint128).max</code>.</>,
                <>Uses the <code className="text-primary">CLZ</code> opcode (Osaka) inside the range reduction; see <a className="text-primary underline" href="https://eips.ethereum.org/EIPS/eip-7939" target="_blank" rel="noopener noreferrer">EIP-7939</a>.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Square root in fixed-point reduces to three steps: reduce the input to a bounded mantissa, seed the answer from a linear approximation on that mantissa, and refine with Newton&apos;s iteration. DeFiMath does all three in assembly.
                    </p>
                    <pre>{`// Range reduction with CLZ (EIP-7939) — bounded mantissa m ∈ [2^30, 2^32)
k := (256 − clz(x) − 31) & ~1
m := x >> k

// Minimax linear seed on m — sqrt(m_real) ≈ m_real/3 + 17/24, in Q0.30
seed := 760567125 + m/3
y_seed := seed << (k/2 − 15)

// 4 Newton iterations — quadratic convergence to bit-perfect FP18
y ← (y + x/y) / 2`}</pre>
                    <p>
                        The minimax linear approximation on <code className="text-primary">[1, 4)</code> gives ~4.6 correct bits from the start. Newton doubles the bit count each iteration: 4.6 → 9.2 → 18.4 → 36.8 → 73.6. Four iterations comfortably exceeds FP18&apos;s ~60-bit precision ceiling.
                    </p>
                    <p>
                        The <code className="text-primary">Q0.30</code> mantissa (rather than the more common floating-point bases) makes every shift a clean power-of-2 operation, sidesteps the √2 parity correction on reconstruction, and works uniformly for both <code className="text-primary">x ≥ 1</code> and <code className="text-primary">x &lt; 1</code> without a branch inside the main path.
                    </p>
                    <p>
                        <strong>Two branches</strong> handle the full <code className="text-primary">uint256</code> domain. For <code className="text-primary">x ≤ type(uint128).max</code>, the input is pre-scaled by <code className="text-primary">1e18</code> so Newton converges to FP18 directly — bit-perfect. For <code className="text-primary">x &gt; type(uint128).max</code> (where <code className="text-primary">x · 1e18</code> would overflow), Newton runs on raw <code className="text-primary">x</code> and the result is post-scaled by <code className="text-primary">1e9</code>. Both branches are bit-perfect; the split is chosen so integer sqrt still has enough significant digits at the boundary.
                    </p>
                    <p>
                        Total: ~212 gas for typical inputs — the cheapest sqrt of any on-chain library we&apos;ve measured. And the widest domain: no other library accepts the full <code className="text-primary">uint256</code> range without reverting.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "Input domain", value: <>Full <code className="text-primary">uint256</code> domain — the function has no named bounds and accepts any input in <code className="text-primary">[0, uint256.max]</code>. The internal branch cutoff at <code className="text-primary">type(uint128).max</code> is an implementation detail, not a limit on callers.</> },
                ],
                errors: [
                    { name: "None", trigger: <>Never reverts. Accepts any <code className="text-primary">uint256</code> input. <code className="text-primary">x == 0</code> returns <code className="text-primary">0</code>; large <code className="text-primary">x</code> takes the post-scale branch and stays FP18-accurate.</> },
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
