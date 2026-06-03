"use client";

import { useTranslations } from "next-intl";
import type { Hotel } from "@/lib/types";
import { buildHotelAffiliateLinks } from "@burrowsoft/shared";
import { getRatingLabel } from "@/lib/data";
import { Price } from "./Price";

interface HotelCardProps {
  hotel:    Hotel;
  nights:   number;
  checkin:  string;
  checkout: string;
  guests:   number;
  rooms:    number;
  onSelect: (hotel: Hotel) => void;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <span aria-label={`${stars} stars`} className="text-amber-400 text-sm">
      {"★".repeat(stars)}
      {"☆".repeat(5 - stars)}
    </span>
  );
}

const AMENITY_ICONS: Record<string, string> = {
  "Free WiFi": "📶",
  "Swimming Pool": "🏊",
  "Fitness Center": "🏋️",
  Restaurant: "🍽️",
  "Spa & Wellness": "💆",
  "Room Service": "🛎️",
  "Bar / Lounge": "🍸",
  "Business Center": "💼",
  "Free Parking": "🅿️",
  "Airport Shuttle": "🚌",
};


function mapUrl(hotel: Hotel): string {
  if (hotel.latitude && hotel.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + " " + hotel.city)}`;
}

export function HotelCard({ hotel, nights, checkin, checkout, guests, rooms, onSelect }: HotelCardProps) {
  const t           = useTranslations("results");
  const ratingLabel = getRatingLabel(hotel.rating);

  return (
    <article className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Hotel photo — full-width on mobile, left thumbnail on desktop */}
      {hotel.photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hotel.photoUrl}
          alt={`${hotel.name} – hotel in ${hotel.city}`}
          className="w-full h-40 object-cover sm:w-32 sm:h-full sm:rounded-l-xl rounded-t-xl shrink-0"
        />
      )}

      <div className="flex flex-1 flex-col sm:flex-row gap-4 p-4">

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">{hotel.name}</h3>
              <div className="mt-0.5 flex items-center gap-2">
                <StarRating stars={hotel.stars} />
                <span className="text-xs text-slate-400">{hotel.address}, {hotel.city}</span>
              </div>
            </div>

            {/* Rating badge */}
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-lg bg-amber-600 px-2 py-1 text-sm font-bold text-white">
                {hotel.rating.toFixed(1)}
              </span>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-700">{ratingLabel}</p>
                <p className="text-xs text-slate-400">{hotel.reviewCount.toLocaleString()} reviews</p>
              </div>
            </div>
          </div>

          {/* Distance + map link */}
          <div className="mt-2 flex items-center gap-3">
            {hotel.distanceToCenter > 0 && (
              <p className="text-xs text-slate-500">
                📍 {hotel.distanceToCenter} km from city center
              </p>
            )}
            <a
              href={mapUrl(hotel)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-600 hover:underline"
            >
              {t("viewMap")}
            </a>
          </div>

          {/* Amenities */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 5).map((a) => (
              <span
                key={a}
                className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                <span>{AMENITY_ICONS[a] ?? "✓"}</span>
                {a}
              </span>
            ))}
          </div>

          {/* Badges */}
          <div className="mt-2 flex flex-wrap gap-2">
            {hotel.freeCancellation && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {t("freeCancellation")}
              </span>
            )}
            {hotel.breakfastIncluded && (
              <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                {t("breakfastIncluded")}
              </span>
            )}
          </div>
        </div>

        {/* Price + CTAs */}
        <div className="sm:w-52 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
          <div className="text-left sm:text-right">
            {hotel.originalPrice && (
              <p className="text-xs text-slate-400 line-through">
                <Price usd={hotel.originalPrice} />
              </p>
            )}
            <p className="text-2xl font-extrabold text-amber-600">
              <Price usd={hotel.pricePerNight} />
            </p>
            <p className="text-xs text-slate-400">{t("perNight")}</p>
            {nights > 1 && (
              <p className="text-xs font-medium text-slate-600">
                <Price usd={hotel.pricePerNight * nights} /> · {t("nights", { count: nights })}
              </p>
            )}
          </div>

          <div className="space-y-1.5 w-full">
            {hotel.roomsLeft <= 5 && (
              <p className="text-xs font-medium text-red-500 text-center">
                {t("roomsLeft", { count: hotel.roomsLeft })}
              </p>
            )}

            {/* Primary: open details modal */}
            <button
              onClick={() => onSelect(hotel)}
              className="block w-full rounded-xl bg-amber-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-amber-700 active:bg-amber-800 transition-colors"
            >
              {t("details")}
            </button>

            {/* Secondary: Expedia + Trip.com deep links */}
            <div className="flex gap-1.5">
              {buildHotelAffiliateLinks({ destination: hotel.city, checkin, checkout, guests, rooms, country: "" }).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  {link.name} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
