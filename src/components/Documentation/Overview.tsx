import Link from "next/link";

export const Overview = () => {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mt-10 mb-3">
        <h1 id="introduction" className="text-40 md:text-44 lg:text-54 font-semibold text-white scroll-mt-28 md:scroll-mt-[180px]">Introduction</h1>
        <span className="text-sm font-semibold text-darkmode bg-primary rounded px-2.5 py-1">
          v3.3.0
        </span>
      </div>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        DeFiMath is a pure-Solidity library of gas-optimized 18-decimal
        fixed-point math primitives — 40+ functions spanning six modules:
        math, options, binary options, futures, rates, and statistics.
      </p>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Full test coverage across Hardhat and Foundry property-based fuzz suites. MIT-licensed, no runtime dependencies.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-5 rounded-md border border-dark_border border-opacity-60">
          <p className="text-primary text-2xl font-semibold">2,729 gas</p>
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
        <li><Link href="/docs/math" className="text-primary underline font-semibold">Math</Link> — exponential, logarithm, square root, power, standard normal CDF, error function, and more.</li>
        <li><Link href="/docs/options" className="text-primary underline font-semibold">Options</Link> — Black-Scholes pricing, full Greeks (delta, gamma, theta, vega), and an iterative implied-volatility solver.</li>
        <li><Link href="/docs/binary" className="text-primary underline font-semibold">Binary options</Link> — cash-or-nothing call and put pricing with full Greeks.</li>
        <li><Link href="/docs/futures" className="text-primary underline font-semibold">Futures</Link> — continuous-compounding futures price.</li>
        <li><Link href="/docs/rates" className="text-primary underline font-semibold">Rates</Link> — compound interest, present value, log returns, APR↔APY, yield to maturity, IRR.</li>
        <li><Link href="/docs/statistics" className="text-primary underline font-semibold">Statistics</Link> — mean, std dev, historical volatility, Sharpe ratio, max drawdown, VaR, CVaR.</li>
      </ul>
    </div>
  );
};
