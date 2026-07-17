import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "cbrt — Math | DeFiMath docs",
    description: "Solidity cube root in 18-decimal fixed-point — 340 gas, 2.0e-13 max rel. / 3.0e-16 max abs. error. CLZ-derived seed + 6 Newton iterations. Full uint256 domain, no revert.",
    alternates: { canonical: "/docs/math/cbrt/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "cbrt" },
            ]}
            module="Math"
            name="cbrt"
            summary="Computes the real cube root of an 18-decimal fixed-point input. Accepts the full uint256 domain without reverting."
            gas="340"
            precision="2.0e-13 / 3.0e-16"
            precisionLabel="Max rel. / abs. error"
            signature={`function cbrt(uint256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Input in 18-decimal fixed-point format (1e18 = 1.0). Any value in [0, uint256.max] accepted." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "Cube root ∛x in 18-decimal fixed-point format." },
            ]}
            behaviorItems={[
                <>Returns <code className="text-primary">0</code> when <code className="text-primary">x == 0</code> — handled by the algorithm&apos;s natural underflow via EVM&apos;s <code className="text-primary">div(0, 0) = 0</code> semantic, no explicit guard.</>,
                <>Never reverts. Handles the full <code className="text-primary">[0, uint256.max]</code> range via a two-branch split at <code className="text-primary">type(uint128).max</code>.</>,
                <>Uses the <code className="text-primary">CLZ</code> opcode (Osaka) for a near-optimal initial guess; see <a className="text-primary underline" href="https://eips.ethereum.org/EIPS/eip-7939" target="_blank" rel="noopener noreferrer">EIP-7939</a>.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Cube root follows the same recipe as <a href="/docs/math/sqrt/" className="text-primary underline">sqrt</a> — a CLZ-derived initial guess plus Newton&apos;s iteration. The cube-root Newton update is
                    </p>
                    <pre>{`y ← (2y + x/y²) / 3`}</pre>
                    <p>
                        which still has quadratic convergence: each step roughly doubles the number of correct bits. The CLZ-derived initial guess <code className="text-primary">y₀ = 2^⌈bits/3⌉</code> lands within a factor of <code className="text-primary">∛2</code> (~1.26) of the true root — slightly tighter than sqrt&apos;s <code className="text-primary">√2</code> start. Six iterations reach bit-exact precision at the FP18 scale.
                    </p>
                    <p>
                        <strong>Two branches</strong> handle the full <code className="text-primary">uint256</code> domain. For <code className="text-primary">x ≤ type(uint128).max</code>, the input is pre-scaled by <code className="text-primary">1e36</code>: <code className="text-primary">cbrt(x · 1e36) = cbrt(v · 1e54) = cbrt(v) · 1e18</code> — Newton lands on the FP18 answer directly, bit-perfect. For <code className="text-primary">x &gt; type(uint128).max</code> (where <code className="text-primary">x · 1e36</code> would overflow), Newton runs on raw <code className="text-primary">x</code> and the result is post-scaled by <code className="text-primary">1e12</code>.
                    </p>
                    <p>
                        The large-x branch trades a small amount of precision for domain coverage. Near the branch boundary, integer cbrt has ~13 significant digits, so the post-scale gives ~10⁻¹³ relative error — sub-FP18 but well below any DeFi-relevant tolerance. Precision improves quickly as <code className="text-primary">x</code> grows and integer cbrt gains significant digits; by <code className="text-primary">x ≈ 10⁵⁴</code> the result is again bit-perfect.
                    </p>
                    <p>
                        The whole hot path stays in <code className="text-primary">unchecked</code> Yul assembly: ~340 gas, ~37% cheaper than Solady&apos;s <code className="text-primary">cbrtWad</code> at matching precision, with a strictly wider input domain (Solady reverts on large inputs).
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "Input domain", value: <>Full <code className="text-primary">uint256</code> domain — the function has no named bounds and accepts any input in <code className="text-primary">[0, uint256.max]</code>. The internal branch cutoff at <code className="text-primary">type(uint128).max</code> is an implementation detail, not a limit on callers.</> },
                ],
                errors: [
                    { name: "None", trigger: <>Never reverts. Accepts any <code className="text-primary">uint256</code> input. <code className="text-primary">x == 0</code> returns <code className="text-primary">0</code>; large <code className="text-primary">x</code> takes the post-scale branch with precision degrading to ~1e-13 near the branch boundary and tightening back to bit-perfect as <code className="text-primary">x</code> grows past <code className="text-primary">1e54</code>.</> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

uint256 x = 8e18;             // x = 8.0
uint256 y = DeFiMath.cbrt(x); // y = 2e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
