import { featuresData } from "@/app/api/data";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { getImagePrefix } from "@/utils/utils";

const Features = () => {
  return (
    <section className="md:pt-20 md:pb-10 pt-10 pb-5" id="features">
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid lg:grid-cols-2 sm:gap-0 gap-10 items-center">
          <div>
            <p className="text-primary sm:text-28 text-18 mb-3">Features</p>
            <h2 className="text-white sm:text-40 text-30  font-medium mb-5">
              What is DeFiMath?
            </h2>
            <p className="text-muted text-opacity-60 text-18 mb-7">
              DeFiMath is a high-performance, open-source Solidity library implementing DeFi
              primitives. Built for Ethereum developers looking to create secure, and gas-efficient advanced financial applications.
            </p>
            <div className="grid sm:grid-cols-1 lg:w-70% sm:gap-10 gap-5">
              {featuresData.map((item, index) => (
                <div key={index} className="flex gap-5 ">
                  <div>
                    <Icon
                      icon="la:check-circle-solid"
                      width="24"
                      height="24"
                      className="text-white group-hover:text-primary"
                    />
                  </div>
                  <div>
                    <h4 className="text-18 text-muted text-opacity-60">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="">
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
      </div>
    </section>
  );
};

export default Features;
