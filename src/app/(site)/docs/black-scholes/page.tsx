import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { BlackScholes } from "@/components/Documentation/BlackScholes";

export const metadata: Metadata = {
    title: "Solidity Black-Scholes Options & Greeks - DeFiMath Docs",
    description: "Solidity Black-Scholes pricing, full Greeks (delta, gamma, theta, vega) and an iterative implied-volatility solver for European options.",
    alternates: { canonical: "/docs/black-scholes/" },
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs/" }, { label: "Derivatives" }, { label: "Black-Scholes" }]} />
            <BlackScholes />
        </>
    );
}
