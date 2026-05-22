import { CopyButton } from "./CopyButton";

const IMPORT_USE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import "defimath-lib/contracts/derivatives/Options.sol";

contract OptionsExchange {
    function quote(
        uint128 spot, uint128 strike, uint32 timeToExp,
        uint64 vol, uint64 rate
    ) external pure returns (uint256 callPx, uint256 putPx) {
        callPx = DeFiMathOptions.callOptionPrice(spot, strike, timeToExp, vol, rate);
        putPx  = DeFiMathOptions.putOptionPrice(spot, strike, timeToExp, vol, rate);
    }
}`;

export const Installation = () => {
  return (
    <div className="pb-10">
      <h2 id="getting-started" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Getting started</h2>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        DeFiMath is published on npm as <code className="text-primary">defimath-lib</code>.
      </p>
      <div className="mt-6 py-4 px-4 rounded-md bg-dark_grey relative">
        <p className="text-sm text-gray-400 pe-16">npm install defimath-lib</p>
        <CopyButton value="npm install defimath-lib" />
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
      <h2 id="import-and-use" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Import and use</h2>
      <pre className="py-4 px-4 rounded-md bg-dark_grey relative overflow-x-auto">
        <code className="text-sm text-gray-400 font-mono whitespace-pre pe-16 block">{IMPORT_USE}</code>
        <CopyButton value={IMPORT_USE} />
      </pre>
      <p className="text-base font-medium text-muted text-opacity-95 mt-3">
        All values use 18-decimal fixed-point (<code className="text-primary">1e18 = 1.0</code>).
        Time is in seconds. See module docs for full parameter conventions.
      </p>
    </div>
  );
};
