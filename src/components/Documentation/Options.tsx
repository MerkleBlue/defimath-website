import { FunctionTable } from "./FunctionTable";

export const Options = () => {
  return (
    <div className="pb-10">
      <h2 id="options" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Options</h2>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Black-Scholes pricing for European options, the full Greek set, and
        an iterative implied-volatility solver. Greek functions return both
        call and put values in a single call.
      </p>
      <h3 id="functions" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Functions</h3>
      <FunctionTable
        rows={[
          { name: "callOptionPrice", gas: "2,876", description: "European call price (Black-Scholes)" },
          { name: "putOptionPrice", gas: "2,887", description: "European put price (Black-Scholes)" },
          { name: "delta", gas: "1,797", description: "First derivative w.r.t. spot — returns (Δcall, Δput)" },
          { name: "gamma", gas: "1,499", description: "Second derivative w.r.t. spot — returns (Γcall, Γput)" },
          { name: "theta", gas: "3,441", description: "Time decay, per day — returns (Θcall, Θput)" },
          { name: "vega", gas: "1,439", description: "Sensitivity per 1% vol — returns (νcall, νput)" },
          { name: "impliedVolatility", gas: "~13,100", description: "IV solver via Newton-Raphson" },
        ]}
      />
      <h3 id="pricing-formula" className="text-xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Pricing formula</h3>
      <p className="text-base font-medium text-muted text-opacity-95">
        d₁ = [ln(S/K) + (r + σ²/2)·T] / (σ√T)
        <br />
        d₂ = d₁ − σ√T
        <br />
        Call = S·Φ(d₁) − K·e<sup>−r·T</sup>·Φ(d₂)
      </p>
    </div>
  );
};
