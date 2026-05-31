import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Supported chains | DefiMath",
    description: "Ethereum L1 and EVM-compatible L2s where DeFiMath can be deployed. The library requires the CLZ opcode (EIP-7939) introduced in EVM Osaka.",
    alternates: { canonical: "/supported-chains/" },
};

export default function Page() {
    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 pt-32 pb-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-md px-4">

                    <h1 className="font-medium lg:text-54 md:text-44 text-40 lg:text-start text-center text-white mb-4">
                        Supported chains
                    </h1>
                    <p className="text-sm font-medium text-muted text-opacity-60 lg:text-start text-center mb-10">
                        Last updated: May 31, 2026
                    </p>

                    <p className="text-base font-medium text-muted text-opacity-95 mb-6">
                        DeFiMath uses the <code className="text-primary">CLZ</code> opcode
                        (<a href="https://eips.ethereum.org/EIPS/eip-7939" target="_blank" rel="noopener noreferrer" className="text-primary underline">EIP-7939</a>),
                        introduced in EVM Osaka. It runs on any chain that has rolled forward
                        to Osaka or later. The table below tracks chains we&apos;ve verified.
                    </p>

                    <div className="mt-6 rounded-md border border-dark_border border-opacity-60 overflow-x-auto">
                        <table className="w-full text-base">
                            <thead>
                                <tr className="text-left text-muted text-opacity-60 border-b border-dark_border border-opacity-40">
                                    <th className="py-3 px-4 font-medium whitespace-nowrap">Chain</th>
                                    <th className="py-3 px-4 font-medium whitespace-nowrap">Type</th>
                                    <th className="py-3 px-4 font-medium whitespace-nowrap">Status</th>
                                    <th className="py-3 px-4 font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Ethereum</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L1</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Live</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Fusaka hard fork, Dec 3, 2025</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Arbitrum One</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L2 (optimistic)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Live</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">ArbOS 51 &ldquo;Dia&rdquo;, Jan 8, 2026</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Arbitrum Nova</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L2 (optimistic)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Live</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">ArbOS 51 &ldquo;Dia&rdquo;, Jan 8, 2026</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">BNB Smart Chain</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L1</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Live</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Mendel hard fork, Apr 28, 2026</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Base</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L2 (OP Stack)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Pending</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Awaiting Superchain Fusaka enablement upgrade</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">OP Mainnet</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L2 (OP Stack)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Pending</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Awaiting Superchain Fusaka enablement upgrade</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Unichain</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L2 (OP Stack)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Pending</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Awaiting Superchain Fusaka enablement upgrade</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Ink</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L2 (OP Stack)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Pending</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Awaiting Superchain Fusaka enablement upgrade</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Soneium</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L2 (OP Stack)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Pending</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Awaiting Superchain Fusaka enablement upgrade</td>
                                </tr>
                                <tr className="border-b border-dark_border border-opacity-20">
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Polygon PoS</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L1 (sidechain)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Pending</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Madhugiri (Dec 2025) and Giugliano (Apr 2026) added some Fusaka EIPs; CLZ not yet included</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4 font-mono text-primary whitespace-nowrap">Linea</td>
                                    <td className="py-2 px-4 font-mono text-muted text-opacity-95 whitespace-nowrap">L2 (zkEVM)</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95 whitespace-nowrap">Pending</td>
                                    <td className="py-2 px-4 text-muted text-opacity-95">Targeting Type-1 EVM equivalence; CLZ depends on prover support</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-sm font-medium text-muted text-opacity-60 mt-6">
                        Don&apos;t see a chain you need? Open an issue on{" "}
                        <a href="https://github.com/MerkleBlue/defimath/issues" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub</a>{" "}
                        and we&apos;ll verify and add it.
                    </p>
                </div>
            </section>
        </main>
    );
}
