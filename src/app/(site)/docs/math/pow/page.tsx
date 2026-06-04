import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "pow — Math | DeFiMath docs",
    description: "Solidity power function x^a in 18-decimal fixed-point. Gas-optimized at 750 gas, max rel. error 5.2e-14.",
    alternates: { canonical: "/docs/math/pow/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math" },
                { label: "pow" },
            ]}
            module="Math"
            name="pow"
            summary="Computes the power function x^a for an 18-decimal fixed-point base and signed exponent."
            gas="750"
            precision="5.2e-14"
            signature={`function pow(uint256 x, int256 a) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Base in 18-decimal fixed-point format (1e18 = 1.0). Must be > 0 unless a == 0." },
                { name: "a", type: "int256", description: "Signed exponent in 18-decimal fixed-point format. Negative values give reciprocal powers." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "x^a in 18-decimal fixed-point format." },
            ]}
            behaviorItems={[
                <>Fast path: <code className="text-primary">x^0 = 1</code> for any <code className="text-primary">x</code>, including the convention <code className="text-primary">0^0 = 1</code>.</>,
                <>Reverts with <code className="text-primary">LnLowerBoundError()</code> when <code className="text-primary">x == 0</code> and <code className="text-primary">a ≠ 0</code> (mathematically undefined).</>,
                <>Reverts with <code className="text-primary">ExpUpperBoundError()</code> when <code className="text-primary">a · ln(x)</code> overflows <code className="text-primary">exp</code>'s upper bound (~135.3e18).</>,
                <>Returns <code className="text-primary">0</code> when <code className="text-primary">a · ln(x) ≤ −41.45e18</code> — a graceful underflow inherited from <a href="/docs/math/exp" className="text-primary underline">exp</a>.</>,
                <>Pure assembly hot path via <a href="/docs/math/ln" className="text-primary underline">ln</a> and <a href="/docs/math/exp" className="text-primary underline">exp</a>; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        The cleanest power implementation in fixed-point uses the textbook identity
                    </p>
                    <pre>{`x^a = exp(a · ln(x))`}</pre>
                    <p>
                        DeFiMath just composes its <a href="/docs/math/ln" className="text-primary underline">ln</a> and <a href="/docs/math/exp" className="text-primary underline">exp</a> — no separate Taylor series, no special handling of integer exponents, no per-case branching. The composition inherits both functions' bounds and precision automatically, and means <code className="text-primary">pow</code> doesn't have to be re-tuned every time <code className="text-primary">ln</code> or <code className="text-primary">exp</code> get a gas tweak.
                    </p>
                    <p>
                        One fast path: <code className="text-primary">x^0 = 1</code> (which also covers <code className="text-primary">0^0 = 1</code> by convention) short-circuits before either expensive call. Everything else flows through <code className="text-primary">ln</code>, multiplies by <code className="text-primary">a</code>, then through <code className="text-primary">exp</code> — ~750 gas total, roughly the sum of one <code className="text-primary">ln</code> (375 gas) and one <code className="text-primary">exp</code> (333 gas).
                    </p>
                    <p>
                        The composition picks up CLZ savings for free. <code className="text-primary">ln</code> uses the <code className="text-primary">CLZ</code> opcode for range reduction (see the <a href="/blog/clz-opcode-solidity" className="text-primary underline">CLZ writeup</a>), <code className="text-primary">exp</code> uses a Padé approximant on a tiny reduced range. Both stay in inline assembly. The cost of <code className="text-primary">pow</code> is exactly the cost of its parts — predictable and stable.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "Base x", value: <><code className="text-primary">&gt; 0</code> when <code className="text-primary">a ≠ 0</code> (fast path: <code className="text-primary">x⁰ = 1</code> for any x, including 0)</> },
                    { name: "a · ln(x)", value: <><code className="text-primary">&lt; 135.305999…e18</code> (composition with <code className="text-primary">exp</code>; underflows to 0 below <code className="text-primary">−41.45e18</code>)</> },
                ],
                errors: [
                    { name: "LnLowerBoundError", trigger: <><code className="text-primary">x == 0</code> and <code className="text-primary">a ≠ 0</code> (via <code className="text-primary">ln(x)</code>)</> },
                    { name: "ExpUpperBoundError", trigger: <><code className="text-primary">a · ln(x) ≥ 135.305999…e18</code> (via <code className="text-primary">exp(a · ln(x))</code>)</> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

uint256 x = 2e18;                // x = 2.0
int256  a = 10e18;               // a = 10
uint256 y = DeFiMath.pow(x, a);  // y = 1024e18 (2^10)`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
