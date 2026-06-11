import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";

const OPTIONS_EXAMPLE = `import "defimath-lib/contracts/derivatives/Options.sol";

uint256 callPx = DeFiMathOptions.callOptionPrice(spot, strike, timeToExp, vol, rate);
uint256 putPx  = DeFiMathOptions.putOptionPrice (spot, strike, timeToExp, vol, rate);

// delta and theta return (call, put) tuples.
(int128 dC, int128 dP) = DeFiMathOptions.delta(spot, strike, timeToExp, vol, rate);

// gamma and vega return a single value (equal for call and put under put-call parity).
uint256 g = DeFiMathOptions.gamma(spot, strike, timeToExp, vol, rate);`;

export const Options = async () => {
  return (
    <div className="pb-10">
      <h1 id="options" className="text-40 md:text-44 lg:text-54 font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Options</h1>
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
          className="text-primary underline"
        >
          Options.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "callOptionPrice", gas: "2,729", description: "European call price (Black-Scholes)", href: "/docs/options/calloptionprice" },
          { name: "putOptionPrice", gas: "2,739", description: "European put price (Black-Scholes)", href: "/docs/options/putoptionprice" },
          { name: "delta", gas: "1,724", description: "First derivative w.r.t. spot — returns (Δcall, Δput)" },
          { name: "gamma", gas: "1,499", description: "Second derivative w.r.t. spot (Γcall = Γput under put-call parity)" },
          { name: "theta", gas: "3,293", description: "Time decay, per day — returns (Θcall, Θput)" },
          { name: "vega", gas: "1,439", description: "Sensitivity per 1% vol (νcall = νput under put-call parity)" },
          { name: "impliedVolatility", gas: "~12,370", description: "IV solver via Newton-Raphson" },
        ]}
      />
      <InstallCommand className="mt-6" />

      <h3 id="conventions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Conventions</h3>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li><code className="text-primary">spot</code>, <code className="text-primary">strike</code> — <code className="text-primary">uint128</code>, 18-decimal fixed-point (<code className="text-primary">1e18 = 1.0</code>).</li>
        <li><code className="text-primary">timeToExp</code> — <code className="text-primary">uint32</code>, seconds to expiration.</li>
        <li><code className="text-primary">volatility</code> — <code className="text-primary">uint64</code>, annualized vol as 18-decimal fixed-point (e.g. 50% → <code className="text-primary">5e17</code>).</li>
        <li><code className="text-primary">rate</code> — <code className="text-primary">uint64</code>, annualized risk-free rate as 18-decimal fixed-point.</li>
        <li>All functions are <code className="text-primary">internal pure</code>.</li>
      </ul>

      <h3 id="quick-example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Quick example</h3>
      <CodeBlock code={OPTIONS_EXAMPLE} />

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

      <h3 id="testing" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Testing</h3>
      <p className="text-base font-medium text-muted text-opacity-95">
        <span className="text-white font-semibold">Hardhat correctness layer.</span>{" "}
        100 tests across 7 function groups (call, put, delta, gamma, theta, vega, impliedVolatility). Validated against the <code className="text-primary">black-scholes</code> and <code className="text-primary">greeks</code> npm packages over 5×5×3×3 strike/time/vol/rate matrices. &quot;Limits and near limit values&quot; sweeps at all four parameter boundaries (low/high strike, short/long expiry, near-zero/near-max vol and rate).
      </p>
      <p className="text-base font-medium text-muted text-opacity-95 mt-4">
        <span className="text-white font-semibold">Foundry property-fuzz layer.</span>{" "}
        15 mathematical properties × 10,000 random runs each = <span className="text-white font-semibold">150,000 random executions per CI run</span>.
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
              <td className="py-2 px-4 text-right text-muted text-opacity-95">2</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">IV(callPrice(σ)) ≈ σ</code>, <code className="text-primary">IV(putPrice(σ)) ≈ σ</code> — Newton-Raphson solver round-trips</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Monotonicity</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">4</td>
              <td className="py-2 px-4 text-muted text-opacity-95">call ↑ in spot, put ↓ in spot, call ↑ in vol, put ↑ in vol</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Identities</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">3</td>
              <td className="py-2 px-4 text-muted text-opacity-95">put-call parity (<code className="text-primary">C − P = S − K·e<sup>−rT</sup></code>), <code className="text-primary">δ<sub>call</sub> − δ<sub>put</sub> = 1</code>, <code className="text-primary">θ<sub>call</sub> − θ<sub>put</sub> = −r·K·e<sup>−rT</sup>/365</code></td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Output bounds</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">6</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">C ≤ S</code>, <code className="text-primary">P ≤ K·e<sup>−rT</sup></code>, <code className="text-primary">δ<sub>call</sub> ∈ [0, 1]</code>, <code className="text-primary">δ<sub>put</sub> ∈ [-1, 0]</code>, <code className="text-primary">γ ≥ 0</code>, <code className="text-primary">vega ≥ 0</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted text-opacity-60 mt-3">
        Sources: <a href="https://github.com/MerkleBlue/defimath/blob/master/test/Options.test.mjs" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/Options.test.mjs</a> · <a href="https://github.com/MerkleBlue/defimath/blob/master/test/foundry/Options.t.sol" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/foundry/Options.t.sol</a>
      </p>

    </div>
  );
};
