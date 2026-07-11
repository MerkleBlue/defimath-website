import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { CodeBlock } from "@/components/CodeBlock";
import { DocPageNav } from "@/components/Documentation/DocPageNav";
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

contract OptionsPricer {
    function priceCall(
        uint128 spot, uint128 strike, uint32 timeToExp,
        uint64 vol, uint64 rate
    ) external pure returns (uint256) {
        return DeFiMathOptions.callOptionPrice(spot, strike, timeToExp, vol, rate);
    }
}`;

const MATH_EXAMPLE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import "defimath-lib/contracts/math/Math.sol";

contract Confidence {
    // P(-k < Z < k) = 2·Φ(k) - 1 — probability that a normally-distributed
    // value falls within k standard deviations of the mean (e.g., k=1 → ~68%,
    // k=2 → ~95%, k=3 → ~99.7%). The 68-95-99.7 rule on-chain.
    function withinKStdevs(int256 k) external pure returns (uint256) {
        return 2 * DeFiMath.stdNormCDF(k) - 1e18;
    }
}`;

type BenchmarkRow = { fn: string; defimath: string; nextBest: string; nextLib: string; multiple: string; highlight: boolean };
const BENCHMARKS: BenchmarkRow[] = [
    { fn: "callOptionPrice", defimath: "2,723", nextBest: "13,360", nextLib: "Derivexyz", multiple: "4.9×", highlight: true },
    { fn: "putOptionPrice",  defimath: "2,733", nextBest: "13,363", nextLib: "Derivexyz", multiple: "4.9×", highlight: true },
    { fn: "binaryCallPrice", defimath: "2,012", nextBest: "16,218", nextLib: "Haptic",    multiple: "8.1×", highlight: true },
    { fn: "delta",           defimath: "1,718", nextBest: "8,621",  nextLib: "Derivexyz", multiple: "5.0×", highlight: true },
    { fn: "vega",            defimath: "1,430", nextBest: "7,490",  nextLib: "Derivexyz", multiple: "5.2×", highlight: true },
    { fn: "ln",              defimath: "375",   nextBest: "518",    nextLib: "Solady",    multiple: "1.4×", highlight: false },
    { fn: "sqrt",            defimath: "212",   nextBest: "341",    nextLib: "Solady",    multiple: "1.6×", highlight: false },
    { fn: "cbrt",            defimath: "340",   nextBest: "550",    nextLib: "Solady",    multiple: "1.6×", highlight: false },
    { fn: "stdNormCDF",      defimath: "660",   nextBest: "2,794",  nextLib: "SolStat",   multiple: "4.2×", highlight: true },
];

