import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "sqrt — Math | DeFiMath docs",
    description: "Solidity square root in 18-decimal fixed-point — 197 gas, 2.2e-16 max rel. error. Centered CLZ-derived seed (0.75 · 2^ceil(bits/2)) + 5 Newton iterations. Full uint256 domain, no revert.",
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
                        Square root in fixed-point reduces to two steps: pick a cheap seed close to <code className="text-primary">√x</code>, then refine with Newton&apos;s iteration. DeFiMath picks the seed from a single CLZ computation, then runs 5 Newton steps.
                    </p>
                    <pre>{`// Centered CLZ-derived seed:  y ≈ 0.75 · 2^ceil(bits/2)  =  3 · 2^(ceil-2)
// Compact form: shl(shr(1, sub(253, clz(x))), 3)
y := 3 << ((253 − clz(x)) / 2)

// 5 Newton iterations — quadratic convergence to bit-perfect FP18
y ← (y + x/y) / 2`}</pre>
                    <p>
                        The pure &ldquo;ceiling&rdquo; CLZ seed <code className="text-primary">2^ceil(bits/2)</code> overshoots by 2× at even powers of 2 — a 100% initial error. Multiplying by <code className="text-primary">0.75</code> centers the seed geometrically between the floor and ceiling variants, cutting worst-case error to ~50%. Cost of the centering: a single extra <code className="text-primary">-2</code> in the exponent (folded into the constant as <code className="text-primary">253</code> instead of <code className="text-primary">257</code>) and shifting the value <code className="text-primary">3</code> instead of <code className="text-primary">1</code> — 6 extra gas vs the pure ceil form.
                    </p>
                    <p>
                        From a 50% initial error, Newton&apos;s quadratic convergence gives 5 iterations of headroom to reach FP18: 0.5 → 0.083 → 3.5e-3 → 6.1e-6 → 1.9e-11 → 1.8e-22. Five iterations lands well past FP18&apos;s ~60-bit precision ceiling with margin for input variance.
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
