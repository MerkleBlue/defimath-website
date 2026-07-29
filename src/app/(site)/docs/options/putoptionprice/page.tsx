import { Metadata } from "next";
import { DocsRedirect } from "@/components/Documentation/DocsRedirect";

export const metadata: Metadata = {
    title: "putOptionPrice - DeFiMath Docs",
    description: "This page has moved to /docs/black-scholes/putoptionprice/.",
    robots: { index: false, follow: true },
    alternates: { canonical: "/docs/black-scholes/putoptionprice/" },
};

export default function Page() {
    return <DocsRedirect to="/docs/black-scholes/putoptionprice/" label="putOptionPrice" />;
}
