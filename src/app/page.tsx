import React from "react";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/features";
import Development from "@/components/Home/development";
import Connect from "@/components/Home/connect";
import { JsonLd } from "@/components/JsonLd";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "DeFiMath - Optimized DeFi & Math Solidity Primitives",
  description:
    "DeFiMath is an open-source Solidity library offering optimized math and DeFi primitives, designed for precision and efficiency in financial calculations.",
  alternates: { canonical: "/" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DeFiMath",
  url: "https://defimath.com",
  logo: "https://defimath.com/apple-touch-icon.png",
  sameAs: [
    "https://x.com/defi_math",
    "https://github.com/MerkleBlue/defimath",
    "https://www.npmjs.com/package/defimath-lib",
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "DeFiMath",
  description:
    "Gas-optimized Solidity library for DeFi math: options pricing, Greeks, implied-volatility solver, interest rates, and portfolio statistics.",
  url: "https://defimath.com",
  codeRepository: "https://github.com/MerkleBlue/defimath",
  programmingLanguage: "Solidity",
  license: "https://opensource.org/licenses/MIT",
  author: {
    "@type": "Organization",
    name: "DeFiMath",
    url: "https://defimath.com",
  },
};

export default function Home() {
  return (
    <main>
      <JsonLd data={[organizationSchema, softwareSchema]} />
      <Hero />
      <Features />
      <Development />
      <Connect />
    </main>
  );
}
