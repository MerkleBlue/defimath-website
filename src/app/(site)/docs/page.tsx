import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { CodeBlock } from "@/components/CodeBlock";
import { Overview } from "@/components/Documentation/Overview";
import { InstallCommand } from "@/components/InstallCommand";

export const metadata: Metadata = {
    title: "Docs | DefiMath",
    description: "Documentation for DefiMath — a gas-optimized Solidity library of DeFi math, derivatives, rates and statistics primitives.",
};

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

const MODULES = [
    { href: "/docs/math", title: "Math", blurb: "Low-level fixed-point primitives — exp, ln, sqrt, pow, stdNormCDF, erf." },
    { href: "/docs/options", title: "Options", blurb: "Black-Scholes pricing, full Greeks, and an iterative implied-volatility solver." },
    { href: "/docs/binary", title: "Binary options", blurb: "Cash-or-nothing call and put pricing with full Greeks." },
    { href: "/docs/futures", title: "Futures", blurb: "Continuous-compounding futures price." },
    { href: "/docs/rates", title: "Rates", blurb: "Compound interest, present value, log returns, YTM, IRR." },
    { href: "/docs/statistics", title: "Statistics", blurb: "Mean, std dev, historical volatility, Sharpe, max drawdown, VaR, CVaR." },
];

export default async function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs" }]} />
            <Overview />

            <h2 id="getting-started" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Getting started</h2>
            <p className="text-base font-medium text-muted text-opacity-95 mt-3">
                DeFiMath is{" "}
                <a
                    href="https://www.npmjs.com/package/defimath-lib"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                >
                    published on npm
                </a>{" "}
                as <code className="text-primary">defimath-lib</code>.
            </p>
            <InstallCommand className="mt-6" />
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
            <CodeBlock code={IMPORT_USE} />
            <p className="text-base font-medium text-muted text-opacity-95 mt-3">
                All values use 18-decimal fixed-point (<code className="text-primary">1e18 = 1.0</code>).
                Time is in seconds. See module docs for full parameter conventions.
            </p>

            <h2 id="modules" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MODULES.map((m) => (
                    <Link
                        key={m.href}
                        href={m.href}
                        className="group p-5 rounded-md border border-dark_border border-opacity-60 hover:border-primary duration-200"
                    >
                        <h5 className="text-lg font-semibold text-white group-hover:text-primary duration-200">
                            {m.title}
                        </h5>
                        <p className="text-sm font-medium text-muted text-opacity-60 mt-1">
                            {m.blurb}
                        </p>
                    </Link>
                ))}
            </div>
        </>
    );
}
