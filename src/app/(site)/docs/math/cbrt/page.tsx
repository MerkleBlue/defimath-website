import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "cbrt — Math | DeFiMath docs",
    description: "Solidity cube root in 18-decimal fixed-point. Gas-optimized at 368 gas, max rel. error 2.2e-16.",
    alternates: { canonical: "/docs/math/cbrt/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math" },
                { label: "cbrt" },
            ]}
            module="Math"
            name="cbrt"
            summary="Computes the real cube root of an 18-decimal fixed-point input."
            gas="368"
            precision="2.2e-16"
            signature={`function cbrt(uint256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "Cube root ∛x in 18-decimal fixed-point format." },
            ]}
            behaviorItems={[
                <>Returns <code className="text-primary">0</code> when <code className="text-primary">x == 0</code> (no revert).</>,
                <>Reverts with <code className="text-primary">CbrtUpperBoundError()</code> when <code className="text-primary">x ≥ 7.5557863725914323e40</code> (true value ≥ <code className="text-primary">2⁷⁶</code>).</>,
                <>Uses the <code className="text-primary">CLZ</code> opcode (Osaka) for a near-optimal initial guess; see <a className="text-primary underline" href="https://eips.ethereum.org/EIPS/eip-7939" target="_blank" rel="noopener noreferrer">EIP-7939</a>.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Cube root follows the same recipe as <a href="/docs/math/sqrt" className="text-primary underline">sqrt</a> — a CLZ-derived initial guess plus Newton's iteration — but with a twist that makes the implementation noticeably simpler. The cube-root Newton update is
                    </p>
                    <pre>{`y ← (2y + x/y²) / 3`}</pre>
                    <p>
                        which still has quadratic convergence: each step roughly doubles the number of correct bits. The CLZ-derived initial guess <code className="text-primary">y₀ = 2^⌈bits/3⌉</code> lands within a factor of <code className="text-primary">∛2</code> (~1.26) of the true root — slightly tighter than sqrt's <code className="text-primary">√2</code> start. Six iterations are enough to reach bit-exact precision at the 1e18 fixed-point scale.
                    </p>
                    <p>
                        The nice property of cube root is that it scales symmetrically. To compute <code className="text-primary">cbrt(v) · 1e18</code> we multiply the input by <code className="text-primary">1e36</code> once: <code className="text-primary">cbrt(x · 1e36) = cbrt(v · 1e54) = cbrt(v) · 1e18</code>. The same formula works for all <code className="text-primary">x &gt; 0</code> — no separate small-input branch, no inversion trick. That symmetry is why sqrt has two branches and cbrt has one.
                    </p>
                    <p>
                        The <code className="text-primary">x · 1e36</code> scaling is what sets the input cap: keeping it inside <code className="text-primary">uint256</code> means <code className="text-primary">x &lt; 2²⁵⁶ / 1e36 ≈ 2⁷⁶</code> in true value (~7.6e22) — still enormous for any realistic DeFi quantity. The whole hot path stays in <code className="text-primary">unchecked</code> Yul assembly: ~368 gas.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "CBRT_UPPER_BOUND", value: <><code className="text-primary">7.5557…e40</code> — upper bound on the FP-scaled input (true value <code className="text-primary">2⁷⁶ ≈ 7.6e22</code> before the <code className="text-primary">1e18</code> shift). <code className="text-primary">x == 0</code> returns <code className="text-primary">0</code> without revert.</> },
                ],
                errors: [
                    { name: "CbrtUpperBoundError", trigger: <><code className="text-primary">x ≥ CBRT_UPPER_BOUND</code></> },
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
