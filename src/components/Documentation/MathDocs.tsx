import { FunctionTable } from "./FunctionTable";

export const MathDocs = () => {
  return (
    <div id="math" className="md:scroll-m-[180px] scroll-m-28 pb-10">
      <h3 className="text-2xl font-semibold mt-8 text-white">Math primitives</h3>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Low-level fixed-point primitives in 18-decimal format (
        <code className="text-primary">1e18 = 1.0</code>). All pure,
        gas-efficient, and validated to sub-1e-12 absolute error against
        reference libraries.
      </p>
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
      <div className="mt-6 py-4 px-4 rounded-md bg-dark_grey">
        <p className="text-sm text-gray-400">using DeFiMath for uint256;</p>
        <p className="text-sm text-gray-400 mt-4">uint256 lnX = x.ln();</p>
        <p className="text-sm text-gray-400 mt-2">uint256 root = x.sqrt();</p>
      </div>
    </div>
  );
};
