import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";

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
          { name: "binaryCallPrice", gas: "2,092", description: "Cash-or-nothing call: e^(−r·τ) · Φ(d₂)" },
          { name: "binaryPutPrice", gas: "2,097", description: "Cash-or-nothing put" },
          { name: "binaryDelta", gas: "1,825", description: "First derivative w.r.t. spot — returns (Δcall, Δput)" },
          { name: "binaryGamma", gas: "1,967", description: "Second derivative w.r.t. spot — returns (Γcall, Γput)" },
          { name: "binaryTheta", gas: "3,501", description: "Time decay, per day — returns (Θcall, Θput)" },
          { name: "binaryVega", gas: "1,913", description: "Sensitivity per 1% vol — returns (νcall, νput)" },
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
          Use binaries when the payout is discrete (prediction markets, depeg coverage, threshold hedges). For continuous payoff structures, reach for the <a href="/docs/options" className="text-primary underline">Options module</a>.
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
            <tr>
              <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">RateUpperBoundError</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">rate ≥ MAX_RATE</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
