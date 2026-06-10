import { ReactNode } from "react";
import { codeToHtml } from "shiki";
import { JsonLd } from "@/components/JsonLd";

type FaqItem = {
  question: string;
  /** Rendered on the page (rich JSX — links, inline code). */
  answer: ReactNode;
  /** Plain text version of the answer for the FAQPage schema. */
  answerText: string;
};

const FAQ = async () => {
  // Pre-render the install-snippet import line with shiki (same VS Code "github-dark"
  // theme the docs CodeBlock uses) so it appears in proper Solidity colors.
  const importHtml = await codeToHtml(
    'import "defimath-lib/contracts/derivatives/Options.sol";',
    { lang: "solidity", theme: "github-dark" }
  );

  const FAQS: FaqItem[] = [
    {
      question: "Is DeFiMath right for me?",
      answer: (
        <>
          Yes if you&apos;re a Solidity dev whose contract needs more than add/multiply —
          square roots, logarithms, normal distributions, Black-Scholes, IRR. Common fits:
          on-chain derivatives, options DEXs, structured-product vaults, lending protocols with
          non-trivial interest math, risk engines doing real-time portfolio analytics.
        </>
      ),
      answerText:
        "Yes if you're a Solidity dev whose contract needs more than add/multiply — square roots, logarithms, normal distributions, Black-Scholes, IRR. Common fits: on-chain derivatives, options DEXs, structured-product vaults, lending protocols with non-trivial interest math, risk engines doing real-time portfolio analytics.",
    },
    {
      question: "Which Solidity version and EVM target does it require?",
      answer: (
        <>
          Solidity <code className="text-primary">^0.8.31</code> and{" "}
          <code className="text-primary">evmVersion: &quot;osaka&quot;</code>. The 0.8.31 floor is
          the first version to expose the <code className="text-primary">clz</code> Yul builtin
          (EIP-7939), which powers <code className="text-primary">sqrt</code>,{" "}
          <code className="text-primary">cbrt</code>, and{" "}
          <code className="text-primary">ln</code>. Add both to your{" "}
          <code className="text-primary">hardhat.config.js</code> /{" "}
          <code className="text-primary">foundry.toml</code>.
        </>
      ),
      answerText:
        'Solidity ^0.8.31 and evmVersion: "osaka". The 0.8.31 floor is the first version to expose the clz Yul builtin (EIP-7939), which powers sqrt, cbrt, and ln. Add both to your hardhat.config.js / foundry.toml.',
    },
    {
      question: "What use cases does this unlock?",
      answer: (
        <>
          On-chain Black-Scholes pricing on every quote, IV solving in a single transaction,
          real-time risk fees on vaults, kurtosis-adjusted VaR, IRR for fixed-income protocols
          — workflows that were previously off-chain workarounds because the math was too
          expensive.
        </>
      ),
      answerText:
        "On-chain Black-Scholes pricing on every quote, IV solving in a single transaction, real-time risk fees on vaults, kurtosis-adjusted VaR, IRR for fixed-income protocols — workflows that were previously off-chain workarounds because the math was too expensive.",
    },
    {
      question: "What's the license?",
      answer: (
        <>
          <span className="text-white font-semibold">MIT.</span> Use it commercially, fork it,
          embed it in proprietary contracts — no restrictions beyond preserving the copyright
          notice.
        </>
      ),
      answerText:
        "MIT. Use it commercially, fork it, embed it in proprietary contracts — no restrictions beyond preserving the copyright notice.",
    },
    {
      question: "How does it compare to PRBMath, ABDK, Solady?",
      answer: (
        <>
          <code className="text-primary">callOptionPrice</code> 2,729 vs Derivexyz 13,360 (~4.9×
          cheaper); <code className="text-primary">sqrt</code> 245 vs Solady 341;{" "}
          <code className="text-primary">ln</code> 375 vs Solady 518, PRBMath 6,901. Precision
          matches Solady within 1 ulp on the shared functions. Full reproducible benchmarks at{" "}
          <a
            href="https://github.com/MerkleBlue/defimath-compare"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            defimath-compare
          </a>
          .
        </>
      ),
      answerText:
        "callOptionPrice 2,729 vs Derivexyz 13,360 (~4.9× cheaper); sqrt 245 vs Solady 341; ln 375 vs Solady 518, PRBMath 6,901. Precision matches Solady within 1 ulp on the shared functions. Full reproducible benchmarks at github.com/MerkleBlue/defimath-compare.",
    },
    {
      question: "Will it work on Ethereum L2s?",
      answer: (
        <>
          Yes, on any L2 that has rolled forward to the Osaka hard fork (
          <code className="text-primary">CLZ</code> opcode availability). See{" "}
          <a href="/supported-chains" className="text-primary underline">
            supported chains
          </a>{" "}
          for the live list.
        </>
      ),
      answerText:
        "Yes, on any L2 that has rolled forward to the Osaka hard fork (CLZ opcode availability). See supported chains for the live list.",
    },
    {
      question: "Is the precision good enough for production?",
      answer: (
        <>
          Max relative error below <code className="text-primary">1e-12</code> on all math
          primitives, below <code className="text-primary">1e-10</code> on Black-Scholes option
          pricing. Every function is validated continuously against{" "}
          <code className="text-primary">simple-statistics</code>,{" "}
          <code className="text-primary">black-scholes</code>,{" "}
          <code className="text-primary">greeks</code>, and{" "}
          <code className="text-primary">math-erf</code> reference libraries. 100% test branch
          coverage.
        </>
      ),
      answerText:
        "Max relative error below 1e-12 on all math primitives, below 1e-10 on Black-Scholes option pricing. Every function is validated continuously against simple-statistics, black-scholes, greeks, and math-erf reference libraries. 100% test branch coverage.",
    },
    {
      question: "How do I install it?",
      answer: (
        <>
          <code className="text-primary">npm install defimath-lib</code>, then import the module
          you need:
          <span
            className="mt-3 block rounded-md bg-darkmode overflow-x-auto text-sm font-mono [&>pre]:!bg-transparent [&>pre]:px-3 [&>pre]:py-2"
            dangerouslySetInnerHTML={{ __html: importHtml }}
          />
          <a
            href="/docs#getting-started"
            className="mt-3 inline-block text-primary underline"
          >
            See getting started →
          </a>
        </>
      ),
      answerText:
        'npm install defimath-lib, then import the module you need: import "defimath-lib/contracts/derivatives/Options.sol"; See getting started at /docs#getting-started.',
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answerText,
      },
    })),
  };

  return (
    <section className="md:pt-20 md:pb-10 pt-10 pb-5" id="faq">
      <JsonLd data={faqSchema} />
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="text-center mb-12">
          <p className="text-primary sm:text-28 text-18 mb-3">FAQ</p>
          <h2 className="text-white sm:text-40 text-30 font-medium">
            Common questions
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-md border border-dark_border border-opacity-60 min-w-0"
            >
              <h3 className="text-primary text-xl font-semibold mb-3">
                {faq.question}
              </h3>
              <div className="text-muted text-opacity-95 text-base leading-relaxed">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
