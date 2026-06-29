
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Privacy Policy | DefiMath",
    description: "DeFiMath Privacy Policy from MerkleBlue: what we collect (analytics, optional mailing list), cookies, your rights, data retention, and how to contact us.",
    alternates: { canonical: "/privacy/" },
};

export default function Page() {
    return (
        <main>
            <section className="relative md:pt-40 md:pb-28 pt-32 pb-20 overflow-hidden z-1" id="main-banner">
                <div className="container mx-auto lg:max-w-screen-md px-4">

                    <h1 className="font-medium lg:text-54 md:text-44 text-40 lg:text-start text-center text-white mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-sm font-medium text-muted text-opacity-60 lg:text-start text-center mb-10">
                        Last updated: May 25, 2026
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-24 text-white mb-10 mt-10">1. Summary</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        DeFiMath is operated by <strong>MerkleBlue</strong> (&quot;we&quot;, &quot;us&quot;).
                        We keep things minimal: we use privacy-respecting defaults, collect only
                        what we need to operate the website (basic analytics) and, if you opt in,
                        your email for our mailing list.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">2. What we collect</h2>
                    <ul className="text-base font-medium text-muted text-opacity-95">
                        <li>
                        <strong>Analytics data</strong> (via Google Analytics): page views,
                        device/browser info, approximate location (based on IP), and events
                        like clicks. We use this to understand site usage and improve content.
                        </li>
                        <li>
                        <strong>Mailing list email</strong> (optional): if you subscribe, we
                        store your email with our email service provider purely to send
                        updates about DeFiMath. You can unsubscribe anytime.
                        </li>
                        <li>
                        <strong>Server logs</strong>: standard web logs for security and
                        diagnostics.
                        </li>
                    </ul>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">3. Cookies &amp; similar tech</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        Analytics may set cookies or use similar identifiers. You can block or
                        delete cookies in your browser. Google also provides an Analytics opt-out
                        add-on.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">4. Legal bases (where applicable)</h2>
                    <ul className="text-base font-medium text-muted text-opacity-95">
                        <li><strong>Legitimate interests</strong> for basic analytics and site security.</li>
                        <li><strong>Consent</strong> for sending you the mailing list.</li>
                    </ul>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">5. How we use your data</h2>
                    <ul className="text-base font-medium text-muted text-opacity-95">
                        <li>Operate, secure, and improve the site.</li>
                        <li>Measure content performance (aggregate statistics).</li>
                        <li>Send newsletter updates if you opted in.</li>
                    </ul>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">6. Sharing &amp; transfers</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        We share personal data with service providers only as needed to operate
                        the site (e.g., Google Analytics; an email provider for the mailing
                        list). These providers may process data in other countries and use
                        safeguards such as Standard Contractual Clauses.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">7. Data retention</h2>
                    <ul className="text-base font-medium text-muted text-opacity-95">
                        <li>Analytics data is retained per your analytics provider’s defaults.</li>
                        <li>Mailing list emails are kept until you unsubscribe or we delete the list.</li>
                        <li>Server logs are kept for a limited period for security/diagnostics.</li>
                    </ul>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">8. Your rights</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        Depending on your location, you may have rights to access, correct,
                        delete, or restrict processing of your personal data, and to withdraw
                        consent for the mailing list at any time (without affecting prior lawful
                        processing).
                    </p>
                    <p className="text-base font-medium text-muted text-opacity-95 mt-4">
                        <strong>California residents (CCPA/CPRA):</strong> in addition to the
                        rights above, you have the right to opt out of the &quot;sale&quot; or
                        &quot;sharing&quot; of personal information. We do not sell personal
                        information; analytics data shared with Google may qualify as
                        &quot;sharing&quot; for advertising purposes under CPRA - to
                        opt out, use the Google Analytics opt-out add-on or contact us.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">9. Children</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        The site is not directed to children under 16, and we do not knowingly
                        collect their personal data.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">10. Changes</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        We may update this Policy from time to time. Material changes will be
                        reflected by updating the “Last updated” date above.
                    </p>

                    <h2 className="font-medium lg:text-36 md:text-30 text-34 text-white mb-10 mt-10">11. Contact</h2>
                    <p className="text-base font-medium text-muted text-opacity-95">
                        Privacy questions or requests? Reach out on X (Twitter):{" "}
                        <strong>@defi_math</strong>.
                    </p>
                </div>
            </section>
        </main>
    );
};
