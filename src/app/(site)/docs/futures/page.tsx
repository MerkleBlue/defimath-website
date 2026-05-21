import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { Futures } from "@/components/Documentation/Futures";

export const metadata: Metadata = {
    title: "Futures — DeFiMath docs",
    description: "Futures pricing using continuous compounding.",
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Futures" }]} />
            <Futures />
        </>
    );
}
