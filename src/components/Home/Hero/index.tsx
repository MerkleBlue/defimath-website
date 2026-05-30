import Link from "next/link";
import Image from "next/image";
import { getImagePrefix } from "@/utils/utils";

const Hero = () => {
  return (
    <section
      className="relative md:pt-40 md:pb-0 pt-32 pb-20 overflow-hidden z-1"
      id="main-banner"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid grid-cols-12 items-center">
          <div className="lg:col-span-5 col-span-12">
            <h1 className="font-medium lg:text-76 md:text-70 text-54 lg:text-start text-center text-white mb-10">
              Optimized<br className="md:hidden" /> <span className="text-primary">DeFi</span> & <span className="text-primary">Math</span><br className="md:hidden" /> Primitives
            </h1>
            <div className="flex items-center md:justify-start justify-center gap-8">
              <Link
                href="/docs"
                className="whitespace-nowrap bg-primary border border-primary rounded-lg text-21 font-medium hover:bg-transparent hover:text-primary text-darkmode py-2 px-7 z-50"
              >
                Get started
              </Link>
              <a
                href="https://github.com/MerkleBlue/defimath"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap bg-transparent border border-primary rounded-lg text-21 font-medium hover:bg-primary hover:text-darkmode text-primary py-2 px-7"
              >
                Github
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 mt-10 lg:mt-0">
            <div className="flex justify-center lg:ml-20">
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
