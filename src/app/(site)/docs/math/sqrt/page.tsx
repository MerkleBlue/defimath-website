import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "Solidity Sqrt Function - 197 Gas Fixed-Point - DeFiMath Docs",
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
            absError="1.0e-18"
            absErrorWhen="when sqrt(x) < 1"
            relError="2.0e-18"
            relErrorWhen="when sqrt(x) ≥ 1"
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
                <>Uses the <code className="text-primary">CLZ</code> opcode (Osaka) inside the range reduction; see <a className="text-primary underline" href="/blog/clz-opcode-solidity/">Counting leading zeros in Solidity using CLZ opcode</a>.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        Pre-scale, seed, refine — all in assembly:
                    </p>
                    <pre>{`// 1. Pre-scale x to 1e36 base so div(x, y) lands in 1e18 — cheap div, no muldiv
x := mul(x, 1e18)

// 2. CLZ seed:  y = 2^floor(msb/2),  msb = 256 − clz(x)   — within √2 of √x
y := shl(shr(1, sub(254, clz(x))), 2)

// 3. Five Newton steps — shr halves; quadratic convergence to bit-perfect FP18
y := shr(1, add(y, div(x, y)))             // ×5,  ~20 gas each`}</pre>
                    <p>
                        The seed lands within a factor of <code className="text-primary">√2</code> of the root (~41% worst case); five Newton steps drive that to ~80 bits — bit-exact when <code className="text-primary">√x &lt; 1</code>, under <code className="text-primary">2e-18</code> relative error above. A second branch post-scales instead of pre-scaling for <code className="text-primary">x &gt; type(uint128).max</code>, where <code className="text-primary">x · 1e18</code> would overflow. Full derivation in the walkthrough:{" "}
                        <a className="text-primary underline" href="/blog/how-i-wrote-a-fixed-point-solidity-sqrt-that-runs-in-197-gas/">How I wrote a fixed-point Solidity sqrt that runs in 197 gas</a>.
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
