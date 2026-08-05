import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";
import { DocPageNav } from "./DocPageNav";

const BLACK76_EXAMPLE = `import "defimath-lib/contracts/derivatives/Black76.sol";

uint256 callPx = Black76.call(future, strike, timeToExp, vol, rate);
uint256 putPx  = Black76.put (future, strike, timeToExp, vol, rate);

// delta and theta return (call, put) tuples.
(int128 dC, int128 dP) = Black76.delta(future, strike, timeToExp, vol, rate);

// gamma and vega return a single value (equal for call and put under put-call parity).
uint256 g = Black76.gamma(future, strike, timeToExp, vol, rate);`;

export const Black76 = async () => {
  return (
    <div className="pb-10">
      <h1 id="black76" className="text-40 md:text-44 lg:text-54 font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Black-76</h1>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Black-76 pricing for European options on a <span className="text-white font-semibold">future</span>, the full
        Greek set, and an iterative implied-volatility solver. Prices dated futures options (a fixed expiry) — not perpetuals.
      </p>
      <p className="text-sm font-medium text-muted text-opacity-60 mt-3">
        Contract:{" "}
        <a
          href="https://github.com/MerkleBlue/defimath/blob/master/contracts/derivatives/Black76.sol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Black76.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "call", gas: "2,552", description: "European call price (Black-76)", href: "/docs/black-76/call/" },
          { name: "put", gas: "2,565", description: "European put price (Black-76)", href: "/docs/black-76/put/" },
          { name: "delta", gas: "1,915", description: "First derivative w.r.t. future — returns (Δcall, Δput)", href: "/docs/black-76/delta/" },
          { name: "gamma", gas: "1,704", description: "Second derivative w.r.t. future (Γcall = Γput under put-call parity)", href: "/docs/black-76/gamma/" },
          { name: "theta", gas: "3,255", description: "Time decay, per day — returns (Θcall, Θput)", href: "/docs/black-76/theta/" },
          { name: "vega", gas: "1,659", description: "Sensitivity per 1% vol (νcall = νput under put-call parity)", href: "/docs/black-76/vega/" },
          { name: "impliedVolatility", gas: "11,760 / 11,802", description: "IV solver via Newton-Raphson (call / put)", href: "/docs/black-76/impliedvolatility/" },
        ]}
      />
      <InstallCommand className="mt-6" />

      <h3 id="conventions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Conventions</h3>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li><code className="text-primary">future</code>, <code className="text-primary">strike</code> — <code className="text-primary">uint128</code>, 18-decimal fixed-point (<code className="text-primary">1e18 = 1.0</code>). <code className="text-primary">future</code> is the forward/futures price of the underlying (what <a href="/docs/futures/futureprice/" className="text-primary underline">Futures.futurePrice</a> computes).</li>
        <li><code className="text-primary">timeToExp</code> — <code className="text-primary">uint32</code>, seconds to expiration.</li>
        <li><code className="text-primary">volatility</code> — <code className="text-primary">uint64</code>, annualized vol as 18-decimal fixed-point (e.g. 50% → <code className="text-primary">5e17</code>).</li>
        <li><code className="text-primary">rate</code> — <code className="text-primary">uint64</code>, annualized risk-free rate as 18-decimal fixed-point (the discount rate only — the future already embeds the cost of carry).</li>
        <li>All functions are <code className="text-primary">internal pure</code>.</li>
      </ul>

      <h3 id="quick-example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Quick example</h3>
      <CodeBlock code={BLACK76_EXAMPLE} />

      <h3 id="important-notes" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Important notes</h3>
      <ul className="list-disc list-inside space-y-3 text-base font-medium text-muted text-opacity-95">
        <li>
          <span className="text-white font-semibold">Prices options on a future, not spot.</span>{" "}
          In Black-76, <code className="text-primary">d₁</code> carries no rate term and the whole payoff is discounted by <code className="text-primary">e<sup>−r·T</sup></code>, since the future already embeds the cost of carry. Equivalently, <code className="text-primary">Black-76 = e<sup>−r·T</sup> · Black-Scholes(spot = F, rate = 0)</code>. For pricing on a spot underlying, use the <a href="/docs/black-scholes/" className="text-primary underline">Black-Scholes module</a>.
        </li>
        <li>
          <span className="text-white font-semibold">Dated futures, not perpetuals.</span>{" "}
          The model prices European options with a fixed expiry <code className="text-primary">τ</code> — i.e. options on a dated future. It is not a perpetual-swap pricer.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">delta</code> and <code className="text-primary">theta</code> return tuples; <code className="text-primary">gamma</code> and <code className="text-primary">vega</code> return scalars.</span>{" "}
          For <code className="text-primary">delta</code> / <code className="text-primary">theta</code>, a single normal-CDF evaluation is amortized across both call and put. <code className="text-primary">gamma</code> and <code className="text-primary">vega</code> are identical for call and put under put-call parity, so they return a single value.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">theta</code> is per day, <code className="text-primary">vega</code> per 1% vol change.</span>{" "}
          <code className="text-primary">theta</code> is the price change for a one-day decrease in time to expiration; <code className="text-primary">vega</code> is the change for a 1-percentage-point move in volatility (Δσ = 0.01).
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">impliedVolatility</code> requires market price within no-arb band.</span>{" "}
          For a call the market price must lie within <code className="text-primary">[max(e<sup>−r·T</sup>(F − K), 0), e<sup>−r·T</sup>F]</code> (analogous for puts — both legs are discounted), otherwise the solver reverts. Typical convergence is 4–6 Newton-Raphson iterations.
        </li>
      </ul>

      <h3 id="testing" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Testing</h3>
      <p className="text-base font-medium text-muted text-opacity-95">
        <span className="text-white font-semibold">Hardhat correctness layer.</span>{" "}
        100 tests across 7 function groups (call, put, delta, gamma, theta, vega, impliedVolatility). Validated against the <code className="text-primary">black-scholes</code> and <code className="text-primary">greeks</code> npm packages via the exact <code className="text-primary">Black-76 = e<sup>−r·T</sup> · Black-Scholes(F, rate = 0)</code> identity, over 5×5×3×3 strike/time/vol/rate matrices. &quot;Limits and near limit values&quot; sweeps at all four parameter boundaries.
      </p>
      <p className="text-base font-medium text-muted text-opacity-95 mt-4">
        <span className="text-white font-semibold">Foundry property-fuzz layer.</span>{" "}
        16 mathematical properties × 32,000 random runs each = <span className="text-white font-semibold">512,000 random executions per CI run</span>.
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
              <td className="py-2 px-4 text-muted text-opacity-95">call ↑ in future, put ↓ in future, call ↑ in vol, put ↑ in vol</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Identities</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">4</td>
              <td className="py-2 px-4 text-muted text-opacity-95">put-call parity (<code className="text-primary">C − P = e<sup>−rT</sup>(F − K)</code>), <code className="text-primary">δ<sub>call</sub> − δ<sub>put</sub> = e<sup>−rT</sup></code>, delta sign &amp; parity at expiry, <code className="text-primary">θ<sub>call</sub> − θ<sub>put</sub> = r·e<sup>−rT</sup>(F − K)/365</code></td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Output bounds</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">6</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">C ≤ e<sup>−rT</sup>F</code>, <code className="text-primary">P ≤ K·e<sup>−rT</sup></code>, <code className="text-primary">δ<sub>call</sub> ∈ [0, e<sup>−rT</sup>]</code>, <code className="text-primary">δ<sub>put</sub> ∈ [−e<sup>−rT</sup>, 0]</code>, <code className="text-primary">γ ≥ 0</code>, <code className="text-primary">vega ≥ 0</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted text-opacity-60 mt-3">
        Sources: <a href="https://github.com/MerkleBlue/defimath/blob/master/test/hardhat/Black76.test.mjs" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/hardhat/Black76.test.mjs</a> · <a href="https://github.com/MerkleBlue/defimath/blob/master/test/foundry/Black76.t.sol" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/foundry/Black76.t.sol</a>
      </p>

      <DocPageNav />
    </div>
  );
};
