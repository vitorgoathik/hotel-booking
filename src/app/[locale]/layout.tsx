import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { headers } from "next/headers";
import {
  Sarabun,
  Noto_Sans_JP,
  Noto_Sans_SC,
  Noto_Sans_TC,
  Noto_Sans_KR,
  Noto_Sans_Arabic,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, websiteJsonLd } from "@/lib/seo";
import { getCurrencyForCountry } from "@/lib/currency";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { detectCountry, getCountryName, AppHeader, AppFooter } from "@burrowsoft/shared";
import { Link } from "@/i18n/navigation";
import { LocaleSelector } from "@/components/LocaleSelector";
import { routing } from "@/i18n/routing";
import "../globals.css";

const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"], variable: "--font-sarabun", display: "swap" });
const notoJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-jp", display: "swap" });
const notoSC = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-sc", display: "swap" });
const notoTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-tc", display: "swap" });
const notoKR = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-kr", display: "swap" });
const notoAR = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-noto-ar", display: "swap" });

const LOCALE_FONT_CLASS: Record<string, string> = {
  th: sarabun.className,
  ja: notoJP.className,
  zh: notoSC.className,
  "zh-TW": notoTC.className,
  ko: notoKR.className,
  ar: notoAR.className,
};

const BASE = "https://www.bookingmole.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const hdrs = await headers();
  const country = detectCountry(Object.fromEntries(hdrs.entries()));
  const countryName = getCountryName(country);
  const desc = `Clean Search. NO ADS. No sign-up. Looking for hotels in ${countryName}? BookingMole compares Booking.com, Agoda & more. No hidden fees. Best deals in seconds.`;

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, l === "en" ? `${BASE}/` : `${BASE}/${l}/`])
  );
  languages["x-default"] = `${BASE}/`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `Hotel Search in ${countryName} — Booking Mole`,
      template: `%s | Booking Mole`,
    },
    description: desc,
    keywords: ["cheap hotels","book hotels","compare hotels","hotel deals","hotel booking","best hotel prices","discount hotels","last minute hotels","vacation rentals"],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    openGraph: {
      type: "website",
      locale: locale.replace("-", "_"),
      url: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      siteName: SITE_NAME,
      title: `Hotel Search in ${countryName} — Booking Mole`,
      description: desc,
    },
    twitter: {
      card: "summary_large_image",
      title: `Hotel Search in ${countryName} — Booking Mole`,
      description: desc,
    },
    alternates: {
      canonical: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      languages,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d97706",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const hdrs = await headers();
  const country = detectCountry(Object.fromEntries(hdrs.entries()));
  const currency = getCurrencyForCountry(country);
  const messages = await getMessages();
  const t = await getTranslations("nav");
  const fontClass = LOCALE_FONT_CLASS[locale] ?? "";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <meta name="agd-partner-manual-verification" />
        <meta name="fo-verify" content="91de7d61-bf02-4b4c-b125-02ec4fa89211" />
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
      <body className={`min-h-screen bg-slate-50 text-slate-900 antialiased ${fontClass}`}>
        <NextIntlClientProvider messages={messages}>
          <AppHeader
            logo={
              <Link href="/" className="flex items-center gap-2">
                <Image src="/booking.png" alt={SITE_NAME} width={40} height={40} className="shrink-0" priority />
                <span className="text-xl font-bold text-amber-600">{SITE_NAME}</span>
              </Link>
            }
            right={
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
                  <Link href="/hotels/paris" className="hover:text-amber-600 transition-colors">
                    {t("popularDestinations")}
                  </Link>
                  <Link href="/search?destination=Paris&checkin=2025-12-25&checkout=2025-12-28&guests=2&rooms=1" className="hover:text-amber-600 transition-colors">
                    {t("deals")}
                  </Link>
                </div>
                <LocaleSelector />
              </div>
            }
          />

          <CurrencyProvider currency={currency}>
            <main>{children}</main>
          </CurrencyProvider>

          <AppFooter
            supportEmail="support@bookingmole.com"
            accentHoverClass="hover:text-amber-600"
            currentSite="BookingMole"
          >
            <div className="grid grid-cols-2 gap-8 pb-4 sm:grid-cols-3">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {t("popularDestinations")}
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
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Help</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><span className="text-slate-400">Cancellation policy</span></li>
                  <li><span className="text-slate-400">Travel insurance</span></li>
                  <li><span className="text-slate-400">Group bookings</span></li>
                </ul>
              </div>
            </div>
          </AppFooter>

          {/* <RegionalFloatingAd /> — archived: No Ads campaign */}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
