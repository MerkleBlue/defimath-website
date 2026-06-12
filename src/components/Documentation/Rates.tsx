import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";
import { DocPageNav } from "./DocPageNav";

const RATES_EXAMPLE = `import "defimath-lib/contracts/finance/Rates.sol";

// Continuous compounding: how much does principal grow in 1 year at 5%?
uint256 fv = DeFiMathRates.compoundInterest(1_000e18, 0.05e18, 365 days);

// Discount a future cashflow back to today.
uint256 pv = DeFiMathRates.presentValue(fv, 0.05e18, 365 days);

// Convert continuous APR (5%) to effective APY.
int256 apy = DeFiMathRates.continuousToDiscrete(int256(0.05e18));`;

export const Rates = async () => {
  return (
    <div className="pb-10">
      <h1 id="rates" className="text-40 md:text-44 lg:text-54 font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Rates</h1>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Interest rate primitives — compounding, discounting, log returns,
        APR↔APY conversions, and closed-form / iterative yield calculations.
        Built on top of DeFiMath&apos;s <code className="text-primary">exp</code>,{" "}
        <code className="text-primary">ln</code>, <code className="text-primary">expm1</code>,
        and <code className="text-primary">log1p</code>.
      </p>
      <p className="text-sm font-medium text-muted text-opacity-60 mt-3">
        Contract:{" "}
        <a
          href="https://github.com/MerkleBlue/defimath/blob/master/contracts/finance/Rates.sol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Rates.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "compoundInterest", gas: "467", description: "Continuous compounding: P · e^(r·t)" },
          { name: "presentValue", gas: "519", description: "Discounting: FV · e^(−r·t)" },
          { name: "logReturn", gas: "600", description: "ln(currentPrice / previousPrice)" },
          { name: "continuousToDiscrete", gas: "508", description: "e^apr − 1 (APR → APY)" },
          { name: "discreteToContinuous", gas: "589", description: "ln(1 + apy) (APY → APR)" },
          { name: "yieldToMaturity", gas: "736", description: "Zero-coupon YTM (closed form)" },
          { name: "internalRateOfReturn", gas: "17k–49k", description: "IRR via Newton-Raphson (scales with cashflow count)" },
        ]}
      />
      <InstallCommand className="mt-6" />

      <h3 id="conventions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Conventions</h3>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li><span className="text-white font-semibold">Continuous compounding throughout.</span> All rate inputs are interpreted as continuous APRs unless the function name says otherwise.</li>
        <li><code className="text-primary">principal</code>, <code className="text-primary">futureValue</code>, <code className="text-primary">price</code> — <code className="text-primary">uint128</code>, 18-decimal fixed-point (<code className="text-primary">1e18 = 1.0</code>).</li>
        <li><code className="text-primary">rate</code>, <code className="text-primary">apr</code>, <code className="text-primary">apy</code> — annualized as 18-decimal fixed-point. APR/APY conversions take <code className="text-primary">int256</code> (signed).</li>
        <li><code className="text-primary">timeInterval</code>, <code className="text-primary">timeToMaturity</code> — <code className="text-primary">uint32</code>, seconds.</li>
        <li><code className="text-primary">internalRateOfReturn</code> takes parallel <code className="text-primary">cashflows[]</code> and <code className="text-primary">times[]</code> arrays plus an initial <code className="text-primary">guess</code> for Newton-Raphson.</li>
        <li>All functions are <code className="text-primary">internal pure</code>.</li>
      </ul>

      <h3 id="quick-example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Quick example</h3>
      <CodeBlock code={RATES_EXAMPLE} />

      <h3 id="important-notes" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Important notes</h3>
      <ul className="list-disc list-inside space-y-3 text-base font-medium text-muted text-opacity-95">
        <li>
          <span className="text-white font-semibold"><code className="text-primary">compoundInterest</code> and <code className="text-primary">presentValue</code> are exact inverses.</span>{" "}
          Round-tripping a value through both reconstructs the original up to the underlying <code className="text-primary">exp</code> precision (~5e-14).
        </li>
        <li>
          <span className="text-white font-semibold">APR ↔ APY both use precision-preserving primitives.</span>{" "}
          <code className="text-primary">continuousToDiscrete</code> uses <code className="text-primary">expm1</code>; <code className="text-primary">discreteToContinuous</code> uses <code className="text-primary">log1p</code>. Safe to call with small rates without precision loss.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">yieldToMaturity</code> is closed-form and cheap; <code className="text-primary">internalRateOfReturn</code> is iterative.</span>{" "}
          Use YTM for zero-coupon bonds (a single <code className="text-primary">ln</code>). Use IRR for arbitrary cashflow schedules — but expect 17k–49k gas depending on cashflow count, and supply a reasonable <code className="text-primary">guess</code> to stay within the iteration budget.
        </li>
        <li>
          <span className="text-white font-semibold">IRR can fail to converge.</span>{" "}
          Pathological cashflow sets (no real IRR, or multiple sign changes) revert with <code className="text-primary">NoConvergenceError</code>. The solver caps at 50 Newton-Raphson iterations.
        </li>
      </ul>

      <p className="text-base font-medium text-muted text-opacity-95 mt-6">
        Every function reverts on out-of-bounds inputs with a named error — see the per-function pages for limits and error specifics.
      </p>

      <h3 id="testing" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Testing</h3>
      <p className="text-base font-medium text-muted text-opacity-95">
        <span className="text-white font-semibold">Hardhat correctness layer.</span>{" "}
        66 tests across 7 function groups (compound interest, present value, log return, continuous↔discrete rate conversions, yield to maturity, internal rate of return). Each scalar function is sweep-validated against an inline JavaScript reference; <code className="text-primary">internalRateOfReturn</code> is validated against a JS Newton-Raphson IRR for 4- and 12-cashflow series with strict-equality gas regression gates.
      </p>
      <p className="text-base font-medium text-muted text-opacity-95 mt-4">
        <span className="text-white font-semibold">Foundry property-fuzz layer.</span>{" "}
        15 mathematical properties × 32,000 random runs each = <span className="text-white font-semibold">480,000 random executions per CI run</span>.
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
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">PV(CI(P, r, t), r, t) ≈ P</code>, <code className="text-primary">CI(PV(FV, r, t), r, t) ≈ FV</code>, APR↔APY round-trip (<code className="text-primary">d2c(c2d(r)) ≈ r</code>), reverse (<code className="text-primary">c2d(d2c(r)) ≈ r</code>), bond YTM round-trip (<code className="text-primary">PV(F, YTM(P, F, t), t) ≈ P</code>)</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Monotonicity</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">4</td>
              <td className="py-2 px-4 text-muted text-opacity-95">CI ↑ in principal, PV ↑ in futureValue, PV ↓ in rate, <code className="text-primary">continuousToDiscrete</code> ↑ in apr</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Identities</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">3</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">CI(P, 0, t) = P</code>, <code className="text-primary">CI(P, r, 0) = P</code>, <code className="text-primary">logReturn(p, p) = 0</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Output bounds</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">2</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">CI ≥ principal</code> (for rate ≥ 0), <code className="text-primary">PV ≤ futureValue</code> (for rate ≥ 0)</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Symmetries</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">1</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">logReturn(p1, p0) = −logReturn(p0, p1)</code> (anti-symmetric in argument order)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted text-opacity-60 mt-3">
        Sources: <a href="https://github.com/MerkleBlue/defimath/blob/master/test/hardhat/Rates.test.mjs" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/Rates.test.mjs</a> · <a href="https://github.com/MerkleBlue/defimath/blob/master/test/foundry/Rates.t.sol" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/foundry/Rates.t.sol</a>
      </p>
      <DocPageNav />
    </div>
  );
};
