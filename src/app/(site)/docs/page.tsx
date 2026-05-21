import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { Overview } from "@/components/Documentation/Overview";
import { Installation } from "@/components/Documentation/Installation";

export const metadata: Metadata = {
    title: "Docs | DefiMath",
    description: "Documentation for DefiMath — a gas-optimized Solidity library of DeFi math, derivatives, rates and statistics primitives.",
};

const MODULES = [
    { href: "/docs/math", title: "Math", blurb: "Low-level fixed-point primitives — exp, ln, sqrt, pow, stdNormCDF, erf." },
    { href: "/docs/options", title: "Options", blurb: "Black-Scholes pricing, full Greeks, and an iterative implied-volatility solver." },
    { href: "/docs/binary", title: "Binary options", blurb: "Cash-or-nothing call and put pricing with full Greeks." },
    { href: "/docs/futures", title: "Futures", blurb: "Continuous-compounding futures price." },
    { href: "/docs/rates", title: "Rates", blurb: "Compound interest, present value, log returns, YTM, IRR." },
    { href: "/docs/statistics", title: "Statistics", blurb: "Mean, std dev, historical volatility, Sharpe, max drawdown, VaR, CVaR." },
];

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs" }]} />
            <Overview />
            <Installation />
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
