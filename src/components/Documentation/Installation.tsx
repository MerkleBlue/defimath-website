export const Installation = () => {
  return (
    <div id="installation" className="md:scroll-m-[180px] scroll-m-28 pb-10">
      <h3 className="text-2xl font-semibold mt-8 text-white">Installation</h3>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        DeFiMath is published on npm as <code className="text-primary">defimath-lib</code>.
      </p>
      <div className="mt-6 py-4 px-4 rounded-md bg-dark_grey">
        <p className="text-sm text-gray-400">npm install defimath-lib</p>
      </div>
      <div className="mt-6 p-6 rounded-md border border-dark_border border-opacity-60">
        <p className="text-white font-medium mb-3">Compiler requirements</p>
        <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
          <li>Solidity <code className="text-primary">^0.8.31</code></li>
          <li>EVM target <code className="text-primary">osaka</code> (Fusaka)</li>
        </ul>
        <p className="text-sm text-muted text-opacity-60 mt-3">
          The library uses the <code className="text-primary">clz</code> Yul
          builtin (Solidity 0.8.31+) which emits the{" "}
          <code className="text-primary">CLZ</code> opcode introduced in Osaka
          — both the compiler version and EVM target are hard requirements.
        </p>
      </div>
      <div className="mt-6 p-6 rounded-md border border-dark_border border-opacity-60">
        <p className="text-white font-medium mb-3">Import and use</p>
        <div className="py-4 px-4 rounded-md bg-dark_grey">
          <p className="text-sm text-gray-400">import {"{ DeFiMath }"} from &quot;defimath-lib/contracts/math/Math.sol&quot;;</p>
          <p className="text-sm text-gray-400 mt-2">using DeFiMath for uint256;</p>
          <p className="text-sm text-gray-400 mt-4">uint256 lnX = x.ln();</p>
        </div>
      </div>
    </div>
  );
};
