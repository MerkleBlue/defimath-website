import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";
import { DocPageNav } from "./DocPageNav";

const BINARY_EXAMPLE = `import "defimath-lib/contracts/derivatives/Binary.sol";

uint256 binCall = DeFiMathBinary.binaryCallPrice(spot, strike, timeToExp, vol, rate);
uint256 binPut  = DeFiMathBinary.binaryPutPrice (spot, strike, timeToExp, vol, rate);

// All binary Greeks return (call, put) tuples.
(int128 dC, int128 dP) = DeFiMathBinary.binaryDelta(spot, strike, timeToExp, vol, rate);`;

export const BinaryOptions = async () => {
  return (
    <div className="pb-10">
      <h1 id="binary" className="text-40 md:text-44 lg:text-54 font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Binary options</h1>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Cash-or-nothing binary options. The call pays 1 if spot {">"} strike at
        expiry, otherwise 0; the put is symmetric. Greek functions return
        both call and put values in a single call.
      </p>
      <p className="text-sm font-medium text-muted text-opacity-60 mt-3">
        Contract:{" "}
        <a
          href="https://github.com/MerkleBlue/defimath/blob/master/contracts/derivatives/Binary.sol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Binary.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "binaryCallPrice", gas: "2,018", description: "Cash-or-nothing call: e^(−r·τ) · Φ(d₂)" },
          { name: "binaryPutPrice", gas: "2,023", description: "Cash-or-nothing put" },
          { name: "binaryDelta", gas: "1,822", description: "First derivative w.r.t. spot — returns (Δcall, Δput)" },
          { name: "binaryGamma", gas: "1,964", description: "Second derivative w.r.t. spot — returns (Γcall, Γput)" },
          { name: "binaryTheta", gas: "3,350", description: "Time decay, per day — returns (Θcall, Θput)" },
          { name: "binaryVega", gas: "1,910", description: "Sensitivity per 1% vol — returns (νcall, νput)" },
        ]}
      />
      <InstallCommand className="mt-6" />

      <h3 id="conventions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Conventions</h3>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li><code className="text-primary">spot</code>, <code className="text-primary">strike</code> — <code className="text-primary">uint128</code>, 18-decimal fixed-point (<code className="text-primary">1e18 = 1.0</code>).</li>
        <li><code className="text-primary">timeToExp</code> — <code className="text-primary">uint32</code>, seconds to expiration.</li>
        <li><code className="text-primary">volatility</code> — <code className="text-primary">uint64</code>, annualized vol as 18-decimal fixed-point (e.g. 50% → <code className="text-primary">5e17</code>).</li>
        <li><code className="text-primary">rate</code> — <code className="text-primary">uint64</code>, annualized risk-free rate as 18-decimal fixed-point.</li>
        <li><span className="text-white font-semibold">Unit payout.</span> All results assume a payout of 1. Multiply the result externally for an arbitrary payout <code className="text-primary">Q</code>.</li>
        <li>All functions are <code className="text-primary">internal pure</code>.</li>
      </ul>

      <h3 id="quick-example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Quick example</h3>
      <CodeBlock code={BINARY_EXAMPLE} />

      <h3 id="important-notes" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Important notes</h3>
      <ul className="list-disc list-inside space-y-3 text-base font-medium text-muted text-opacity-95">
        <li>
          <span className="text-white font-semibold">All four Greeks return tuples.</span>{" "}
          Unlike vanilla options (where <code className="text-primary">gamma</code> and <code className="text-primary">vega</code> are equal for call and put under put-call parity), binary call and put have different second-order sensitivities — so all of <code className="text-primary">binaryDelta</code>, <code className="text-primary">binaryGamma</code>, <code className="text-primary">binaryTheta</code>, and <code className="text-primary">binaryVega</code> return <code className="text-primary">(call, put)</code>.
        </li>
        <li>
          <span className="text-white font-semibold">Unit payout — scale externally.</span>{" "}
          To price a digital with payout <code className="text-primary">Q</code>, compute the unit-payout price and multiply by <code className="text-primary">Q</code> on the call site.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">binaryTheta</code> is per day.</span>{" "}
          The result is the price change for a one-day decrease in time to expiration.
        </li>
        <li>
          <span className="text-white font-semibold"><code className="text-primary">binaryVega</code> is per 1% vol.</span>{" "}
          The result is the price change for a 1-percentage-point change in volatility.
        </li>
        <li>
          <span className="text-white font-semibold">When to use binary vs. vanilla.</span>{" "}
          Use binaries when the payout is discrete (prediction markets, depeg coverage, threshold hedges). For continuous payoff structures, reach for the <a href="/docs/options/" className="text-primary underline">Options module</a>.
        </li>
      </ul>

      <p className="text-base font-medium text-muted text-opacity-95 mt-6">
        Every function reverts on out-of-bounds inputs with a named error — see the per-function pages for limits and error specifics.
      </p>

      <h3 id="testing" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Testing</h3>
      <p className="text-base font-medium text-muted text-opacity-95">
        <span className="text-white font-semibold">Hardhat correctness layer.</span>{" "}
        109 tests across 6 function groups (binary call, put, delta, gamma, theta, vega). Validated against a JavaScript reference derived from the closed-form cash-or-nothing pricing equations over 5×5×3×3 strike/time/vol/rate matrices. Limits-and-near-limits sweeps probe all four parameter boundaries; failure tests cover every documented revert path.
      </p>
      <p className="text-base font-medium text-muted text-opacity-95 mt-4">
        <span className="text-white font-semibold">Foundry property-fuzz layer.</span>{" "}
        13 mathematical properties × 32,000 random runs each = <span className="text-white font-semibold">416,000 random executions per CI run</span>.
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
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Monotonicity</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">4</td>
              <td className="py-2 px-4 text-muted text-opacity-95">binary call ↑ in spot, put ↓ in spot, call ↓ in strike, put ↑ in strike</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Identities</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">3</td>
              <td className="py-2 px-4 text-muted text-opacity-95">binary put-call parity (<code className="text-primary">BC + BP = e<sup>−rT</sup></code>), <code className="text-primary">δ<sub>call</sub> + δ<sub>put</sub> = 0</code>, <code className="text-primary">θ<sub>call</sub> + θ<sub>put</sub> = r·e<sup>−rT</sup>/365</code></td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Output bounds</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">4</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">BC ∈ [0, 1]</code>, <code className="text-primary">BP ∈ [0, 1]</code>, <code className="text-primary">δ<sub>call</sub> ≥ 0</code>, <code className="text-primary">δ<sub>put</sub> ≤ 0</code></td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Symmetries</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">2</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">γ<sub>call</sub> = −γ<sub>put</sub></code>, <code className="text-primary">ν<sub>call</sub> = −ν<sub>put</sub></code> (unique to binary — BC+BP is constant in spot and vol)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted text-opacity-60 mt-3">
        Sources: <a href="https://github.com/MerkleBlue/defimath/blob/master/test/hardhat/Binary.test.mjs" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/Binary.test.mjs</a> · <a href="https://github.com/MerkleBlue/defimath/blob/master/test/foundry/Binary.t.sol" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/foundry/Binary.t.sol</a>
      </p>
      <DocPageNav />
    </div>
  );
};
