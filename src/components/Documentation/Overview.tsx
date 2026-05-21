export const Overview = () => {
  return (
    <div id="overview" className="md:scroll-m-[180px] scroll-m-28 pb-10">
      <h3 className="text-2xl font-semibold mt-4 text-white">Overview</h3>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        DeFiMath is a pure-Solidity library of gas-optimized DeFi math
        primitives — 40+ functions spanning four modules: low-level math,
        derivatives, interest rates, and statistics. MIT-licensed, no runtime
        dependencies.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-5 rounded-md border border-dark_border border-opacity-60">
          <p className="text-primary text-2xl font-semibold">2,876 gas</p>
          <p className="text-sm text-muted text-opacity-60 mt-1">
            Black-Scholes option pricing
          </p>
        </div>
        <div className="p-5 rounded-md border border-dark_border border-opacity-60">
          <p className="text-primary text-2xl font-semibold">100%</p>
          <p className="text-sm text-muted text-opacity-60 mt-1">
            Test coverage · Solidity 0.8.35
          </p>
        </div>
      </div>
      <div className="mt-6 p-6 rounded-md border border-dark_border border-opacity-60">
        <p className="text-white font-medium mb-2">What&apos;s inside</p>
        <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
          <li><span className="text-primary">Math</span> — <code className="text-primary">exp</code>, <code className="text-primary">ln</code>, <code className="text-primary">sqrt</code>, <code className="text-primary">pow</code>, <code className="text-primary">stdNormCDF</code>, <code className="text-primary">erf</code> and more.</li>
          <li><span className="text-primary">Derivatives</span> — Black-Scholes + full Greeks, binary (cash-or-nothing) options, futures pricing, and an iterative IV solver.</li>
          <li><span className="text-primary">Rates</span> — compound interest, present value, log returns, APR↔APY, yield to maturity, IRR.</li>
          <li><span className="text-primary">Statistics</span> — mean, std dev, historical volatility, Sharpe ratio, max drawdown, VaR, CVaR.</li>
        </ul>
      </div>
    </div>
  );
};
