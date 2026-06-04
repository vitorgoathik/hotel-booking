import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HotelSearchForm } from "@/components/HotelSearchForm";
import { SearchPageClient } from "@/components/SearchPageClient";
import { HotelAffiliateLinks } from "@/components/HotelAffiliateLinks";
import { getNights, ALL_CITIES } from "@/lib/data";
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
  const params      = await searchParams;
  const destination = params.destination ?? "Paris";
  const checkin     = params.checkin  ?? new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "";
  const checkout    = params.checkout ?? new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0] ?? "";
  const guests      = Number(params.guests ?? "2");
  const rooms       = Number(params.rooms  ?? "1");
  const nights      = getNights(checkin, checkout);

  const destMeta = ALL_CITIES.find(
    (c) => c.city.toLowerCase() === destination.toLowerCase(),
  );
  const country = destMeta?.country ?? "";
  const t = await getTranslations("results");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-amber-600">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-slate-900 font-medium">{destination}</li>
        </ol>
      </nav>

      <div className="mb-8">
        <HotelSearchForm compact defaultDestination={destination} />
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">
          {t("hotelsIn", { destination })}
          {checkin && checkout && (
            <span className="ml-2 text-base font-normal text-slate-500">
              · {checkin} – {checkout} · {t("nights", { count: nights })}
            </span>
          )}
        </h1>
      </div>

      <SearchPageClient
        key={`${destination}-${checkin}-${checkout}-${guests}-${rooms}`}
        destination={destination}
        country={country}
        checkin={checkin}
        checkout={checkout}
        guests={guests}
        rooms={rooms}
        nights={nights}
      />

      <HotelAffiliateLinks
        key={`aff-${destination}-${checkin}-${checkout}`}
        destination={destination}
        checkin={checkin}
        checkout={checkout}
        guests={guests}
        rooms={rooms}
        country={country}
      />
    </div>
  );
}
