import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "Solidity StdNormPDF Function - 320 Gas Fixed-Point - DeFiMath Docs",
    description: "Solidity standard normal PDF φ(x) in 18-decimal fixed-point — 320 gas, 3.0e-16 max abs. error. One exponential on x²/2, with the 1/√(2π) normalisation folded into a single divide.",
    alternates: { canonical: "/docs/math/stdnormpdf/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "stdNormPDF" },
            ]}
            module="Math"
            name="stdNormPDF"
            summary="Computes the standard normal probability density function of x in 18-decimal fixed-point."
            gas="320"
            absError="3.0e-16"
            signature={`function stdNormPDF(int256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "int256", description: "Signed input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "φ(x) in 18-decimal fixed-point format, in range [0, 398942280401432677] — the upper end is the peak 1/√(2π) at x = 0." },
            ]}
            behaviorItems={[
                <>Even: <code className="text-primary">φ(−x) = φ(x)</code>, bit-for-bit. The sign is folded away before any arithmetic, so both halves run the identical code path.</>,
                <>Saturates gracefully (no revert): returns <code className="text-primary">0</code> for <code className="text-primary">|x| ≥ 9.1</code>. The density has already underflowed below one wei by <code className="text-primary">|x| ≈ 9.0024</code>, so the cap introduces no discontinuity.</>,
                <>Strictly decreasing in <code className="text-primary">|x|</code> until it underflows to <code className="text-primary">0</code>.</>,
                <>Unlike <a href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</a> and <a href="/docs/math/erf/" className="text-primary underline">erf</a>, no rational approximation is involved — the density is one exponential, which is why it costs about half of Φ(x).</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        The standard normal density has a closed form with no special function in it at all:
                    </p>
                    <pre>{`φ(x) = e^(−x²/2) / √(2π)`}</pre>
                    <p>
                        That makes it structurally cheaper than its integral. <a href="/docs/math/stdnormcdf/" className="text-primary underline">stdNormCDF</a> needs West&apos;s rational approximation — two degree-5 polynomials — <em>plus</em> an exponential. The density needs only the exponential, so the whole function is a fold, a guard, one <code className="text-primary">exp</code>, and one divide.
                    </p>
                    <p>
                        Three details carry the gas number. First, <strong>the sign folds away for free</strong>. Because <code className="text-primary">x²</code> is sign-free, squaring happens in signed space and the absolute value is never needed on the value path — only the saturation guard looks at <code className="text-primary">|x|</code>. That removes the mirrored positive/negative branches that <code className="text-primary">stdNormCDF</code> and <code className="text-primary">erf</code> both carry; measured against a two-branch implementation, folding the sign is ~6 gas cheaper.
                    </p>
                    <p>
                        Second, <strong>the negative exponent is inverted rather than evaluated</strong>. Instead of computing <code className="text-primary">e^(−x²/2)</code>, DeFiMath computes <code className="text-primary">e^(+x²/2)</code> through <code className="text-primary">expPositive</code> — the internal unguarded fast path — and divides. The reciprocal costs nothing extra because a divide was needed anyway for the <code className="text-primary">1/√(2π)</code> normalisation.
                    </p>
                    <p>
                        Third, <strong>the normalising constant is carried at 36 decimals</strong>, not 18:
                    </p>
                    <pre>{`INV_SQRT_2PI_E36 = 398942280401432677939946059934381868

y = INV_SQRT_2PI_E36 / e^(x²/2)`}</pre>
                    <p>
                        Since the exponential is an 18-decimal value, dividing a 1e36-scaled numerator by it lands directly on an 18-decimal result — one <code className="text-primary">DIV</code>, no rescaling multiply, and the 18 extra digits keep the quotient exact to the wei. The halving rides along in the same descale (<code className="text-primary">x · x / 2e18</code> rather than a divide followed by a shift), which floor-division makes exactly equivalent.
                    </p>
                    <p>
                        The tail is a plain guard: at <code className="text-primary">|x| = 9.1</code> the true density is ≈ <code className="text-primary">4.2e-19</code>, already under one wei, so the function returns <code className="text-primary">0</code> without running the exponential. That guard doubles as the overflow check on the squaring. Net cost on the hot path: ~320 gas, roughly half of Φ(x) at 618.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "STD_NORM_PDF_BOUND", value: <><code className="text-primary">9.1e18</code> — saturation magnitude. At <code className="text-primary">|x| ≥ STD_NORM_PDF_BOUND</code>, <code className="text-primary">φ(x)</code> is below <code className="text-primary">1e-18</code> and so is already <code className="text-primary">0</code> in 18-decimal fixed-point; the function short-circuits rather than running the exponential. It also bounds the <code className="text-primary">x · x</code> squaring away from overflow.</> },
                    { name: "INV_SQRT_2PI_E36", value: <><code className="text-primary">398942280401432677939946059934381868</code> — <code className="text-primary">1/√(2π)</code> at 36 decimals, so a single divide by the 18-decimal exponential yields an 18-decimal result.</> },
                ],
                errors: [
                    { name: "None", trigger: <>Never reverts. Accepts the full <code className="text-primary">int256</code> domain and saturates to <code className="text-primary">0</code> at the bound above.</> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

int256  x = 1e18;                 // one standard deviation
uint256 y = Math.stdNormPDF(x);   // y ≈ 0.24197072e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
