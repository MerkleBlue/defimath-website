import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "log10 — Math | DeFiMath docs",
    description: "Solidity base-10 logarithm in 18-decimal fixed-point. 391 gas, max rel. error 1.4e-14. Built on DeFiMath's gas-optimized ln.",
    alternates: { canonical: "/docs/math/log10/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "log10" },
            ]}
            module="Math"
            name="log10"
            summary="Computes the base-10 logarithm of a positive 18-decimal fixed-point input via the change-of-base identity log₁₀(x) = ln(x) / ln(10)."
            gas="391"
            precision="1.4e-14"
            signature={`function log10(uint256 x) internal pure returns (int256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "int256", description: "Result log₁₀(x) in 18-decimal fixed-point format. Signed — returns negative values for x < 1 (i.e. x < 1e18)." },
            ]}
            behaviorItems={[
                <>Implemented as <code className="text-primary"><Link href="/docs/math/ln/" className="text-primary underline">ln</Link>(x) · 1e18 / 2.302585…e18</code> — a single multiply-and-divide on top of <code className="text-primary">ln</code>.</>,
                <>Reverts with <code className="text-primary">LnLowerBoundError()</code> on <code className="text-primary">x == 0</code>, inherited from <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>.</>,
                <>Returns 0 when <code className="text-primary">x == 1e18</code> (i.e. <code className="text-primary">log₁₀(1) = 0</code>); negative when <code className="text-primary">x &lt; 1e18</code>; positive when <code className="text-primary">x &gt; 1e18</code>.</>,
                <>Precision inherits from <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>; the change-of-base division adds a negligible ulp of rounding.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        The change-of-base identity converts any logarithm into a single division by a constant:
                    </p>
                    <pre>{`log₁₀(x) = ln(x) / ln(10)`}</pre>
                    <p>
                        DeFiMath stores <code className="text-primary">ln(10)</code> as the 18-decimal constant <code className="text-primary">2302585092994045684</code> (precision ~5e-19 vs. the true value). The implementation is one line:
                    </p>
                    <pre>{`y = ln(x) * 1e18 / 2302585092994045684;`}</pre>
                    <p>
                        The multiplication by <code className="text-primary">1e18</code> before dividing keeps the result in 18-decimal fixed-point format. Total cost is one <Link href="/docs/math/ln/" className="text-primary underline">ln</Link> call (~375 gas) plus a 16-gas mul+div, hence the ~391 gas total.
                    </p>
                    <p>
                        Because the implementation is a thin wrapper over <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, every guarantee <code className="text-primary">ln</code> provides — domain (<code className="text-primary">x &gt; 0</code>), precision, sign behavior — flows through directly. The only added error term is the rounding of <code className="text-primary">ln(10)</code> to 18 decimals, which is dwarfed by <code className="text-primary">ln</code>&apos;s own ~1e-14 error.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "Input domain", value: <>Full <code className="text-primary">uint256</code> domain except <code className="text-primary">x == 0</code> (see Errors). Inherits <code className="text-primary">ln</code>&apos;s unbounded acceptance — no named upper or lower bound constants.</> },
                ],
                errors: [
                    { name: "LnLowerBoundError", trigger: <><code className="text-primary">x == 0</code> (inherited via the internal call to <code className="text-primary">ln</code>)</> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

uint256 x   = 1000e18;               // x = 1000
int256  l10 = DeFiMath.log10(x);     // l10 ≈ 3e18  (= log₁₀(1000))

uint256 y   = 0.1e18;                // y = 0.1
int256  ly  = DeFiMath.log10(y);     // ly  ≈ −1e18 (= log₁₀(0.1))`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
