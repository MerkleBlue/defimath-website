import { Metadata } from "next";
import { DocsRedirect } from "@/components/Documentation/DocsRedirect";

// The Options module was renamed to Black-Scholes; this stub keeps the old
// /docs/options/ URL alive and redirects to the new location.
export const metadata: Metadata = {
    title: "Black-Scholes Options - DeFiMath Docs",
    description: "The Options module has moved to /docs/black-scholes/.",
    robots: { index: false, follow: true },
    alternates: { canonical: "/docs/black-scholes/" },
};

export default function Page() {
    return <DocsRedirect to="/docs/black-scholes/" label="Black-Scholes" />;
}
