import { FunctionTable } from "./FunctionTable";

export const Statistics = () => {
  return (
    <div className="pb-10">
      <h2 id="statistics" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Statistics</h2>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Portfolio and performance analytics on-chain. Array-based functions
        scale with input size — gas figures below are for the listed size.
      </p>
      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "geometricMean", gas: "330", description: "sqrt(a · b) — Uniswap V2 invariant" },
          { name: "mean", gas: "6,980 @ 30", description: "Arithmetic mean" },
          { name: "stdDev", gas: "15,298 @ 30", description: "Sample standard deviation (Bessel-corrected)" },
          { name: "weightedAverage", gas: "15,687 @ 30", description: "Σ(v · w) / Σ(w)" },
          { name: "historicalVolatility", gas: "26,135 @ 30", description: "Annualized volatility from log returns" },
          { name: "sharpeRatio", gas: "26,273 @ 30", description: "Risk-adjusted return" },
          { name: "maxDrawdown", gas: "15,191 @ 30", description: "Peak-to-trough decline" },
          { name: "valueAtRisk", gas: "36,752 @ 30", description: "Historical VaR (NumPy-compatible)" },
          { name: "conditionalValueAtRisk", gas: "32,917 @ 30", description: "Expected shortfall (left-tail mean)" },
        ]}
      />
    </div>
  );
};
