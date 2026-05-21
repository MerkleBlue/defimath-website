import { FunctionTable } from "./FunctionTable";

export const Statistics = () => {
  return (
    <div id="statistics" className="md:scroll-m-[180px] scroll-m-28 pb-10">
      <h3 className="text-2xl font-semibold mt-8 text-white">Statistics</h3>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Portfolio and performance analytics on-chain. Array-based functions
        scale with input size — gas figures below are for the listed size.
      </p>
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
