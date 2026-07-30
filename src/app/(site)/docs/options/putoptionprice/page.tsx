import { Metadata } from "next";
import { DocsRedirect } from "@/components/Documentation/DocsRedirect";

export const metadata: Metadata = {
    title: "put - DeFiMath Docs",
    description: "This page has moved to /docs/black-scholes/put/.",
    robots: { index: false, follow: true },
    alternates: { canonical: "/docs/black-scholes/put/" },
};

export default function Page() {
    return <DocsRedirect to="/docs/black-scholes/put/" label="put" />;
}
