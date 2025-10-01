
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Terms of use | DefiMath",
    description: "Terms of use for DefiMath",
};

export default function Page() {
    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-xl px-4">

                    <h1 className="font-medium lg:text-56 md:text-50 text-54 lg:text-start text-center text-white mb-10">
                        Terms of Use
                    </h1>

                    <h2 className="font-medium lg:text-36 md:text-30 text-24 lg:text-start text-center text-white mb-10 mt-10">1. Who we are</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        DeFiMath is an open-source project that provides Solidity math and DeFi
                        primitives. The website and code are offered for informational and
                        educational purposes only.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">2. Acceptance of Terms</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        By accessing the site or using the software, you agree to these Terms.
                        If you do not agree, do not use the site or the software.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">3. Open-Source License (MIT)</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        DeFiMath libraries are released under the MIT License. Your rights and
                        obligations for the code are governed solely by that license. Where
                        there is any conflict between these Terms and the MIT License, the MIT
                        License controls for the code.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">4. No Financial or Legal Advice</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        Nothing on this site or in the repositories constitutes financial, legal,
                        or investment advice. You are solely responsible for your use of any
                        code or information.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">5. Blockchain &amp; Risk Disclosure</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        Interacting with blockchain networks involves risk, including loss of
                        funds. You assume all risks related to deploying or integrating the
                        software.
                    </p>
                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">6. Acceptable Use</h2>
                    <ul className="text-base font-medium text-muted text-opacity-95">
                        <li>No use that violates laws or regulations.</li>
                        <li>No reverse-engineering or misuse of the site infrastructure.</li>
                        <li>No attempts to breach security or disrupt service.</li>
                    </ul>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">7. Intellectual Property</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        Trademarks, logos, and site content (excluding open-source code under
                        MIT) may be protected by copyright and trademark laws. You may not use
                        them without permission.
                    </p>
                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">8. Disclaimer of Warranties</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        THE SITE AND SOFTWARE ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT
                        WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
                        FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. 
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">9. Limitation of Liability</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL WE BE LIABLE
                        FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                        DAMAGES, OR ANY LOSS OF PROFITS OR DATA, ARISING FROM OR RELATED TO YOUR
                        USE OF THE SITE OR SOFTWARE.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">10. Third-Party Services</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        We may link to or integrate third-party services (e.g., analytics,
                        mailing-list providers). Their terms and privacy practices apply to
                        their services.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">11. Changes</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        We may update these Terms from time to time. Continued use after changes
                        become effective constitutes acceptance of the updated Terms.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 lg:text-start text-center text-white mb-10 mt-10">12. Contact</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        Questions? Reach out on X (Twitter): <strong>@defi_math</strong>
                        {" "}or see our{" "}
                        <a href="/privacy/">Privacy Policy</a>.
                    </p>
                </div>
            </section>
        </main>
    );
};
