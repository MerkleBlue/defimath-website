import Link from "next/link";
import Image from "next/image";
import { getImagePrefix } from "@/utils/utils";

const Hero = () => {
  return (
    <section
      className="relative md:pt-40 md:pb-0 py-20 overflow-hidden z-1"
      id="main-banner"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid grid-cols-12 items-center">
          <div className="lg:col-span-5 col-span-12">
            <h1 className="font-medium lg:text-76 md:text-70 text-54 lg:text-start text-center text-white mb-10">
              Optimized <span className="text-primary">DeFi</span> & <span className="text-primary">Math</span> Primitives
            </h1>
            <div className="flex items-center md:justify-start justify-center gap-8">
              <Link
                href="/docs"
                className="bg-primary border border-primary rounded-lg text-21 font-medium hover:bg-transparent hover:text-primary text-darkmode py-2 px-7 z-50"
              >
                Get started
              </Link>
              <a
                href="https://github.com/MerkleBlue/defimath"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-primary rounded-lg text-21 font-medium hover:bg-primary hover:text-darkmode text-primary py-2 px-7"
              >
                Github
              </a>
            </div>
          </div>
          <div className="col-span-7 lg:block hidden">
            <div className="ml-20 flex justify-center">
              <Image
                src={`${getImagePrefix()}images/hero/banner-image.png`}
                alt="Banner"
                width={500}
                height={500}
                priority
                style={{ width: "auto", height: "auto", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
