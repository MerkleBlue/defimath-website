import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { Black76 } from "@/components/Documentation/Black76";

export const metadata: Metadata = {
    title: "Solidity Black-76 Futures Options & Greeks - DeFiMath Docs",
    description: "Solidity Black-76 pricing for European options on a future, full Greeks (delta, gamma, theta, vega) and an iterative implied-volatility solver.",
    alternates: { canonical: "/docs/black-76/" },
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs/" }, { label: "Derivatives" }, { label: "Black-76" }]} />
            <Black76 />
        </>
    );
}
