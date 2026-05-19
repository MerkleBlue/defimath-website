
import { Documentation } from "@/components/Documentation/Documentation";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Docs | DefiMath",
    description: "Documentation for DefiMath",
};

export default function Page() {
    return (
        <>
        <Documentation/>
        </>
    );
};
