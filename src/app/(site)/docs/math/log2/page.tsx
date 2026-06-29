import { Metadata } from "next";
import Link from "next/link";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "log2 — Math | DeFiMath docs",
    description: "Solidity base-2 logarithm in 18-decimal fixed-point — 391 gas, 1.5e-14 max rel. error. Change-of-base log₂(x) = ln(x) / ln(2) on DeFiMath's 375-gas ln.",
    alternates: { canonical: "/docs/math/log2/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "log2" },
            ]}
            module="Math"
            name="log2"
            summary="Computes the base-2 logarithm of a positive 18-decimal fixed-point input via the change-of-base identity log₂(x) = ln(x) / ln(2)."
            gas="391"
            precision="1.5e-14"
            signature={`function log2(uint256 x) internal pure returns (int256 y)`}
            parameters={[
                { name: "x", type: "uint256", description: "Input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "int256", description: "Result log₂(x) in 18-decimal fixed-point format. Signed — returns negative values for x < 1 (i.e. x < 1e18)." },
            ]}
            behaviorItems={[
                <>Implemented as <code className="text-primary"><Link href="/docs/math/ln/" className="text-primary underline">ln</Link>(x) · 1e18 / 0.6931472…e18</code> — a single multiply-and-divide on top of <code className="text-primary">ln</code>.</>,
                <>Reverts with <code className="text-primary">LnLowerBoundError()</code> on <code className="text-primary">x == 0</code>, inherited from <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>.</>,
                <>Returns 0 when <code className="text-primary">x == 1e18</code> (i.e. <code className="text-primary">log₂(1) = 0</code>); negative when <code className="text-primary">x &lt; 1e18</code>; positive when <code className="text-primary">x &gt; 1e18</code>.</>,
                <>Precision inherits from <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>; the change-of-base division adds a negligible ulp of rounding.</>,
                <>Pure <code className="text-primary">internal</code> function; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        The change-of-base identity converts any logarithm into a single division by a constant:
                    </p>
                    <pre>{`log₂(x) = ln(x) / ln(2)`}</pre>
                    <p>
                        DeFiMath stores <code className="text-primary">ln(2)</code> as the 18-decimal constant <code className="text-primary">693147180559945309</code> (precision ~5e-19 vs. the true value). The implementation is one line:
                    </p>
                    <pre>{`y = ln(x) * 1e18 / 693147180559945309;`}</pre>
                    <p>
                        The multiplication by <code className="text-primary">1e18</code> before dividing keeps the result in 18-decimal fixed-point format. Total cost is one <Link href="/docs/math/ln/" className="text-primary underline">ln</Link> call (~375 gas) plus a 16-gas mul+div, hence the ~391 gas total.
                    </p>
                    <p>
                        Because the implementation is a thin wrapper over <Link href="/docs/math/ln/" className="text-primary underline">ln</Link>, every guarantee <code className="text-primary">ln</code> provides — domain (<code className="text-primary">x &gt; 0</code>), precision, sign behavior — flows through directly. The only added error term is the rounding of <code className="text-primary">ln(2)</code> to 18 decimals, which is dwarfed by <code className="text-primary">ln</code>&apos;s own ~1e-14 error.
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

uint256 x  = 8e18;                  // x = 8.0
int256  l2 = DeFiMath.log2(x);      // l2 ≈ 3e18  (= log₂(8))

uint256 y  = 0.5e18;                // y = 0.5
int256  ly = DeFiMath.log2(y);      // ly ≈ −1e18 (= log₂(0.5))`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
