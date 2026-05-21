import { FunctionTable } from "./FunctionTable";

export const Futures = () => {
  return (
    <div className="pb-10">
      <h2 id="futures" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Futures</h2>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        Futures pricing using continuous compounding.
      </p>
      <FunctionTable
        rows={[
          { name: "futurePrice", gas: "~400", description: "spot · e^(r·t)" },
        ]}
      />
    </div>
  );
};
