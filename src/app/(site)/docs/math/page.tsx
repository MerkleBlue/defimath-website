import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { MathDocs } from "@/components/Documentation/MathDocs";

export const metadata: Metadata = {
    title: "Math — DeFiMath docs",
    description: "Low-level fixed-point math primitives — exp, ln, sqrt, pow, stdNormCDF, erf and more. All pure and gas-optimized.",
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Math" }]} />
            <MathDocs />
        </>
    );
}
