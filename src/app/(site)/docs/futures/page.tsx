import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { Futures } from "@/components/Documentation/Futures";

export const metadata: Metadata = {
    title: "Futures — DeFiMath docs",
    description: "Solidity continuous-compounding forward price `spot · e^(r·t)` in 442 gas — 18-decimal fixed-point primitive for futures marking and fair-forward calculations.",
    alternates: { canonical: "/docs/futures/" },
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs/" }, { label: "Futures" }]} />
            <Futures />
        </>
    );
}
