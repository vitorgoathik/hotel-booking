import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HotelSearchForm } from "@/components/HotelSearchForm";
import { SearchResults } from "@/components/SearchResults";
import { AdUnit } from "@/components/AdUnit";
import { Price } from "@/components/Price";
import { POPULAR_DESTINATIONS, generateHotels, getNights } from "@/lib/data";
import {
  SITE_NAME,
  SITE_URL,
  buildDestinationMetadata,
  breadcrumbJsonLd,
  hotelDestinationJsonLd,
  getAllDestinationSlugs,
} from "@/lib/seo";

interface Props {
  params: Promise<{ destination: string }>;
}

export async function generateStaticParams() {
  return getAllDestinationSlugs().map((slug) => ({ destination: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination: slug } = await params;
  const dest = POPULAR_DESTINATIONS.find((d) => d.slug === slug);
  if (!dest) return { title: "Hotels", robots: { index: false, follow: true } };
  return buildDestinationMetadata(dest.city, dest.country, dest.minPrice);
}

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

const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "";
const threeDaysLater = new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0] ?? "";

export default async function DestinationPage({ params }: Props) {
  const { destination: slug } = await params;
  const dest = POPULAR_DESTINATIONS.find((d) => d.slug === slug);
  if (!dest) notFound();

  const hotels = generateHotels(dest.city, tomorrow);
  const nights = getNights(tomorrow, threeDaysLater);

  const minPrice = Math.min(...hotels.map((h) => h.pricePerNight));
  const maxRating = Math.max(...hotels.map((h) => h.rating));
  const fiveStarCount = hotels.filter((h) => h.stars === 5).length;
  const freeCancelCount = hotels.filter((h) => h.freeCancellation).length;

  const relatedDestinations = POPULAR_DESTINATIONS.filter((d) => d.slug !== slug).slice(0, 4);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: `Hotels in ${dest.city}`, url: `${SITE_URL}/hotels/${slug}` },
  ]);

  const destinationLd = hotelDestinationJsonLd(dest.city, dest.country, minPrice);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600 pb-16 pt-12">
        <div className="mx-auto max-w-5xl px-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-amber-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white font-medium">Hotels in {dest.city}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{DESTINATION_EMOJIS[slug] ?? "🏨"}</span>
            <div>
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Hotels in {dest.city}
              </h1>
              <p className="text-amber-200 mt-1">
                {dest.country} · {dest.hotelCount.toLocaleString()} hotels available
              </p>
            </div>
          </div>

          <HotelSearchForm />
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white" aria-label="Destination statistics">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <dt className="text-2xl font-extrabold text-amber-600">
                <Price usd={minPrice} />
              </dt>
              <dd className="mt-0.5 text-xs text-slate-500">Cheapest per night</dd>
            </div>
            <div className="text-center">
              <dt className="text-2xl font-extrabold text-amber-600">{maxRating.toFixed(1)}</dt>
              <dd className="mt-0.5 text-xs text-slate-500">Highest rating</dd>
            </div>
            <div className="text-center">
              <dt className="text-2xl font-extrabold text-amber-600">{fiveStarCount}</dt>
              <dd className="mt-0.5 text-xs text-slate-500">5-star hotels</dd>
            </div>
            <div className="text-center">
              <dt className="text-2xl font-extrabold text-amber-600">{freeCancelCount}</dt>
              <dd className="mt-0.5 text-xs text-slate-500">Free cancellation</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Hotel list */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Available Hotels in {dest.city}
        </h2>
        <SearchResults
          hotels={hotels}
          destination={dest.city}
          checkin={tomorrow}
          checkout={threeDaysLater}
          nights={nights}
        />
      </div>

      {/* Ad */}
      <div className="mx-auto max-w-5xl px-4 py-2">
        <AdUnit slot="DESTINATION_BANNER_SLOT" format="horizontal" />
      </div>

      {/* SEO content */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          About Hotels in {dest.city}
        </h2>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            {dest.city} is one of the world&apos;s most popular travel destinations, offering
            accommodation options for every budget. From charming boutique hotels in historic
            neighborhoods to luxury 5-star resorts, {dest.city} has something for every traveler.
          </p>
          <p>
            When booking a hotel in {dest.city}, consider the location relative to the sights you
            plan to visit. Staying in the city center often commands a premium but can save time
            and money on transportation. Rooms in {dest.city} start at around{" "}
            <strong>
              <Price usd={minPrice} />
              /night
            </strong>{" "}
            for budget options, with luxury properties available for significantly more.
          </p>
          <p>
            {SITE_NAME} searches across Booking.com, Hotels.com, Agoda, and more to find you the
            best available rates in {dest.city}. Use the filters above to narrow results by star
            rating, price, and amenities. Many hotels in {dest.city} offer free cancellation —
            look for the green badge when searching.
          </p>
        </div>
      </section>

      {/* Related destinations */}
      <section className="mx-auto max-w-7xl px-4 py-8 border-t border-slate-200">
        <h2 className="mb-6 text-lg font-bold text-slate-900">Related Destinations</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {relatedDestinations.map((d) => (
            <Link
              key={d.slug}
              href={`/hotels/${d.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-4 text-center hover:border-amber-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{DESTINATION_EMOJIS[d.slug] ?? "🏨"}</span>
              <p className="mt-1 text-sm font-medium text-slate-800 group-hover:text-amber-600 transition-colors">
                {d.city}
              </p>
              <p className="text-xs text-slate-400">
                from <Price usd={d.minPrice} />/night
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
