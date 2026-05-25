import React from "react";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/features";
import Development from "@/components/Home/development";
import Connect from "@/components/Home/connect";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "DeFiMath - Optimized DeFi & Math Solidity Primitives",
  description:
    "DeFiMath is an open-source Solidity library offering optimized math and DeFi primitives, designed for precision and efficiency in financial calculations.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Development />
      <Connect />
    </main>
  );
}
