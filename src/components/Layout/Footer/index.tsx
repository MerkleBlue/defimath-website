import React, { FC } from "react";
import Link from "next/link";
import { headerData } from "../Header/Navigation/menuData";
import { footerlabels } from "@/app/api/data";
import { Icon } from "@iconify/react";
import Logo from "../Header/Logo";
import { version as siteVersion } from "../../../../package.json";

const Footer: FC = () => {
  return (
    <footer className="pt-16 bg-darkmode" id="footer">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 lg:gap-20 md:gap-6 sm:gap-12 gap-6  pb-16">
          <div className="lg:col-span-4 md:col-span-5 col-span-6">
            <Logo />
            <div className="flex gap-6 items-center mt-8">
              {/* Order: trust/action (GitHub, npm) → reach (X) → community (Telegram) → outreach (LinkedIn). */}
              <Link href="https://github.com/MerkleBlue/defimath" target="_blank" rel="me noopener noreferrer" aria-label="DeFiMath on GitHub" className="group">
                <Icon
                  icon="fa6-brands:github"
                  width="24"
                  height="24"
                  className="text-white group-hover:text-primary"
                />
              </Link>
              <Link href="https://www.npmjs.com/package/defimath-lib" target="_blank" rel="noopener noreferrer" aria-label="defimath-lib on npm" className="group">
                <Icon
                  icon="fa6-brands:npm"
                  width="24"
                  height="24"
                  className="text-white group-hover:text-primary"
                />
              </Link>
              <Link href="https://x.com/defi_math" target="_blank" rel="me noopener noreferrer" aria-label="DeFiMath on X (Twitter)" className="group">
                <Icon
                  icon="fa6-brands:x-twitter"
                  width="24"
                  height="24"
                  className="text-white group-hover:text-primary"
                />
              </Link>
              <Link href="https://t.me/NebojsaKonsta" target="_blank" rel="noopener noreferrer" aria-label="Contact on Telegram" className="group">
                <Icon
                  icon="fa6-brands:telegram"
                  width="24"
                  height="24"
                  className="text-white group-hover:text-primary"
                />
              </Link>
              <Link href="https://www.linkedin.com/company/defi-math" target="_blank" rel="me noopener noreferrer" aria-label="DeFiMath on LinkedIn" className="group">
                <Icon
                  icon="fa6-brands:linkedin-in"
                  width="24"
                  height="24"
                  className="text-white group-hover:text-primary"
                />
              </Link>
            </div>
            <h3 className="text-white text-20 font-medium sm:mt-20 mt-12">
              Connect with us, we are here to help!
            </h3>
            <h3 className="text-white text-20 font-medium sm:mt-20 mt-12">
              {new Date().getFullYear()} &copy; <a href="https://merkleblue.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-white">MerkleBlue</a> v{siteVersion}. Theme by <a href="https://themewagon.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-white">ThemeWagon</a>
            </h3>

          </div>
          <div className="lg:col-span-2 md:col-span-3 col-span-6">
            <h4 className="text-white mb-4 font-medium text-24">Links</h4>
            <ul>
              {headerData.map((item, index) => (
                <li key={index} className="pb-4">
                  <Link
                    href={item.href}
                    className="text-white hover:text-primary text-17"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3 md:col-span-4 col-span-6">
            <h4 className="text-white mb-4 font-medium text-24">Information</h4>
            <ul>
              {footerlabels.map((item, index) => (
                <li key={index} className="pb-4">
                  <Link
                    href={item.herf}
                    className="text-white hover:text-primary text-17"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
