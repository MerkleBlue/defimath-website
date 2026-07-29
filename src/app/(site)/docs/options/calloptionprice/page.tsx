import { Metadata } from "next";
import { DocsRedirect } from "@/components/Documentation/DocsRedirect";

export const metadata: Metadata = {
    title: "callOptionPrice - DeFiMath Docs",
    description: "This page has moved to /docs/black-scholes/calloptionprice/.",
    robots: { index: false, follow: true },
    alternates: { canonical: "/docs/black-scholes/calloptionprice/" },
};

export default function Page() {
    return <DocsRedirect to="/docs/black-scholes/calloptionprice/" label="callOptionPrice" />;
}
