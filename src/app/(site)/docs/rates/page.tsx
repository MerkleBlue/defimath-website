import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { Rates } from "@/components/Documentation/Rates";

export const metadata: Metadata = {
    title: "Rates — DeFiMath docs",
    description: "Interest rate primitives — compounding, present value, log returns, APR↔APY conversions, yield to maturity, IRR.",
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Rates" }]} />
            <Rates />
        </>
    );
}