export default async function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs" }]} />
            <Overview />

            <h2 id="benchmarks" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Benchmarks</h2>
            <p className="text-base font-medium text-muted text-opacity-95">
                Headline functions vs. the next-best on-chain implementation in each category:
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
                DeFiMath ships with two independent test layers. Each library function is the unit — its own <code className="text-primary">describe</code> block with a fixed taxonomy of sub-tests, so anyone auditing the suite can find the exact coverage for any function in seconds.
            </p>

            <h3 id="testing-hardhat" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Hardhat correctness layer</h3>
            <p className="text-base font-medium text-muted text-opacity-95">
                606 tests validating against external JavaScript references (JS <code className="text-primary">Math</code>, <code className="text-primary">math-erf</code>, <code className="text-primary">black-scholes</code>, <code className="text-primary">greeks</code>, <code className="text-primary">simple-statistics</code>) at concrete points across the operational domain. Every function in every module follows the same five-category taxonomy:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-base font-medium text-muted text-opacity-95">
                <li><span className="text-white font-semibold">behaviour</span> — normal-case sweeps (~200 samples per test) validated against the JS reference</li>
                <li><span className="text-white font-semibold">limits</span> — minimum and maximum valid inputs, branch-transition boundaries, and near-revert edges</li>
                <li><span className="text-white font-semibold">random</span> — non-seeded fuzz coverage with <code className="text-primary">Math.random()</code></li>
                <li><span className="text-white font-semibold">failure</span> — one test per named revert error in the contract</li>
                <li><span className="text-white font-semibold">performance</span> — one deterministic test per function asserting <span className="text-white font-semibold">exact gas with <code className="text-primary">assert.equal</code></span> (fails on both regression AND improvement). Gas threshold is in the test name, so any change shows up in the PR diff.</li>
            </ul>

            <h3 id="testing-foundry" className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Foundry property-fuzz layer</h3>
            <p className="text-base font-medium text-muted text-opacity-95">
                92 mathematical properties × 32,000 random runs each = <span className="text-white font-semibold">2,944,000 random executions per CI run</span>. Validates the algebraic structure of the library, not just concrete points. Foundry automatically shrinks counterexamples on failure. Properties are organized into five categories:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-base font-medium text-muted text-opacity-95">
                <li><span className="text-white font-semibold">Round-trips</span> — composing a function with its inverse recovers the input within tolerance</li>
                <li><span className="text-white font-semibold">Monotonicity</span> — output ordering matches input ordering for functions that are mathematically monotone</li>
                <li><span className="text-white font-semibold">Identities</span> — algebraic equalities that must hold across the full input domain</li>
                <li><span className="text-white font-semibold">Output bounds</span> — every output lies within its mathematically valid range</li>
                <li><span className="text-white font-semibold">Symmetries</span> — sign or reflection symmetries hold under input negation</li>
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-5 rounded-md border border-dark_border border-opacity-60">
                    <p className="text-primary text-2xl font-semibold">681</p>
                    <p className="text-sm text-muted text-opacity-60 mt-1">Total tests (Hardhat + Foundry)</p>
                </div>
                <div className="p-5 rounded-md border border-dark_border border-opacity-60">
                    <p className="text-primary text-2xl font-semibold">2,944,000</p>
                    <p className="text-sm text-muted text-opacity-60 mt-1">Random executions per CI run</p>
                </div>
                <div className="p-5 rounded-md border border-dark_border border-opacity-60">
                    <p className="text-primary text-2xl font-semibold">&lt; 1 min</p>
                    <p className="text-sm text-muted text-opacity-60 mt-1">Full suite wall-time</p>
                </div>
            </div>
            <p className="text-base font-medium text-muted text-opacity-95 mt-4">
                Each module page has its own <span className="text-white font-semibold">Testing</span> section detailing per-function coverage. All code lives at{" "}
                <a href="https://github.com/MerkleBlue/defimath/tree/master/test" target="_blank" rel="noopener noreferrer" className="text-primary underline"><code className="text-primary">test/</code></a> on GitHub — <code className="text-primary">test/hardhat/</code> for the correctness layer, <code className="text-primary">test/foundry/</code> for the properties.
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
                as <code className="text-primary">defimath-lib</code>. All functions are <code className="text-primary">internal pure</code>, so the library compiles directly into your contract bytecode — no linker step and no runtime contract to deploy.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">Hardhat / npm</h3>
            <InstallCommand />

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">Foundry</h3>
            <InstallCommand command="forge install defimath-lib=MerkleBlue/defimath" />
            <p className="text-base font-medium text-muted text-opacity-95 mt-3 mb-2">
                Then add to <code className="text-primary">remappings.txt</code>:
            </p>
            <CodeBlock code={`defimath-lib/=lib/defimath-lib/`} language="text" />
            <details className="mt-3 group">
                <summary className="text-sm text-muted text-opacity-60 cursor-pointer hover:text-primary duration-200 list-none flex items-center gap-1">
                    <span className="inline-block transition-transform duration-150 group-open:rotate-90">▸</span>
                    Why the alias and the remapping?
                </summary>
                <p className="text-sm text-muted text-opacity-60 mt-2 ms-3">
                    The <code className="text-primary">defimath-lib=</code> install alias makes Foundry place the repo at <code className="text-primary">lib/defimath-lib/</code> so the same <code className="text-primary">defimath-lib/contracts/...</code> import path works under both toolchains. The remapping then overrides Foundry&apos;s auto-detect, which would otherwise treat <code className="text-primary">contracts/</code> as the src directory and produce <code className="text-primary">defimath-lib/=lib/defimath-lib/contracts/</code> — colliding with the leading <code className="text-primary">contracts/</code> in the import path.
                </p>
            </details>

            <div className="mt-6 p-6 rounded-md border border-dark_border border-opacity-60">
                <p className="text-white font-medium mb-3">Compiler requirements</p>
                <ul className="list-disc list-inside space-y-2 text-base font-medium text-muted text-opacity-95">
                    <li>Solidity <code className="text-primary">^0.8.31</code></li>
                    <li>EVM target <code className="text-primary">osaka</code> (Fusaka)</li>
                </ul>
                <details className="mt-3 group">
                    <summary className="text-sm text-muted text-opacity-60 cursor-pointer hover:text-primary duration-200 list-none flex items-center gap-1">
                        <span className="inline-block transition-transform duration-150 group-open:rotate-90">▸</span>
                        Why these requirements?
                    </summary>
                    <p className="text-sm text-muted text-opacity-60 mt-2 ms-3">
                        The library uses the <code className="text-primary">clz</code> Yul
                        builtin (Solidity 0.8.31+) which emits the{" "}
                        <code className="text-primary">CLZ</code> opcode introduced in Osaka
                        — both the compiler version and EVM target are hard requirements.
                    </p>
                </details>
            </div>
            <h2 id="import-and-use" className="text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-28 md:scroll-mt-[180px]">Import and use</h2>
            <p className="text-base font-medium text-muted text-opacity-95 mt-3 mb-4">
                Pricing a European call option — every other module imports the same way.
            </p>
            <CodeBlock code={IMPORT_USE} />
            <p className="text-base font-medium text-muted text-opacity-95 mt-6 mb-4">
                Or composing math primitives directly — the 68-95-99.7 rule, on-chain:
            </p>
            <CodeBlock code={MATH_EXAMPLE} />

            <DocPageNav />
        </>
    );
}
