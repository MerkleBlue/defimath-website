import { FunctionTable } from "./FunctionTable";

export const Futures = () => {
  return (
    <div id="futures" className="md:scroll-m-[180px] scroll-m-28 pb-10">
      <h3 className="text-2xl font-semibold mt-8 text-white">Futures</h3>
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
