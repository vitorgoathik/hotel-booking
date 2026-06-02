import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, websiteJsonLd } from "@/lib/seo";
import { getCurrencyForCountry } from "@/lib/currency";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { detectCountry } from "@burrowsoft/shared";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Compare & Book Hotels Worldwide`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "cheap hotels",
    "book hotels",
    "compare hotels",
    "hotel deals",
    "hotel booking",
    "best hotel prices",
    "discount hotels",
    "last minute hotels",
    "vacation rentals",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Compare & Book Hotels Worldwide`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Compare & Book Hotels Worldwide`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d97706",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const hdrs = await headers();
  const country = detectCountry(Object.fromEntries(hdrs.entries()));
  const currency = getCurrencyForCountry(country);

  return (
    <html lang="en">
      <head>
        <meta name="agd-partner-manual-verification" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
            aria-label="Main navigation"
          >
            <Link href="/" className="flex items-center gap-2 font-bold text-amber-600 text-xl">
              <span aria-hidden>🏨</span>
              {SITE_NAME}
            </Link>
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/hotels/paris" className="hover:text-amber-600 transition-colors">
                Popular Destinations
              </Link>
              <Link
                href="/search?destination=Paris&checkin=2025-12-25&checkout=2025-12-28&guests=2&rooms=1"
                className="hover:text-amber-600 transition-colors"
              >
                Deals
              </Link>
            </div>
          </nav>
        </header>

        <CurrencyProvider currency={currency}>
          <main>{children}</main>
        </CurrencyProvider>

        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Popular Destinations
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><Link href="/hotels/paris" className="hover:text-amber-600">Hotels in Paris</Link></li>
                  <li><Link href="/hotels/new-york" className="hover:text-amber-600">Hotels in New York</Link></li>
                  <li><Link href="/hotels/tokyo" className="hover:text-amber-600">Hotels in Tokyo</Link></li>
                  <li><Link href="/hotels/london" className="hover:text-amber-600">Hotels in London</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  More Destinations
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><Link href="/hotels/dubai" className="hover:text-amber-600">Hotels in Dubai</Link></li>
                  <li><Link href="/hotels/bali" className="hover:text-amber-600">Hotels in Bali</Link></li>
                  <li><Link href="/hotels/barcelona" className="hover:text-amber-600">Hotels in Barcelona</Link></li>
                  <li><Link href="/hotels/singapore" className="hover:text-amber-600">Hotels in Singapore</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Help
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><span className="text-slate-400">Cancellation policy</span></li>
                  <li><span className="text-slate-400">Travel insurance</span></li>
                  <li><span className="text-slate-400">Group bookings</span></li>
                  <li><a href="mailto:support@bookingmole.com" className="hover:text-amber-600 transition-colors">support@bookingmole.com</a></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-600">{SITE_NAME}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Compare hundreds of hotels worldwide. No hidden fees.
                </p>
              </div>
            </div>

            {/* BurrowSoft family */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href="https://burrowsoft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span className="text-lg" aria-hidden>🦔</span>
                  <span className="text-sm font-bold tracking-tight">BurrowSoft</span>
                </a>
                <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                  <li><a href="https://flymole.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">FlyMole</a></li>
                  <li><a href="https://insightmole.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">InsightMole</a></li>
                  <li><a href="https://rentacarmole.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">RentACarMole</a></li>
                  <li><a href="https://gamesmole.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">GamesMole</a></li>
                  <li><a href="https://shoppingmole.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">ShoppingMole</a></li>
                </ul>
                <p className="text-xs text-slate-400">© 2025 BurrowSoft. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
