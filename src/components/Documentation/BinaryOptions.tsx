import { FunctionTable } from "./FunctionTable";

export const BinaryOptions = () => {
  return (
    <div className="pb-10">
      <h2 id="binary" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Binary options</h2>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Cash-or-nothing binary options. The call pays 1 if spot {">"} strike at
        expiry, otherwise 0; the put is symmetric. All functions assume a unit
        payout — scale externally for other payouts. Greek functions return
        both call and put values in a single call.
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
    </div>
  );
};
