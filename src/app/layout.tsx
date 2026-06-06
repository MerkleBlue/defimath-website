import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AnalyticsPageviews } from "@/components/AnalyticsPageviews";
import Aoscompo from "@/utils/aos";
import Script from "next/script";
const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://defimath.com"),
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "DeFiMath",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@defi_math",
    creator: "@defi_math",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Umami sends beacons to gateway.umami.is — preconnect saves ~300ms on LCP path. */}
        <link rel="preconnect" href="https://gateway.umami.is" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cloud.umami.is" crossOrigin="anonymous" />

        {/* GA4 — tiny stub runs immediately so window.gtag exists for click handlers.
            The 155 KiB library is deferred and processes queued events when it arrives. */}
        <Script id="gtag-stub" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);};
            gtag('js', new Date());
            gtag('config', 'G-NK671MJFPG');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NK671MJFPG"
          strategy="lazyOnload"
        />

        {/* Umami */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="f5364deb-2e8a-4fd6-8978-9e24033f7c7e"
          strategy="afterInteractive"
        />
      </head>

      <body className={`${font.className}`}>
        <Aoscompo>
          <Header />
          {children}
          <Footer />
        </Aoscompo>
        <ScrollToTop />
        <AnalyticsPageviews />
      </body>
    </html>
  );
}
