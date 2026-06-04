import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HotelSearchForm } from "@/components/HotelSearchForm";
import { Price } from "@/components/Price";
import { AdUnit } from "@/components/AdUnit";
import { POPULAR_DESTINATIONS } from "@/lib/data";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Compare & Book Hotels Worldwide`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

const features = [
  {
    icon: "🔍",
    title: "Compare Hundreds of Hotels",
    description:
      "We search Booking.com, Hotels.com, Agoda, and more simultaneously to find you the lowest prices.",
  },
  {
    icon: "💰",
    title: "Best Price Guarantee",
    description:
      "Found a lower price elsewhere? We'll match it. No hidden fees or booking charges.",
  },
  {
    icon: "✅",
    title: "Free Cancellation",
    description:
      "Most hotels offer free cancellation up to 24–48 hours before check-in. Book with confidence.",
  },
  {
    icon: "🌍",
    title: "2 Million+ Properties",
    description:
      "From budget hostels to 5-star luxury resorts — find the perfect stay for any trip.",
  },
];

const DESTINATION_EMOJIS: Record<string, string> = {
  paris: "🗼",
  "new-york": "🗽",
  tokyo: "🏯",
  london: "🎡",
  dubai: "🏙️",
  rome: "🏛️",
  barcelona: "⛩️",
  bali: "🌴",
  bangkok: "🛕",
  sydney: "🌉",
  singapore: "🦁",
  amsterdam: "🌷",
};

export default async function HomePage() {
  const featured = POPULAR_DESTINATIONS.slice(0, 8);
  const th = await getTranslations("hero");
  const ts = await getTranslations("stats");

  // Vercel sets x-vercel-ip-city automatically based on the user's IP
  const hdrs = await headers();
  const rawCity = hdrs.get("x-vercel-ip-city") ?? "";
  const userCity = rawCity ? decodeURIComponent(rawCity) : "";

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600 pb-24 pt-16"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <h1
            id="hero-heading"
            className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {th("title")} <br />
            <span className="text-amber-200">{th("titleAccent")}</span>
          </h1>
          <p className="mb-10 text-lg text-amber-100 sm:text-xl">
            {th("subtitle")}
          </p>
          <HotelSearchForm defaultDestination={userCity} />
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white" aria-label="Platform statistics">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "2M+",  key: "hotels"    },
              { value: "$0",   key: "fees"      },
              { value: "190+", key: "countries" },
              { value: "24/7", key: "support"   },
            ].map((stat) => (
              <div key={stat.key} className="text-center">
                <dt className="text-3xl font-extrabold text-amber-600">{stat.value}</dt>
                <dd className="mt-1 text-sm text-slate-500">{ts(stat.key as "hotels" | "fees" | "countries" | "support")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="mx-auto max-w-7xl px-4 py-14" aria-labelledby="destinations-heading">
        <h2 id="destinations-heading" className="mb-2 text-2xl font-bold text-slate-900">
          {th("popularDestinations")}
        </h2>
        <p className="mb-8 text-slate-500">
          {th("destinationsSubtitle")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((dest) => (
            <Link
              key={dest.slug}
              href={`/hotels/${dest.slug}`}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label={`Hotels in ${dest.city}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{DESTINATION_EMOJIS[dest.slug] ?? "🏨"}</span>
                <span className="text-xs text-slate-400">{dest.region}</span>
              </div>
              <p className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                {dest.city}
              </p>
              <p className="text-xs text-slate-400">{dest.country}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-xs text-slate-400">from</span>
                <span className="text-xl font-bold text-amber-600">
                  <Price usd={dest.minPrice} />
                </span>
                <span className="text-xs text-slate-400">/night</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {dest.hotelCount.toLocaleString()} hotels available
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-2">
        <AdUnit slot="HOME_BANNER_SLOT" format="horizontal" />
      </div>

      {/* Features */}
      <section className="bg-white py-14" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4">
          <h2 id="features-heading" className="mb-2 text-center text-2xl font-bold text-slate-900">
            Why Book with {SITE_NAME}?
          </h2>
          <p className="mb-10 text-center text-slate-500">
            We make finding and booking hotels simple, fast, and affordable.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-1 font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14" aria-labelledby="seo-content-heading">
        <h2 id="seo-content-heading" className="mb-4 text-xl font-bold text-slate-900">
          How to Find the Best Hotel Deals
        </h2>
        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-3">
          <p>
            Finding the best hotel prices doesn&apos;t have to be difficult. {SITE_NAME} searches
            across hundreds of booking platforms simultaneously, so you see all available options
            in one place.
          </p>
          <p>
            Booking in advance typically saves money — most hotels offer the lowest rates 30–60 days
            before check-in. For popular destinations like{" "}
            <Link href="/hotels/paris" className="text-amber-600 hover:underline">Paris</Link>,{" "}
            <Link href="/hotels/new-york" className="text-amber-600 hover:underline">New York</Link>, or{" "}
            <Link href="/hotels/tokyo" className="text-amber-600 hover:underline">Tokyo</Link>,
            we recommend booking at least 3–4 weeks in advance.
          </p>
          <p>
            Always look for hotels with free cancellation policies — they give you flexibility to cancel
            if your plans change. {SITE_NAME} highlights free cancellation options prominently in search results.
          </p>
        </div>
      </section>
    </>
  );
}
