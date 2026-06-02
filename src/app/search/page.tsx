import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { HotelSearchForm } from "@/components/HotelSearchForm";
import { SearchResults } from "@/components/SearchResults";
import { generateHotels, getNights, ALL_CITIES } from "@/lib/data";
import { searchRealHotels } from "@/lib/hotels-api";
import { buildSearchMetadata } from "@/lib/seo";

interface SearchPageProps {
  searchParams: Promise<{
    destination?: string;
    checkin?: string;
    checkout?: string;
    guests?: string;
    rooms?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  if (!params.destination) {
    return { title: "Search Hotels", robots: { index: false, follow: true } };
  }
  return buildSearchMetadata(params.destination, params.checkin ?? "", params.checkout ?? "");
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const destination = params.destination ?? "Paris";
  const checkin  = params.checkin  ?? new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "";
  const checkout = params.checkout ?? new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0] ?? "";
  const guests   = Number(params.guests ?? "2");
  const rooms    = Number(params.rooms  ?? "1");
  const nights   = getNights(checkin, checkout);

  // Resolve country for this destination (used by API mapper)
  const destMeta = ALL_CITIES.find(
    (c) => c.city.toLowerCase() === destination.toLowerCase()
  );
  const country = destMeta?.country ?? "";

  // Try real API first; fall back to generated data if key is missing or call fails
  const realHotels = await searchRealHotels(destination, country, checkin, checkout, guests, rooms);
  const hotels = realHotels ?? generateHotels(destination, checkin);
  const isReal = realHotels !== null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-amber-600">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-slate-900 font-medium">{destination}</li>
        </ol>
      </nav>

      {/* Compact search form */}
      <div className="mb-8">
        <HotelSearchForm compact />
      </div>

      {/* Results heading */}
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-slate-900">
          Hotels in {destination}
          {checkin && checkout && (
            <span className="ml-2 text-base font-normal text-slate-500">
              · {checkin} – {checkout} · {nights} night{nights !== 1 ? "s" : ""}
            </span>
          )}
        </h1>
        {isReal && (
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
            ✓ Live prices from Booking.com
          </span>
        )}
      </div>

      <Suspense fallback={<div className="py-10 text-center text-slate-400">Loading hotels…</div>}>
        {hotels.length > 0 ? (
          <SearchResults
            hotels={hotels}
            destination={destination}
            checkin={checkin}
            checkout={checkout}
            nights={nights}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
            <p className="text-lg font-medium text-slate-400">No hotels found for this destination</p>
            <p className="mt-2 text-sm text-slate-400">Try a different city or dates</p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              Search again
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  );
}
