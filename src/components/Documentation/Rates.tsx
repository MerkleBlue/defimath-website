import { FunctionTable } from "./FunctionTable";

export const Rates = () => {
  return (
    <div id="rates" className="md:scroll-m-[180px] scroll-m-28 pb-10">
      <h3 className="text-2xl font-semibold mt-8 text-white">Rates</h3>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Interest rate primitives — compounding, discounting, log returns,
        APR↔APY conversions, and closed-form / iterative yield calculations.
      </p>
      <FunctionTable
        rows={[
          { name: "compoundInterest", gas: "467", description: "Continuous compounding: P · e^(r·t)" },
          { name: "presentValue", gas: "519", description: "Discounting: FV · e^(−r·t)" },
          { name: "logReturn", gas: "591", description: "ln(currentPrice / previousPrice)" },
          { name: "continuousToDiscrete", gas: "509", description: "e^apr − 1 (APR → APY)" },
          { name: "discreteToContinuous", gas: "590", description: "ln(1 + apy) (APY → APR)" },
          { name: "yieldToMaturity", gas: "736", description: "Zero-coupon YTM (closed form)" },
          { name: "internalRateOfReturn", gas: "17k–49k", description: "IRR via Newton-Raphson (scales with cashflow count)" },
        ]}
      />
    </div>
  );
};
