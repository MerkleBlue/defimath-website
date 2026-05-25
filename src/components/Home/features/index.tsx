import { featuresData } from "@/app/api/data";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getImagePrefix } from "@/utils/utils";

const Features = () => {
  return (
    <section className="md:pt-20 md:pb-10 pt-10 pb-5" id="features">
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid lg:grid-cols-2 sm:gap-0 gap-10 items-center">
          <div>
            <p className="text-primary sm:text-28 text-18 mb-3">Why DeFiMath</p>
            <h2 className="text-white sm:text-40 text-30 font-medium mb-5">
              The math layer for on-chain finance
            </h2>
            <p className="text-muted text-18 mb-7">
              Pricing options on-chain used to mean off-chain oracles or
              hand-rolled approximations. DeFiMath gives you 40+ Solidity
              primitives - Black-Scholes, Greeks, implied vol, rates, statistics
              - at gas costs lower than a single storage read, with precision
              under 1e-12.
            </p>
            <div className="grid sm:grid-cols-1 sm:gap-5 gap-4">
              {featuresData.map((item, index) => (
                <div key={index} className="flex gap-5 items-start">
                  <div className="mt-1">
                    <Icon
                      icon="la:check-circle-solid"
                      width="24"
                      height="24"
                      className="text-primary"
                    />
                  </div>
                  <p className="text-18 text-muted">
                    <span className="text-white font-semibold">{item.value}</span>
                    {" - "}
                    {item.description}
                    {item.link && (
                      <>
                        {" "}
                        <Link
                          href={item.link.href}
                          className="text-primary hover:underline whitespace-nowrap"
                        >
                          {item.link.label} →
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Image
              src={`${getImagePrefix()}images/upgrade/img-upgrade.png`}
              alt="DeFiMath features"
              width={625}
              height={580}
              className="lg:-mr-5"
              style={{ width: "auto", height: "auto", maxWidth: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
