import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { Math } from "@/components/Documentation/Math";

export const metadata: Metadata = {
    title: "Math — DeFiMath docs",
    description: "Low-level Solidity fixed-point math primitives — exp, ln, sqrt, pow, stdNormCDF, erf and more. All pure and gas-optimized.",
    alternates: { canonical: "/docs/math/" },
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Math" }]} />
            <Math />
        </>
    );
}
