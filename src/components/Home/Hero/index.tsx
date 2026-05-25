"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImagePrefix } from "@/utils/utils";

const Hero = () => {
  const leftAnimation = {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  const rightAnimation = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section
      className="relative md:pt-40 md:pb-10 py-20 overflow-hidden z-1"
      id="main-banner"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid grid-cols-12">
          <motion.div {...leftAnimation} className="lg:col-span-5 col-span-12">
            <h1 className="font-medium lg:text-76 md:text-70 text-54 lg:text-start text-center text-white mt-24 mb-10">
              Optimized <span className="text-primary">DeFi</span> & <span className="text-primary">Math</span> Primitives
            </h1>
            <div className="flex items-center md:justify-start justify-center gap-8">
              <Link
                href="/docs"
                className="bg-primary border border-primary rounded-lg text-21 font-medium hover:bg-transparent hover:text-primary text-darkmode py-2 px-7 z-50"
              >
                Get started
              </Link>
              <button
                className="bg-transparent border border-primary rounded-lg text-21 font-medium hover:bg-primary hover:text-darkmode text-primary py-2 px-7"
                onClick={() => window.open('https://github.com/MerkleBlue/defimath', '_blank', 'noopener,noreferrer')}
              >
                Github
              </button>
            </div>
          </motion.div>
          <motion.div
            {...rightAnimation}
            className="col-span-7 lg:block hidden"
          >
            <div className="ml-20 flex justify-center">
              <Image
                src= {`${getImagePrefix()}images/hero/banner-image.png`}
                alt="Banner"
                width={500}
                height={500}
                priority
                style={{ width: "auto", height: "auto", maxWidth: '100%' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
