import { FunctionTable } from "./FunctionTable";

export const BinaryOptions = () => {
  return (
    <div id="binary" className="md:scroll-m-[180px] scroll-m-28 pb-10">
      <h3 className="text-2xl font-semibold mt-8 text-white">Binary options</h3>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Cash-or-nothing binary options. The call pays 1 if spot {">"} strike at
        expiry, otherwise 0; the put is symmetric. All functions assume a unit
        payout — scale externally for other payouts. Greek functions return
        both call and put values in a single call.
      </p>
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
