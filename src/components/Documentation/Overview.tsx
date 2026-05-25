export const Overview = () => {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mt-10 mb-3">
        <h1 id="overview" className="text-40 md:text-44 lg:text-54 font-semibold text-white scroll-mt-28 md:scroll-mt-[180px]">Overview</h1>
        <span className="text-sm font-semibold text-darkmode bg-primary rounded px-2.5 py-1">
          v3.0.0
        </span>
      </div>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        DeFiMath is a pure-Solidity library of gas-optimized DeFi math
        primitives — 40+ functions spanning six modules: math, options,
        binary options, futures, rates, and statistics. MIT-licensed, no
        runtime dependencies.
      </p>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Latest version of DeFiMath is{" "}
        <span className="text-white font-semibold">3.0.0</span>.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-5 rounded-md border border-dark_border border-opacity-60">
          <p className="text-primary text-2xl font-semibold">2,876 gas</p>
          <p className="text-sm text-muted text-opacity-60 mt-1">
            Black-Scholes option pricing
          </p>
        </div>
        <div className="p-5 rounded-md border border-dark_border border-opacity-60">
          <p className="text-primary text-2xl font-semibold">&lt; 1e-12</p>
          <p className="text-sm text-muted text-opacity-60 mt-1">
            Max abs. error on options pricing
          </p>
        </div>
        <div className="p-5 rounded-md border border-dark_border border-opacity-60">
          <p className="text-primary text-2xl font-semibold">100%</p>
          <p className="text-sm text-muted text-opacity-60 mt-1">
            Test coverage · Solidity 0.8.35
          </p>
        </div>
        <div className="p-5 rounded-md border border-dark_border border-opacity-60">
          <p className="text-primary text-2xl font-semibold">0</p>
          <p className="text-sm text-muted text-opacity-60 mt-1">
            Runtime dependencies
          </p>
        </div>
      </div>
      <h2 id="whats-inside" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">What&apos;s inside</h2>
      <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
        <li><span className="text-primary">Math</span> — <code className="text-primary">exp</code>, <code className="text-primary">ln</code>, <code className="text-primary">sqrt</code>, <code className="text-primary">pow</code>, <code className="text-primary">stdNormCDF</code>, <code className="text-primary">erf</code> and more.</li>
        <li><span className="text-primary">Options</span> — Black-Scholes pricing, full Greeks (delta, gamma, theta, vega), and an iterative implied-volatility solver.</li>
        <li><span className="text-primary">Binary options</span> — cash-or-nothing call and put pricing with full Greeks.</li>
        <li><span className="text-primary">Futures</span> — continuous-compounding futures price.</li>
        <li><span className="text-primary">Rates</span> — compound interest, present value, log returns, APR↔APY, yield to maturity, IRR.</li>
        <li><span className="text-primary">Statistics</span> — mean, std dev, historical volatility, Sharpe ratio, max drawdown, VaR, CVaR.</li>
      </ul>
    </div>
  );
};
