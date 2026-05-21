import { CopyButton } from "./CopyButton";
import { FunctionTable } from "./FunctionTable";

const MATH_EXAMPLE = `using DeFiMath for uint256;

uint256 lnX = x.ln();
uint256 root = x.sqrt();`;

export const Math = () => {
  return (
    <div className="pb-10">
      <h2 id="math" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Math primitives</h2>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Low-level fixed-point primitives in 18-decimal format (
        <code className="text-primary">1e18 = 1.0</code>). All pure,
        gas-efficient, and validated to sub-1e-12 absolute error against
        reference libraries.
      </p>
      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "exp", gas: "333", description: "Exponential function e^x" },
          { name: "expm1", gas: "439", description: "e^x − 1 (precision-preserving for small x)" },
          { name: "ln", gas: "375", description: "Natural logarithm" },
          { name: "log1p", gas: "500", description: "ln(1 + x) (precision-preserving for small x)" },
          { name: "log2", gas: "391", description: "Base-2 logarithm" },
          { name: "log10", gas: "391", description: "Base-10 logarithm" },
          { name: "pow", gas: "750", description: "Power function x^a" },
          { name: "sqrt", gas: "245", description: "Square root" },
          { name: "stdNormCDF", gas: "731", description: "Standard normal CDF Φ(x)" },
          { name: "erf", gas: "685", description: "Error function" },
        ]}
      />
      <h3 id="example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Example</h3>
      <pre className="py-4 px-4 rounded-md bg-dark_grey relative overflow-x-auto">
        <code className="text-sm text-gray-400 font-mono whitespace-pre pe-16 block">{MATH_EXAMPLE}</code>
        <CopyButton value={MATH_EXAMPLE} />
      </pre>
    </div>
  );
};
