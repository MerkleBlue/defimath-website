
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Latest News | DefiMath",
    description: "Latest news and updates from DefiMath",
};

export default function Page() {
    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-xl px-4">

                    <h1 className="font-medium lg:text-56 md:text-50 text-54 lg:text-start text-center text-white mb-10">
                        Latest News
                    </h1>

                    <h2 className="font-medium lg:text-36 md:text-30 text-24 lg:text-start text-center text-white mb-10 mt-10">Release notes</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        2025-05-09: DeFiMath Solidity library is now open for public! Our initial launch includes core math and derivative functions
                        for safe and optimized operations. This release lays the groundwork for future DeFi primitives and complex financial
                        calculations. Check out the{" "}
                        <a href="https://github.com/MerkleBlue/defimath">DeFiMath Github Repo</a>.   
                    </p>

                </div>
            </section>
        </main>
    );
};
