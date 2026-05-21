import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { BinaryOptions } from "@/components/Documentation/BinaryOptions";

export const metadata: Metadata = {
    title: "Binary options — DeFiMath docs",
    description: "Cash-or-nothing binary call and put pricing with full Greeks. Unit-payout convention; scale externally for any payout.",
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Binary options" }]} />
            <BinaryOptions />
        </>
    );
}
