import { Metadata } from "next";
import { Breadcrumb } from "@/components/Documentation/Breadcrumb";
import { Statistics } from "@/components/Documentation/Statistics";

export const metadata: Metadata = {
    title: "Statistics — DeFiMath docs",
    description: "Portfolio and performance analytics — mean, std dev, historical volatility, Sharpe ratio, max drawdown, VaR, CVaR.",
};

export default function Page() {
    return (
        <>
            <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Statistics" }]} />
            <Statistics />
        </>
    );
}
