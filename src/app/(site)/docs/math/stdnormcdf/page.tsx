import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "stdNormCDF — Math | DeFiMath docs",
    description: "Solidity standard normal CDF Φ(x) in 18-decimal fixed-point — 660 gas, 6.4e-15 max abs. error. West's rational approximation, same kernel as DeFiMath's erf.",
    alternates: { canonical: "/docs/math/stdnormcdf/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math/" },
                { label: "stdNormCDF" },
            ]}
            module="Math"
            name="stdNormCDF"
            summary="Computes the standard normal cumulative distribution function Φ(x) — the probability that a standard normal random variable is ≤ x."
            gas="660"
            absError="6.4e-15"
            signature={`function stdNormCDF(int256 x) internal pure returns (uint256 y)`}
            parameters={[
                { name: "x", type: "int256", description: "Signed input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "uint256", description: "Φ(x) in 18-decimal fixed-point format, in range [0, 1e18]." },
            ]}
            behaviorItems={[
                <>Symmetric: <code className="text-primary">Φ(−x) = 1 − Φ(x)</code>. Handled internally — pass any signed <code className="text-primary">int256</code>.</>,
                <>Saturates gracefully (no revert): returns <code className="text-primary">1e18</code> for <code className="text-primary">x ≥ 16.447</code> and <code className="text-primary">0</code> for <code className="text-primary">x ≤ −16.447</code>, where the true value is within <code className="text-primary">1e-60</code> of the bound.</>,
                <>Built on the same West's approximation as <a href="/docs/math/erf/" className="text-primary underline">erf</a> — calling <code className="text-primary">stdNormCDF</code> is the same kernel with one substitution.</>,
                <>Pure assembly hot path; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        The standard normal CDF and the error function are the same beast in different coordinates, linked by the textbook identity
                    </p>
                    <pre>{`Φ(x) = (1 + erf(x / √2)) / 2`}</pre>
                    <p>
                        DeFiMath uses <a href="https://s2.smu.edu/~aleskovs/emis/sqc2/accuratecumnorm.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline">West's rational approximation</a>, the same kernel that powers <a href="/docs/math/erf/" className="text-primary underline">erf</a>. West parameterizes the approximation by <code className="text-primary">t = z · √2</code>, where <code className="text-primary">z</code> is the erf argument. Combining the two equations, the standard normal input <code className="text-primary">x</code> maps to <code className="text-primary">t = (x · 1/√2) · √2 = x</code> — the <code className="text-primary">1/√2</code> conversion and West's <code className="text-primary">·√2</code> cancel exactly. So <code className="text-primary">|x|</code> goes directly into the polynomial, no pre-scaling.
                    </p>
                    <p>
                        Each branch writes the result straight to <code className="text-primary">y</code> in assembly. For <code className="text-primary">x ≥ 0</code> the kernel returns <code className="text-primary">res = 1 − Φ(x)</code>, so we emit <code className="text-primary">y = 1e18 − res</code>. For <code className="text-primary">x &lt; 0</code> we exploit <code className="text-primary">Φ(−x) = 1 − Φ(x)</code> — the same <code className="text-primary">res</code> computed at <code className="text-primary">|x|</code> is already <code className="text-primary">Φ(x)</code>, so we emit it directly. No flag variable, no post-processing.
                    </p>
                    <p>
                        Saturation handles the tails: at <code className="text-primary">x = ±16.447</code> the true Φ is within <code className="text-primary">1e-60</code> of <code className="text-primary">0</code> or <code className="text-primary">1</code>, well below 1e-18 representational precision, so the function short-circuits to the boundary and skips the kernel. Net cost on the hot path: ~660 gas — the cheapest on-chain Φ we've measured by a wide margin.
                    </p>
                </>
            )}
            limits={{
                constants: [
                    { name: "STD_NORM_CDF_BOUND", value: <><code className="text-primary">16.447e18</code> — saturation magnitude. At <code className="text-primary">|x| ≥ STD_NORM_CDF_BOUND</code>, <code className="text-primary">Φ(x)</code> is within <code className="text-primary">1e-18</code> of <code className="text-primary">0</code> (negative) or <code className="text-primary">1</code> (positive), so the function short-circuits to the boundary without running the kernel.</> },
                ],
                errors: [
                    { name: "None", trigger: <>Never reverts. Saturates to <code className="text-primary">0</code> or <code className="text-primary">1e18</code> at the bound above.</> },
                ],
            }}
            example={`import "defimath-lib/contracts/math/Math.sol";

int256  x = 1.96e18;                  // the canonical 95% confidence cutoff
uint256 y = DeFiMath.stdNormCDF(x);   // y ≈ 0.97500210e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
