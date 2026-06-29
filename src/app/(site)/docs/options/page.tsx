import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { Options } from "@/components/Documentation/Options";

export const metadata: Metadata = {
    title: "Options — DeFiMath docs",
    description: "Solidity Black-Scholes pricing, full Greeks (delta, gamma, theta, vega) and an iterative implied-volatility solver for European options.",
    alternates: { canonical: "/docs/options/" },
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs/" }, { label: "Options" }]} />
            <Options />
        </>
    );
}
