import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AnalyticsPageviews } from "@/components/AnalyticsPageviews";
import { GithubOutboundTracking } from "@/components/GithubOutboundTracking";
import Aoscompo from "@/utils/aos";
import Script from "next/script";
const font = DM_Sans({ subsets: ["latin"], display: "optional" });

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
        {/* Ahrefs Analytics sends beacons to analytics.ahrefs.com — preconnect saves ~300ms on LCP path. */}
        <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="anonymous" />

        {/* GA4 + Google Ads — single gtag.js handles both destinations. The stub runs
            immediately so window.gtag exists for click handlers; the 155 KiB library
            is deferred and processes queued events (incl. queued config calls) on arrival. */}
        <Script id="gtag-stub" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);};
            gtag('js', new Date());
            gtag('config', 'G-NK671MJFPG');   // GA4 — analytics
            gtag('config', 'AW-1058581148');  // Google Ads — conversion tracking

            // Google Ads outbound-click conversion helper (per Ads UI snippet).
            // Optional inline form: onclick="return gtag_report_conversion('https://…')".
            // Most outbound clicks are handled automatically by GithubOutboundTracking.
            window.gtag_report_conversion = function (url) {
              var callback = function () {
                if (typeof url != 'undefined') { window.location = url; }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-1058581148/bZxnCP3W6sYcEJzV4vgD',
                'event_callback': callback
              });
              return false;
            };
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NK671MJFPG"
          strategy="lazyOnload"
        />

        {/* Ahrefs Analytics — lightweight pageview tracking, no cookies. */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="ErxW5QEgtTiE79N0sfNfcA"
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
        <GithubOutboundTracking />
      </body>
    </html>
  );
}
