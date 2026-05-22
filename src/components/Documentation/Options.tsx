import { CopyButton } from "./CopyButton";
import { FunctionTable } from "./FunctionTable";

const OPTIONS_EXAMPLE = `import "defimath-lib/contracts/derivatives/Options.sol";

uint256 callPx = DeFiMathOptions.callOptionPrice(spot, strike, timeToExp, vol, rate);
uint256 putPx  = DeFiMathOptions.putOptionPrice (spot, strike, timeToExp, vol, rate);

// delta and theta return (call, put) tuples.
(int128 dC, int128 dP) = DeFiMathOptions.delta(spot, strike, timeToExp, vol, rate);

// gamma and vega return a single value (equal for call and put under put-call parity).
uint256 g = DeFiMathOptions.gamma(spot, strike, timeToExp, vol, rate);`;

export const Options = () => {
  return (
    <div className="pb-10">
      <h2 id="options" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Options</h2>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Black-Scholes pricing for European options, the full Greek set, and
        an iterative implied-volatility solver.
      </p>
      <p className="text-sm font-medium text-muted text-opacity-60 mt-3">
        Contract:{" "}
        <a
          href="https://github.com/MerkleBlue/defimath/blob/master/contracts/derivatives/Options.sol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Options.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "callOptionPrice", gas: "2,876", description: "European call price (Black-Scholes)" },
          { name: "putOptionPrice", gas: "2,887", description: "European put price (Black-Scholes)" },
          { name: "delta", gas: "1,797", description: "First derivative w.r.t. spot — returns (Δcall, Δput)" },
          { name: "gamma", gas: "1,499", description: "Second derivative w.r.t. spot (Γcall = Γput under put-call parity)" },
          { name: "theta", gas: "3,441", description: "Time decay, per day — returns (Θcall, Θput)" },
          { name: "vega", gas: "1,439", description: "Sensitivity per 1% vol (νcall = νput under put-call parity)" },
          { name: "impliedVolatility", gas: "~13,100", description: "IV solver via Newton-Raphson" },
        ]}
      />

      <h3 id="conventions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Conventions</h3>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li><code className="text-primary">spot</code>, <code className="text-primary">strike</code> — <code className="text-primary">uint128</code>, 18-decimal fixed-point (<code className="text-primary">1e18 = 1.0</code>).</li>
        <li><code className="text-primary">timeToExp</code> — <code className="text-primary">uint32</code>, seconds to expiration.</li>
        <li><code className="text-primary">volatility</code> — <code className="text-primary">uint64</code>, annualized vol as 18-decimal fixed-point (e.g. 50% → <code className="text-primary">5e17</code>).</li>
        <li><code className="text-primary">rate</code> — <code className="text-primary">uint64</code>, annualized risk-free rate as 18-decimal fixed-point.</li>
        <li>All functions are <code className="text-primary">internal pure</code>.</li>
      </ul>

      <h3 id="quick-example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Quick example</h3>
      <pre className="py-4 px-4 rounded-md bg-dark_grey relative overflow-x-auto">
        <code className="text-sm text-gray-400 font-mono whitespace-pre pe-16 block">{OPTIONS_EXAMPLE}</code>
        <CopyButton value={OPTIONS_EXAMPLE} />
      </pre>

      <h3 id="important-notes" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Important notes</h3>
      <ul className="list-disc list-inside space-y-3 text-base font-medium text-muted text-opacity-95">
        <li>
          <span className="text-white font-semibold"><code className="text-primary">delta</code> and <code className="text-primary">theta</code> return tuples; <code className="text-primary">gamma</code> and <code className="text-primary">vega</code> return scalars.</span>{" "}
          For <code className="text-primary">delta</code> / <code className="text-primary">theta</code>, a single normal-CDF evaluation is amortized across both call and put — ~halves gas vs. two separate calls. <code className="text-primary">gamma</code> and <code className="text-primary">vega</code> are identical for call and put under put-call parity, so they return a single value.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">theta</code> is per day.</span>{" "}
          The result is the price change for a one-day decrease in time to expiration, not per-second.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">vega</code> is per 1% vol change.</span>{" "}
          The result is the price change for a 1-percentage-point change in volatility (Δσ = 0.01).
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">impliedVolatility</code> requires market price within no-arb band.</span>{" "}
          The passed market price must lie within <code className="text-primary">[max(S − K·e<sup>−r·T</sup>, 0), S]</code> for calls (analogous for puts), otherwise the solver reverts. Typical convergence is 4–6 Newton-Raphson iterations.
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
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">MIN_SPOT</td>
              <td className="py-2 px-4 text-muted text-opacity-95">1e-6 (smallest allowed spot price)</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">MAX_SPOT</td>
              <td className="py-2 px-4 text-muted text-opacity-95">1e15 (largest allowed spot price)</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">MAX_STSP_RATIO</td>
              <td className="py-2 px-4 text-muted text-opacity-95">5× (strike must be within [spot/5, spot·5])</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">MAX_EXPIRATION</td>
              <td className="py-2 px-4 text-muted text-opacity-95">2 years (63,072,000 seconds)</td>
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
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">SpotLowerBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">spot ≤ MIN_SPOT</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">SpotUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">spot ≥ MAX_SPOT</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">StrikeLowerBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">strike · 5 &lt; spot</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">StrikeUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">spot · 5 &lt; strike</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">TimeToExpiryUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">timeToExp ≥ MAX_EXPIRATION</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">TimeToExpiryLowerBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">impliedVolatility</code> when <code className="text-primary">timeToExp == 0</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">RateUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">rate ≥ MAX_RATE</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">PriceOutOfBoundsError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">impliedVolatility</code> when market price is outside the no-arbitrage band</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">NoConvergenceError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">impliedVolatility</code> when Newton-Raphson fails to converge</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
