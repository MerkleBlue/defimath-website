import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";

const MATH_EXAMPLE = `import "defimath-lib/contracts/math/Math.sol";

uint256 root = DeFiMath.sqrt(x);
int256  lnX  = DeFiMath.ln(x);
uint256 ePow = DeFiMath.exp(int256(x));`;

export const Math = async () => {
  return (
    <div className="pb-10">
      <h1 id="math" className="text-40 md:text-44 lg:text-54 font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Math</h1>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Low-level fixed-point primitives in 18-decimal format (
        <code className="text-primary">1e18 = 1.0</code>). All pure,
        gas-efficient, and validated to sub-1e-12 absolute error against
        reference libraries.
      </p>
      <p className="text-sm font-medium text-muted text-opacity-60 mt-3">
        Contract:{" "}
        <a
          href="https://github.com/MerkleBlue/defimath/blob/master/contracts/math/Math.sol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Math.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "exp", gas: "333", description: "Exponential function e^x", href: "/docs/math/exp" },
          { name: "expm1", gas: "439", description: "e^x − 1 (precision-preserving for small x)" },
          { name: "ln", gas: "375", description: "Natural logarithm", href: "/docs/math/ln" },
          { name: "log1p", gas: "500", description: "ln(1 + x) (precision-preserving for small x)" },
          { name: "log2", gas: "391", description: "Base-2 logarithm" },
          { name: "log10", gas: "391", description: "Base-10 logarithm" },
          { name: "pow", gas: "750", description: "Power function x^a" },
          { name: "sqrt", gas: "245", description: "Square root" },
          { name: "cbrt", gas: "368", description: "Cube root" },
          { name: "stdNormCDF", gas: "731", description: "Standard normal CDF Φ(x)" },
          { name: "erf", gas: "685", description: "Error function" },
        ]}
      />
      <InstallCommand className="mt-6" />

      <h3 id="conventions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Conventions</h3>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li>All values use <span className="text-white font-semibold">18-decimal fixed-point</span> (<code className="text-primary">1e18 = 1.0</code>).</li>
        <li>Signedness mirrors the math: <code className="text-primary">exp</code> takes <code className="text-primary">int256</code>, returns <code className="text-primary">uint256</code>; <code className="text-primary">ln</code> takes <code className="text-primary">uint256</code>, returns <code className="text-primary">int256</code>.</li>
        <li>All functions are <code className="text-primary">internal pure</code> — no storage access, no external calls.</li>
      </ul>

      <h3 id="quick-example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Quick example</h3>
      <CodeBlock code={MATH_EXAMPLE} />

      <h3 id="important-notes" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Important notes</h3>
      <ul className="list-disc list-inside space-y-3 text-base font-medium text-muted text-opacity-95">
        <li>
          <span className="text-white font-semibold">Use <code className="text-primary">expm1</code> for small x.</span>{" "}
          Computing <code className="text-primary">e<sup>x</sup> − 1</code> via <code className="text-primary">exp(x) - 1e18</code>{" "}
          catastrophically cancels when <code className="text-primary">|x| &lt; 0.01</code>. <code className="text-primary">expm1</code> uses a Taylor series in that range and preserves full 18-digit precision.
        </li>
        <li>
          <span className="text-white font-semibold">Use <code className="text-primary">log1p</code> for small x.</span>{" "}
          Same reason — <code className="text-primary">log1p(x)</code> preserves precision near zero where <code className="text-primary">ln(1 + x)</code> would lose ~15 digits to subtraction.
        </li>
        <li>
          <span className="text-white font-semibold">Negative <code className="text-primary">exp</code> underflows silently to 0.</span>{" "}
          For <code className="text-primary">x &lt; −41.45e18</code>, <code className="text-primary">exp(x)</code> returns <code className="text-primary">0</code> (not a revert) since the true value is below 1e-18 representational precision.
        </li>
        <li>
          <span className="text-white font-semibold">CLZ requires Solidity 0.8.31 + EVM &quot;osaka&quot;.</span>{" "}
          <code className="text-primary">ln</code>, <code className="text-primary">sqrt</code>, <code className="text-primary">cbrt</code>, and <code className="text-primary">sqrtTime</code> emit the new <code className="text-primary">CLZ</code> opcode introduced in Osaka.
        </li>
      </ul>

      <h3 id="limits-and-errors" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Limits &amp; errors</h3>
      <div className="rounded-md border border-dark_border border-opacity-60 overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
              <th className="py-3 px-4 font-medium whitespace-nowrap">Error</th>
              <th className="py-3 px-4 font-medium">Trigger</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">ExpUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">exp(x)</code> when <code className="text-primary">x ≥ 135.305999e18</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">LnLowerBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">ln(0)</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Log1pLowerBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">log1p(x)</code> when <code className="text-primary">x ≤ −1e18</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">SqrtUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">sqrt(x)</code> when <code className="text-primary">x ≥ 2<sup>80</sup></code> (~1.2e24)</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">CbrtUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">cbrt(x)</code> when <code className="text-primary">x ≥ 2<sup>76</sup></code> (~7.6e22)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
