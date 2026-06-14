import Link from "next/link";

const MODULES = [
  { href: "/docs/math", title: "Math", blurb: "Exp, log, sqrt, pow, standard normal CDF, error function, and more." },
  { href: "/docs/options", title: "Options", blurb: "Black-Scholes pricing, full Greeks, and an iterative implied-volatility solver." },
  { href: "/docs/binary", title: "Binary options", blurb: "Cash-or-nothing call and put pricing with full Greeks." },
  { href: "/docs/futures", title: "Futures", blurb: "Continuous-compounding futures price." },
  { href: "/docs/rates", title: "Rates", blurb: "Compound interest, present value, log returns, YTM, IRR." },
  { href: "/docs/statistics", title: "Statistics", blurb: "Mean, std dev, historical volatility, Sharpe, max drawdown, VaR, CVaR." },
];

export const Overview = () => {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mt-10 mb-3">
        <h1 id="introduction" className="text-40 md:text-44 lg:text-54 font-semibold text-white scroll-mt-28 md:scroll-mt-[180px]">Introduction</h1>
        <span className="text-sm font-semibold text-darkmode bg-primary rounded px-2.5 py-1">
          v3.4.0
        </span>
      </div>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        DeFiMath is a pure-Solidity library of gas-optimized 18-decimal
        fixed-point math primitives — 40+ functions spanning six modules:
        math, options, binary options, futures, rates, and statistics.
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
      <p className="text-base font-medium text-muted text-opacity-95 mt-6">
        Full test coverage across Hardhat and Foundry property-based fuzz suites. MIT-licensed, no runtime dependencies.
      </p>
      <h2 id="whats-inside" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">What&apos;s inside</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group p-5 rounded-md border border-dark_border border-opacity-60 hover:border-primary duration-200"
          >
            <h5 className="text-lg font-semibold text-white group-hover:text-primary duration-200">
              {m.title}
            </h5>
            <p className="text-sm font-medium text-muted text-opacity-60 mt-1">
              {m.blurb}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
