import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";
import { DocPageNav } from "./DocPageNav";

const MATH_EXAMPLE = `import "defimath-lib/contracts/math/Math.sol";

uint256 x    = 2e18;                     // x = 2.0
uint256 root = DeFiMath.sqrt(x);         // root ≈ 1.41421e18
int256  lnX  = DeFiMath.ln(x);           // lnX  ≈ 0.69315e18
uint256 ePow = DeFiMath.exp(int256(x));  // ePow ≈ 7.389e18`;

export const Math = async () => {
  return (
    <div className="pb-10">
      <h1 id="math" className="text-40 md:text-44 lg:text-54 font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Math</h1>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Low-level fixed-point primitives in 18-decimal format (
        <code className="text-primary">1e18 = 1.0</code>). All pure,
        gas-efficient, and validated to sub-1e-12 relative error against
        reference libraries.
      </p>
      <p className="text-sm font-medium text-muted text-opacity-60 mt-3">
        Contract:{" "}
        <a
          href="https://github.com/MerkleBlue/defimath/blob/master/contracts/math/Math.sol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Math.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "exp", gas: "331", description: "Exponential function e^x", href: "/docs/math/exp" },
          { name: "expm1", gas: "438", description: "e^x − 1 (precision-preserving for small x)", href: "/docs/math/expm1" },
          { name: "ln", gas: "375", description: "Natural logarithm", href: "/docs/math/ln" },
          { name: "log1p", gas: "500", description: "ln(1 + x) (precision-preserving for small x)", href: "/docs/math/log1p" },
          { name: "log2", gas: "391", description: "Base-2 logarithm", href: "/docs/math/log2" },
          { name: "log10", gas: "391", description: "Base-10 logarithm", href: "/docs/math/log10" },
          { name: "pow", gas: "748", description: "Power function x^a", href: "/docs/math/pow" },
          { name: "sqrt", gas: "245", description: "Square root", href: "/docs/math/sqrt" },
          { name: "cbrt", gas: "368", description: "Cube root", href: "/docs/math/cbrt" },
          { name: "sqrtTime", gas: "184", description: "Specialized sqrt of time in years for Black-Scholes — no input validation" },
          { name: "stdNormCDF", gas: "660", description: "Standard normal CDF Φ(x)", href: "/docs/math/stdnormcdf" },
          { name: "erf", gas: "685", description: "Error function", href: "/docs/math/erf" },
          { name: "mulDiv", gas: "155", description: "(a · b) / d with full 512-bit intermediate precision" },
          { name: "mul", gas: "130", description: "(a · b) / 1e18 — fixed-point multiply with denominator baked in" },
          { name: "abs", gas: "17", description: "Branchless |int256| (handles int256.min cleanly)" },
          { name: "min", gas: "23", description: "Branchless minimum of two uint256" },
          { name: "max", gas: "23", description: "Branchless maximum of two uint256" },
          { name: "clamp", gas: "78", description: "Clamp x into [lo, hi] (composed max then min)" },
          { name: "avg", gas: "21", description: "Overflow-safe (a + b) / 2 via (a & b) + ((a ^ b) >> 1)" },
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
        <li>
          <span className="text-white font-semibold"><code className="text-primary">sqrtTime</code> is specialized, not general-purpose.</span>{" "}
          It expects <code className="text-primary">x</code> as time in years (<code className="text-primary">1e18 = 1 year</code>) and performs <span className="text-white font-semibold">no input validation</span>. It is built for Black-Scholes option pricing — where the caller has already bounded <code className="text-primary">x</code> — and is precision-tuned for <code className="text-primary">[1s, 32y]</code>. For a general fixed-point square root use <code className="text-primary">sqrt</code> instead.
        </li>
      </ul>

      <p className="text-base font-medium text-muted text-opacity-95 mt-6">
        Every function reverts on out-of-bounds inputs with a named error — see the per-function pages for limits and error specifics.
      </p>

      <h3 id="testing" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Testing</h3>
      <p className="text-base font-medium text-muted text-opacity-95">
        <span className="text-white font-semibold">Hardhat correctness layer.</span>{" "}
        202 tests across 20 function groups. Each function is validated against the corresponding JavaScript reference (<code className="text-primary">Math.exp</code>, <code className="text-primary">Math.log</code>, <code className="text-primary">Math.sqrt</code>, <code className="text-primary">math-erf</code>) over ~200-sample sweeps that cover the full operational domain. Per-function precision thresholds match the table above. Limit tests pin behavior at min and max valid inputs; failure tests cover every documented revert path.
      </p>
      <p className="text-base font-medium text-muted text-opacity-95 mt-4">
        <span className="text-white font-semibold">Foundry property-fuzz layer.</span>{" "}
        28 mathematical properties, each fuzzed with 32,000 random inputs per CI run (= <span className="text-white font-semibold">896,000 random executions</span>). Counterexamples are automatically shrunk on failure.
      </p>
      <div className="rounded-md border border-dark_border border-opacity-60 overflow-x-auto mt-4">
        <table className="w-full text-base">
          <thead>
            <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
              <th className="py-3 px-4 font-medium whitespace-nowrap">Category</th>
              <th className="py-3 px-4 font-medium text-right">Count</th>
              <th className="py-3 px-4 font-medium">What they check</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Round-trips</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">5</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">ln(exp(x)) ≈ x</code>, <code className="text-primary">exp(ln(x)) ≈ x</code>, <code className="text-primary">sqrt²(x) ≈ x</code>, <code className="text-primary">cbrt³(x) ≈ x</code>, <code className="text-primary">exp(x)·exp(-x) ≈ 1</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Monotonicity</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">5</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">exp</code>, <code className="text-primary">ln</code>, <code className="text-primary">sqrt</code>, <code className="text-primary">Φ</code>, <code className="text-primary">erf</code> all preserve input ordering</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Identities</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">8</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">expm1 = exp − 1</code>, <code className="text-primary">log1p = ln(1 + x)</code>, pow at exponents 0/1/2, <code className="text-primary">mul = mulDiv(_, _, 1e18)</code>, <code className="text-primary">mulDiv = a·b/d</code>, <code className="text-primary">min + max = a + b</code>, <code className="text-primary">avg = (a + b)/2</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Output bounds</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">6</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">Φ ∈ [0, 1]</code>, <code className="text-primary">erf ∈ [-1, 1]</code>, pow always non-negative, <code className="text-primary">min ≤ max</code>, <code className="text-primary">clamp ∈ [lo, hi]</code>, <code className="text-primary">avg ∈ [min, max]</code></td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Symmetries</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">3</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">Φ(x) + Φ(-x) = 1</code>, <code className="text-primary">erf(-x) = -erf(x)</code>, <code className="text-primary">abs(-x) = abs(x)</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted text-opacity-60 mt-3">
        Sources: <a href="https://github.com/MerkleBlue/defimath/blob/master/test/hardhat/Math.test.mjs" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/Math.test.mjs</a> · <a href="https://github.com/MerkleBlue/defimath/blob/master/test/foundry/Math.t.sol" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/foundry/Math.t.sol</a>
      </p>
      <DocPageNav />
    </div>
  );
};
