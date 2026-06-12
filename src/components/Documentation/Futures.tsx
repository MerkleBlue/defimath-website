import { CodeBlock } from "../CodeBlock";
import { FunctionTable } from "./FunctionTable";
import { InstallCommand } from "../InstallCommand";

const FUTURES_EXAMPLE = `import "defimath-lib/contracts/derivatives/Futures.sol";

uint256 fwd = DeFiMathFutures.futurePrice(spot, timeToExp, rate);`;

export const Futures = async () => {
  return (
    <div className="pb-10">
      <h1 id="futures" className="text-40 md:text-44 lg:text-54 font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Futures</h1>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Forward-price calculation under continuous compounding. A single
        building block —{" "}
        <code className="text-primary">spot · e<sup>r·t</sup></code> — useful
        for marking futures, computing fair forwards, or as an input to richer
        derivatives.
      </p>
      <p className="text-sm font-medium text-muted text-opacity-60 mt-3">
        Contract:{" "}
        <a
          href="https://github.com/MerkleBlue/defimath/blob/master/contracts/derivatives/Futures.sol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Futures.sol
        </a>
      </p>

      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "futurePrice", gas: "442", description: "Forward price: spot · e^(r·t)" },
        ]}
      />
      <InstallCommand className="mt-6" />

      <h3 id="conventions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Conventions</h3>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li><code className="text-primary">spot</code> — <code className="text-primary">uint128</code>, 18-decimal fixed-point (<code className="text-primary">1e18 = 1.0</code>).</li>
        <li><code className="text-primary">timeToExp</code> — <code className="text-primary">uint32</code>, seconds to contract expiration.</li>
        <li><code className="text-primary">rate</code> — <code className="text-primary">uint64</code>, annualized risk-free rate as 18-decimal fixed-point.</li>
        <li>Returns <code className="text-primary">uint256</code> — futures price in 18-decimal fixed-point.</li>
        <li>The function is <code className="text-primary">internal pure</code>.</li>
      </ul>

      <h3 id="quick-example" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Quick example</h3>
      <CodeBlock code={FUTURES_EXAMPLE} />

      <h3 id="important-notes" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Important notes</h3>
      <ul className="list-disc list-inside space-y-3 text-base font-medium text-muted text-opacity-95">
        <li>
          <span className="text-white font-semibold">Continuous compounding.</span>{" "}
          The model uses <code className="text-primary">F = S · e<sup>r·t</sup></code>. For dividend-paying assets, fold the dividend yield <code className="text-primary">q</code> into the rate as <code className="text-primary">(r − q)</code> at the call site.
        </li>
        <li>
          <span className="text-white font-semibold">No strike — this is a forward, not an option.</span>{" "}
          For option pricing, use the <a href="/docs/options" className="text-primary underline">Options module</a>; for cash-or-nothing digitals, use <a href="/docs/binary" className="text-primary underline">Binary options</a>.
        </li>
        <li>
          <span className="text-white font-semibold">Lowest gas in the library.</span>{" "}
          ~400 gas total — typically cheaper than reading a single storage slot, so feel free to call it inline.
        </li>
      </ul>

      <p className="text-base font-medium text-muted text-opacity-95 mt-6">
        Every function reverts on out-of-bounds inputs with a named error — see the per-function pages for limits and error specifics.
      </p>

      <h3 id="testing" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Testing</h3>
      <p className="text-base font-medium text-muted text-opacity-95">
        <span className="text-white font-semibold">Hardhat correctness layer.</span>{" "}
        13 tests on the single <code className="text-primary">futurePrice</code> function. Behaviour test sweeps 10 time × 20 rate = 200 samples covering <code className="text-primary">t ∈ [0, 1y)</code> and <code className="text-primary">rate ∈ [0, 4)</code> validated against <code className="text-primary">spot · Math.exp(rate · t)</code>. Random test runs 200 log-uniform (spot, t, rate) triples. Limits pin behavior at SPOT_MIN, SPOT_MAX, TIME_MAX, RATE_MAX, and the expired/zero-carry corners.
      </p>
      <p className="text-base font-medium text-muted text-opacity-95 mt-4">
        <span className="text-white font-semibold">Foundry property-fuzz layer.</span>{" "}
        9 mathematical properties × 10,000 random runs each = <span className="text-white font-semibold">90,000 random executions per CI run</span>.
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
              <td className="py-2 px-4 text-right text-muted text-opacity-95">3</td>
              <td className="py-2 px-4 text-muted text-opacity-95">F ↑ in spot, F ↑ in time (rate &gt; 0), F ↑ in rate (time &gt; 0)</td>
            </tr>
            <tr className="border-b border-dark_border border-opacity-20">
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Identities</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">5</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">F(S, 0, r) = S</code>, <code className="text-primary">F(S, t, 0) = S</code>, spot homogeneity (<code className="text-primary">F(2S) = 2·F(S)</code>), <code className="text-primary">F(S, t, r) = S·e<sup>r·t</sup></code>, semigroup composition (<code className="text-primary">F(S, t<sub>1</sub>+t<sub>2</sub>, r) = F(F(S, t<sub>1</sub>, r), t<sub>2</sub>, r)</code>)</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold text-white whitespace-nowrap">Output bounds</td>
              <td className="py-2 px-4 text-right text-muted text-opacity-95">1</td>
              <td className="py-2 px-4 text-muted text-opacity-95"><code className="text-primary">F ≥ S</code> (no arbitrage: rate ≥ 0 means future never below spot)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted text-opacity-60 mt-3">
        Sources: <a href="https://github.com/MerkleBlue/defimath/blob/master/test/hardhat/Futures.test.mjs" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/Futures.test.mjs</a> · <a href="https://github.com/MerkleBlue/defimath/blob/master/test/foundry/Futures.t.sol" target="_blank" rel="noopener noreferrer" className="text-primary underline">test/foundry/Futures.t.sol</a>
      </p>
    </div>
  );
};
