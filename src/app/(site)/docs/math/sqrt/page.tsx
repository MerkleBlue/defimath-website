import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "sqrt — Math | DeFiMath docs",
    description: "Solidity square root in 18-decimal fixed-point — 197 gas, 2.0e-18 max rel. error. CLZ-derived power-of-two seed (2^floor(bits/2)) + 5 Newton iterations. Full uint256 domain, no revert.",
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
            gas="197"
            precision="2.0e-18"
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
                        Square root in fixed-point reduces to two steps: pick a cheap seed close to <code className="text-primary">√x</code>, then refine with Newton&apos;s iteration. DeFiMath picks the seed from a single CLZ computation, then runs 5 Newton steps.
                    </p>
                    <pre>{`// CLZ-derived power-of-two seed:  y = 2^floor(bits/2),  bits = 256 − clz(x)
// Compact form: shl(shr(1, sub(254, clz(x))), 2)
y := 2 << ((254 − clz(x)) / 2)

// 5 Newton iterations — quadratic convergence to bit-perfect FP18
y ← (y + x/y) / 2`}</pre>
                    <p>
                        The seed is simply the largest power of two at or below <code className="text-primary">√x</code>&apos;s magnitude: halving the bit length is one shift, so the estimate costs a single <code className="text-primary">CLZ</code>, a subtract and a shift — no multiply. Since <code className="text-primary">x</code> lies in <code className="text-primary">[2^(bits−1), 2^bits)</code>, the seed is always within a factor of <code className="text-primary">√2</code> of the true root: it overshoots by at most 41% at even bit lengths and undershoots by at most 29% at odd ones, so the worst-case initial error is ~41%.
                    </p>
                    <p>
                        From a ~41% initial error, Newton&apos;s quadratic convergence (<code className="text-primary">e → e²/2</code>) reaches FP18 in 5 steps with room to spare: 0.41 → 0.084 → 3.5e-3 → 6.1e-6 → 1.9e-11 → 1.8e-22. Five iterations lands well past FP18&apos;s ~60-bit precision ceiling with margin for input variance.
                    </p>
                    <p>
                        <strong>Two branches</strong> handle the full <code className="text-primary">uint256</code> domain. For <code className="text-primary">x ≤ type(uint128).max</code>, the input is pre-scaled by <code className="text-primary">1e18</code> so Newton converges to FP18 directly — bit-perfect. For <code className="text-primary">x &gt; type(uint128).max</code> (where <code className="text-primary">x · 1e18</code> would overflow), Newton runs on raw <code className="text-primary">x</code> and the result is post-scaled by <code className="text-primary">1e9</code>. Both branches are bit-perfect; the split is chosen so integer sqrt still has enough significant digits at the boundary.
                    </p>
                    <p>
                        Total: ~197 gas for typical inputs — the cheapest sqrt of any on-chain library we&apos;ve measured. And the widest domain: no other library accepts the full <code className="text-primary">uint256</code> range without reverting.
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
