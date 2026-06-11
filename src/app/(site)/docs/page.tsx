import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { CodeBlock } from "@/components/CodeBlock";
import { Overview } from "@/components/Documentation/Overview";
import { InstallCommand } from "@/components/InstallCommand";

export const metadata: Metadata = {
    title: "Docs | DefiMath",
    description: "Documentation for DefiMath — a gas-optimized Solidity library of DeFi math, derivatives, rates and statistics primitives.",
    alternates: { canonical: "/docs/" },
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
    { href: "/docs/math", title: "Math", blurb: "Low-level fixed-point primitives — exponential, logarithm, square root, power, standard normal CDF, error function, and more." },
    { href: "/docs/options", title: "Options", blurb: "Black-Scholes pricing, full Greeks, and an iterative implied-volatility solver." },
    { href: "/docs/binary", title: "Binary options", blurb: "Cash-or-nothing call and put pricing with full Greeks." },
    { href: "/docs/futures", title: "Futures", blurb: "Continuous-compounding futures price." },
    { href: "/docs/rates", title: "Rates", blurb: "Compound interest, present value, log returns, YTM, IRR." },
    { href: "/docs/statistics", title: "Statistics", blurb: "Mean, std dev, historical volatility, Sharpe, max drawdown, VaR, CVaR." },
];

type BenchmarkRow = { fn: string; defimath: string; nextBest: string; nextLib: string; multiple: string; highlight: boolean };
const BENCHMARKS: BenchmarkRow[] = [
    { fn: "callOptionPrice", defimath: "2,729", nextBest: "13,360", nextLib: "Derivexyz", multiple: "4.9×", highlight: true },
    { fn: "putOptionPrice",  defimath: "2,739", nextBest: "13,363", nextLib: "Derivexyz", multiple: "4.9×", highlight: true },
    { fn: "binaryCallPrice", defimath: "2,018", nextBest: "16,218", nextLib: "Haptic",    multiple: "8.0×", highlight: true },
    { fn: "delta",           defimath: "1,724", nextBest: "8,621",  nextLib: "Derivexyz", multiple: "5.0×", highlight: true },
    { fn: "vega",            defimath: "1,439", nextBest: "7,490",  nextLib: "Derivexyz", multiple: "5.2×", highlight: true },
    { fn: "ln",              defimath: "375",   nextBest: "518",    nextLib: "Solady",    multiple: "1.4×", highlight: false },
    { fn: "sqrt",            defimath: "245",   nextBest: "341",    nextLib: "Solady",    multiple: "1.4×", highlight: false },
    { fn: "cbrt",            defimath: "368",   nextBest: "550",    nextLib: "Solady",    multiple: "1.5×", highlight: false },
    { fn: "stdNormCDF",      defimath: "660",   nextBest: "2,794",  nextLib: "SolStat",   multiple: "4.2×", highlight: true },
];

export default async function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs" }]} />
            <Overview />

            <h2 id="benchmarks" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Benchmarks</h2>
            <p className="text-base font-medium text-muted text-opacity-95">
                Every function is benchmarked against existing on-chain implementations. A representative comparison:
            </p>
            <div className="mt-6 p-2 md:p-4 rounded-md border border-dark_border border-opacity-60 overflow-x-auto">
                <table className="w-full text-base">
                    <thead>
                        <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
                            <th className="py-3 px-3 font-medium">Function</th>
                            <th className="py-3 px-3 font-medium text-right whitespace-nowrap">DeFiMath</th>
                            <th className="py-3 px-3 font-medium text-right whitespace-nowrap">Next best</th>
                            <th className="py-3 px-3 font-medium text-right whitespace-nowrap">Multiple</th>
                        </tr>
                    </thead>
                    <tbody>
                        {BENCHMARKS.map((r, i) => (
                            <tr
                                key={r.fn}
                                className={
                                    i < BENCHMARKS.length - 1
                                        ? "border-b border-dark_border border-opacity-20"
                                        : ""
                                }
                            >
                                <td className="py-2 px-3 font-mono text-primary whitespace-nowrap">{r.fn}</td>
                                <td className="py-2 px-3 text-right whitespace-nowrap font-semibold text-white">{r.defimath}</td>
                                <td className="py-2 px-3 text-right whitespace-nowrap text-muted text-opacity-95">
                                    {r.nextBest} <span className="text-muted text-opacity-60">({r.nextLib})</span>
                                </td>
                                <td className={`py-2 px-3 text-right whitespace-nowrap ${r.highlight ? "font-semibold text-primary" : "text-muted text-opacity-95"}`}>
                                    {r.multiple}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-sm text-muted text-opacity-60 mt-3">
                Full per-function tables in the{" "}
                <a
                    href="https://github.com/MerkleBlue/defimath-compare#readme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                >
                    defimath-compare README
                </a>.
            </p>

            <h2 id="testing" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Testing</h2>
            <p className="text-base font-medium text-muted text-opacity-95 mt-3">
                DeFiMath ships with two independent test layers — a correctness layer and a property-fuzz layer:
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-3 text-base font-medium text-muted text-opacity-95">
                <li>
                    <span className="text-white font-semibold">Hardhat</span> — 565 tests validating against external JavaScript references (<code className="text-primary">Math.exp</code>, <code className="text-primary">black-scholes</code>, <code className="text-primary">greeks</code>, <code className="text-primary">simple-statistics</code>) at concrete points across the operational domain, plus strict-equality gas-regression assertions on every performance test.
                </li>
                <li>
                    <span className="text-white font-semibold">Foundry</span> — 43 property-based fuzz tests × 10,000 random runs each = <span className="text-white font-semibold">430,000 random executions per CI run</span>. Validates the algebraic structure: round-trips, monotonicity, identities, output bounds, symmetries. Foundry automatically shrinks counterexamples on failure.
                </li>
            </ol>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                <div className="p-5 rounded-md border border-dark_border border-opacity-60">
                    <p className="text-primary text-2xl font-semibold">608</p>
                    <p className="text-sm text-muted text-opacity-60 mt-1">Total tests (Hardhat + Foundry)</p>
                </div>
                <div className="p-5 rounded-md border border-dark_border border-opacity-60">
                    <p className="text-primary text-2xl font-semibold">430,000</p>
                    <p className="text-sm text-muted text-opacity-60 mt-1">Random executions per CI run</p>
                </div>
                <div className="p-5 rounded-md border border-dark_border border-opacity-60">
                    <p className="text-primary text-2xl font-semibold">~30 s</p>
                    <p className="text-sm text-muted text-opacity-60 mt-1">Full suite wall-time</p>
                </div>
            </div>
            <p className="text-base font-medium text-muted text-opacity-95 mt-4">
                Each module page has a <span className="text-white font-semibold">Testing</span> section detailing what&apos;s specifically covered. All code lives in <code className="text-primary">test/</code> on{" "}
                <a href="https://github.com/MerkleBlue/defimath/tree/master/test" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub</a>.
            </p>

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
