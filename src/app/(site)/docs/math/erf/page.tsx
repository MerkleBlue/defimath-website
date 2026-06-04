import { Metadata } from "next";
import { FunctionDetail } from "@/components/Documentation/FunctionDetail";

export const metadata: Metadata = {
    title: "erf — Math | DeFiMath docs",
    description: "Solidity error function erf(x) in 18-decimal fixed-point. Gas-optimized at 685 gas, max abs. error 7.4e-15.",
    alternates: { canonical: "/docs/math/erf/" },
};

export default function Page() {
    return (
        <FunctionDetail
            breadcrumb={[
                { label: "Math", href: "/docs/math" },
                { label: "erf" },
            ]}
            module="Math"
            name="erf"
            summary="Computes the Gauss error function erf(x) using West's rational approximation."
            gas="685"
            precision="7.4e-15"
            precisionLabel="Max abs. error"
            signature={`function erf(int256 x) internal pure returns (int256 y)`}
            parameters={[
                { name: "x", type: "int256", description: "Signed input in 18-decimal fixed-point format (1e18 = 1.0)." },
            ]}
            returns={[
                { name: "y", type: "int256", description: "erf(x) in 18-decimal fixed-point format, in range [-1e18, 1e18]." },
            ]}
            behaviorItems={[
                <>Antisymmetric: <code className="text-primary">erf(−x) = −erf(x)</code>. Handled internally — pass any signed <code className="text-primary">int256</code>.</>,
                <>Saturates gracefully (no revert): returns <code className="text-primary">±1e18</code> for <code className="text-primary">|x| ≥ 11.63</code>, where the true value is within <code className="text-primary">1e-58</code> of <code className="text-primary">±1</code>.</>,
                <>Reuses the internal <code className="text-primary">expPositive</code> for the gaussian factor — no separate transcendental machinery.</>,
                <>Pure assembly final block; no external calls or storage.</>,
            ]}
            howItWorks={(
                <>
                    <p>
                        The error function <code className="text-primary">erf(x) = (2/√π) · ∫₀ˣ e^(−t²) dt</code> has no closed form, so DeFiMath uses <a href="https://s2.smu.edu/~aleskovs/emis/sqc2/accuratecumnorm.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline">West's rational approximation</a> — the same machinery <a href="/docs/math/stdnormcdf" className="text-primary underline">stdNormCDF</a> uses, with a single substitution to map between domains. The trick is the change of variable <code className="text-primary">t = x · √2</code>, which expresses <code className="text-primary">erf</code> in the gaussian-integral form West's paper was designed for:
                    </p>
                    <pre>{`erf(x) = 1 − 2 · R(t) · e^(−t²/2),   where R(t) = num(t)/denom(t)`}</pre>
                    <p>
                        <code className="text-primary">R(t)</code> is a ratio of seventh-degree polynomials. Both numerator and denominator are evaluated in nested form — powers up to <code className="text-primary">t⁴</code> precomputed once, then a single multiply-add pass — so the whole rational reduces to a handful of multiplications. The exponential <code className="text-primary">e^(−t²/2)</code> reuses our internal <code className="text-primary">expPositive</code>, which keeps the gas budget low and the error bound consistent with the rest of the library.
                    </p>
                    <p>
                        For <code className="text-primary">x &lt; 0</code> we exploit <code className="text-primary">erf(−x) = −erf(x)</code>: compute the positive branch and negate. For <code className="text-primary">|x| ≥ 11.63</code> the true value is within <code className="text-primary">1e-58</code> of <code className="text-primary">±1</code> — far below 1e-18 precision — so the function saturates to <code className="text-primary">±1e18</code> and skips the kernel entirely.
                    </p>
                    <p>
                        The hot path closes with a five-instruction assembly block that fuses the reciprocal, multiply, divide, subtract-from-half, and double into a tight sequence. Result: ~685 gas at max abs. error <code className="text-primary">7.4e-15</code>.
                    </p>
                </>
            )}
            example={`import "defimath-lib/contracts/math/Math.sol";

int256 x = 1e18;             // x = 1.0
int256 y = DeFiMath.erf(x);  // y ≈ 0.84270079e18`}
            parentSectionHref="/docs/math"
            parentSectionLabel="Back to Math overview"
        />
    );
}
