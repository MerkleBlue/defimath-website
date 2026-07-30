import { Metadata } from "next";
import { DocsRedirect } from "@/components/Documentation/DocsRedirect";

export const metadata: Metadata = {
    title: "call - DeFiMath Docs",
    description: "This page has moved to /docs/black-scholes/call/.",
    robots: { index: false, follow: true },
    alternates: { canonical: "/docs/black-scholes/call/" },
};

export default function Page() {
    return <DocsRedirect to="/docs/black-scholes/call/" label="call" />;
}
