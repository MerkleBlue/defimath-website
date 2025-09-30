import React from "react";
import Hero from "@/components/Home/Hero";
import Work from "@/components/Home/work";
import TimeLine from "@/components/Home/timeline";
import Platform from "@/components/Home/platform";
import Portfolio from "@/components/Home/portfolio";
import Upgrade from "@/components/Home/upgrade";
import Perks from "@/components/Home/perks";
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
      <Upgrade />
      <Portfolio />

      {/* <Work />
      <TimeLine />
      <Platform /> */}


      <Perks />
    </main>
  );
}
