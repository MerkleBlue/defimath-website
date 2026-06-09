import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";

const STATS_EXAMPLE = `import "defimath-lib/contracts/finance/Stats.sol";

// 30 daily closing prices, 18-decimal fixed-point.
uint256[] memory prices = loadPriceSeries();

// Sample mean and std dev of the raw values.
uint256 mu    = DeFiMathStats.mean(prices);
uint256 sigma = DeFiMathStats.stdDev(prices);

// Annualized volatility from log returns (1-day interval).
uint256 vol = DeFiMathStats.historicalVolatility(prices, 1 days);

// Sharpe ratio at a 2% risk-free rate.
int256 sharpe = DeFiMathStats.sharpeRatio(prices, 1 days, 0.02e18);`;

export const Statistics = async () => {
  return (
    <div className="pb-10">
      <h1 id="statistics" className="text-40 md:text-44 lg:text-54 font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Statistics</h1>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Portfolio and performance analytics on-chain — mean, std dev, historical
        volatility, Sharpe, max drawdown, VaR, CVaR. Array-based functions
        scale linearly with input size; gas figures below are quoted at{" "}
        <code className="text-primary">N = 30</code>.
      </p>
      <p className="text-sm font-medium text-muted text-opacity-60 mt-3">
        Contract:{" "}
        <a
          href="https://github.com/MerkleBlue/defimath/blob/master/contracts/finance/Stats.sol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Stats.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "geometricMean", gas: "330", description: "sqrt(a · b) — Uniswap V2 invariant" },
          { name: "mean", gas: "6,980 @ 30", description: "Arithmetic mean" },
          { name: "stdDev", gas: "15,298 @ 30", description: "Sample standard deviation (Bessel-corrected)" },
          { name: "weightedAverage", gas: "15,687 @ 30", description: "Σ(v · w) / Σ(w)" },
          { name: "historicalVolatility", gas: "25,915 @ 30", description: "Annualized volatility from log returns" },
          { name: "sharpeRatio", gas: "26,053 @ 30", description: "Risk-adjusted return" },
          { name: "maxDrawdown", gas: "15,470 @ 30", description: "Peak-to-trough decline" },
          { name: "valueAtRisk", gas: "34,531 @ 30", description: "Historical VaR (NumPy-compatible)" },
          { name: "conditionalValueAtRisk", gas: "31,889 @ 30", description: "Expected shortfall (left-tail mean)" },
        ]}
      />
      <InstallCommand className="mt-6" />

      <h3 id="conventions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Conventions</h3>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li>Array inputs are <code className="text-primary">uint256[] calldata</code>, 18-decimal fixed-point. Each element must fit within <code className="text-primary">MAX_VALUE</code>.</li>
        <li><code className="text-primary">prices</code> arrays are oldest-first; returns are derived internally as <code className="text-primary">ln(p<sub>i</sub> / p<sub>i−1</sub>)</code>.</li>
        <li><code className="text-primary">intervalSec</code> — <code className="text-primary">uint32</code>, sampling interval in seconds (e.g. <code className="text-primary">1 days</code> for daily prices). Used to annualize.</li>
        <li><code className="text-primary">riskFreeRateAnnual</code> — <code className="text-primary">uint64</code>, annualized rate, 18-decimal fixed-point.</li>
        <li><code className="text-primary">confidence</code> — <code className="text-primary">uint64</code>, the α level for VaR / CVaR, in <code className="text-primary">(0, 1)</code> exclusive (e.g. <code className="text-primary">0.95e18</code> for 95%).</li>
        <li>Return type mirrors sign: <code className="text-primary">int256</code> for quantities that can be negative (Sharpe, VaR, CVaR); <code className="text-primary">uint256</code> otherwise.</li>
        <li>All functions are <code className="text-primary">internal pure</code>.</li>
      </ul>

      <h3 id="quick-example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Quick example</h3>
      <CodeBlock code={STATS_EXAMPLE} />

      <h3 id="important-notes" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Important notes</h3>
      <ul className="list-disc list-inside space-y-3 text-base font-medium text-muted text-opacity-95">
        <li>
          <span className="text-white font-semibold">Gas scales linearly with array size.</span>{" "}
          The figures in the table are at <code className="text-primary">N = 30</code> (a typical month of daily prices). Doubling the array roughly doubles the gas; arrays larger than <code className="text-primary">MAX_ARRAY_LENGTH</code> (1024) revert.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">historicalVolatility</code> annualizes internally.</span>{" "}
          Pass raw prices and the sampling interval in seconds — the function computes log returns, takes the sample std dev, and scales by <code className="text-primary">√(SECONDS_IN_YEAR / interval)</code>. Don&apos;t pre-annualize.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">sharpeRatio</code> is annualized.</span>{" "}
          The function uses annualized return minus annualized risk-free rate over annualized volatility. Pass the risk-free rate as a yearly value regardless of price-series interval.
        </li>
        <li>
          <span className="text-white font-semibold">VaR vs. CVaR.</span>{" "}
          <code className="text-primary">valueAtRisk</code> returns the return threshold at the chosen confidence — a probability statement. <code className="text-primary">conditionalValueAtRisk</code> returns the <em>expected</em> return conditional on being beyond that threshold (the left-tail mean). CVaR ≤ VaR (more conservative).
        </li>
        <li>
          <span className="text-white font-semibold">VaR uses NumPy-compatible linear interpolation.</span>{" "}
          Matches <code className="text-primary">numpy.quantile(..., method=&quot;linear&quot;)</code> and <code className="text-primary">simple-statistics.quantile</code>. Useful when reconciling on-chain risk numbers with off-chain notebooks.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">stdDev</code> is sample (Bessel-corrected).</span>{" "}
          Divides by <code className="text-primary">n − 1</code>, not <code className="text-primary">n</code>. Matches <code className="text-primary">numpy.std(..., ddof=1)</code>.
        </li>
      </ul>

      <h3 id="limits-and-errors" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Limits &amp; errors</h3>
      <div className="rounded-md border border-dark_border border-opacity-60 overflow-x-auto mb-6">
        <table className="w-full text-base">
          <thead>
            <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
              <th className="py-3 px-4 font-medium whitespace-nowrap">Constant</th>
              <th className="py-3 px-4 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">MAX_VALUE</td>
              <td className="py-2 px-4 text-muted text-opacity-95">1e15 (largest allowed value per array element)</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">MAX_ARRAY_LENGTH</td>
              <td className="py-2 px-4 text-muted text-opacity-95">1024 (gas-bomb guard on array inputs)</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">MAX_RATE</td>
              <td className="py-2 px-4 text-muted text-opacity-95">400% annual (<code className="text-primary">4e18</code>)</td>
            </tr>
          </tbody>
        </table>
      </div>
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
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">ArrayLengthMismatchError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">weightedAverage</code> when values[] and weights[] differ in length</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">ArrayLengthLowerBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95">Array shorter than the minimum required by the function</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">ArrayLengthUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95">Array exceeds <code className="text-primary">MAX_ARRAY_LENGTH</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">ValueUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95">Any element exceeds <code className="text-primary">MAX_VALUE</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">WeightSumZeroError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">weightedAverage</code> when Σweights == 0</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">PriceLowerBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95">Any price is 0 (can&apos;t take log of zero)</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">IntervalLowerBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">historicalVolatility</code> / <code className="text-primary">sharpeRatio</code> when <code className="text-primary">intervalSec == 0</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">RateUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">sharpeRatio</code> when <code className="text-primary">riskFreeRateAnnual ≥ MAX_RATE</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">VolatilityZeroError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">sharpeRatio</code> when sample std dev is zero (undefined)</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">ConfidenceOutOfRangeError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">valueAtRisk</code> / <code className="text-primary">conditionalValueAtRisk</code> when confidence ∉ (0, 1)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
