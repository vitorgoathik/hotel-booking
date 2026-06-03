"use client";

import { useEffect, useReducer, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Hotel } from "@/lib/types";
import { getNights } from "@/lib/data";
import { buildHotelAffiliateLinks } from "@burrowsoft/shared";
import { useFormatPrice } from "./CurrencyProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewSnippet { text: string; score: number }
interface ReviewData    { score: number; count: number; snippets: ReviewSnippet[] }
interface RoomType {
  name: string; pricePerNight: number; currency: string;
  maxOccupancy: number; freeCancellation: boolean; breakfast: boolean;
}
interface HotelDetails {
  photos:    string[];
  reviews:   ReviewData | null;
  amenities: string[];
  rooms:     RoomType[];
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function Gallery({ photos, fallback, hotelName, city }: { photos: string[]; fallback?: string; hotelName?: string; city?: string }) {
  const [idx, setIdx] = useState(0);
  const all = photos.length > 0 ? photos : (fallback ? [fallback] : []);
  if (all.length === 0) return null;

  const clampedIdx = Math.min(idx, all.length - 1);
  const prev = () => setIdx((i) => (i - 1 + all.length) % all.length);
  const next = () => setIdx((i) => (i + 1) % all.length);

  return (
    <div className="-mx-6 -mt-5 mb-4">
      {/* Main image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={all[clampedIdx]}
          alt={hotelName && city ? `${hotelName} – ${city} hotel photo ${clampedIdx + 1}` : `Hotel photo ${clampedIdx + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        {all.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2.5 py-1 text-white text-lg leading-none hover:bg-black/60 transition-colors"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2.5 py-1 text-white text-lg leading-none hover:bg-black/60 transition-colors"
              aria-label="Next photo"
            >
              ›
            </button>
            <span className="absolute bottom-2 right-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
              {clampedIdx + 1} / {all.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {all.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto px-6 pt-2 pb-0.5">
          {all.map((url, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-11 w-16 shrink-0 overflow-hidden rounded transition-all ${
                i === clampedIdx ? "ring-2 ring-amber-500 opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={hotelName ? `${hotelName} photo thumbnail` : ""} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(stars)}{"☆".repeat(5 - stars)}
    </span>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 ${className ?? ""}`} />;
}

const AMENITY_ICONS: Record<string, string> = {
  "Free WiFi": "📶", WiFi: "📶", Internet: "📶",
  "Swimming Pool": "🏊", Pool: "🏊",
  "Fitness Center": "🏋️", Gym: "🏋️",
  Restaurant: "🍽️",
  "Spa & Wellness": "💆", Spa: "💆",
  "Room Service": "🛎️",
  "Bar / Lounge": "🍸", Bar: "🍸",
  "Business Center": "💼",
  "Free Parking": "🅿️", Parking: "🅿️",
  "Airport Shuttle": "🚌",
  "Air conditioning": "❄️",
  Breakfast: "☕",
  "Non-smoking rooms": "🚭",
  Elevator: "🛗",
  Safe: "🔒",
};

function amenityIcon(name: string) { return AMENITY_ICONS[name] ?? "✓"; }

// ─── Inner modal (needs Suspense for useSearchParams) ─────────────────────────

function ModalInner({ hotel, onClose }: { hotel: Hotel; onClose: () => void }) {
  const fmt          = useFormatPrice();
  const t            = useTranslations("modal");
  const searchParams = useSearchParams();

  const checkin  = searchParams.get("checkin")  ?? new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "";
  const checkout = searchParams.get("checkout") ?? new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0] ?? "";
  const guests   = Number(searchParams.get("guests") ?? "2");
  const rooms    = Number(searchParams.get("rooms")  ?? "1");
  const nights   = getNights(checkin, checkout);

  // Lazy-load hotel details on modal open
  const [details,        setDetails]        = useState<HotelDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  // Force-rerender trick so Gallery resets when API photos arrive
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    if (!hotel.bookingComId) { setDetailsLoading(false); return; }
    const params = new URLSearchParams({
      hotel_id: String(hotel.bookingComId),
      checkin,
      checkout,
      adults: String(guests),
      rooms:  String(rooms),
    });
    fetch(`/api/hotel-details?${params}`)
      .then((r) => r.json())
      .then((d) => { setDetails(d as HotelDetails); forceUpdate(); })
      .catch(() => {})
      .finally(() => setDetailsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel.bookingComId]);

  // Prefer API photos, fall back to search-result photos
  const apiPhotos    = details?.photos ?? [];
  const searchPhotos = hotel.photos ?? (hotel.photoUrl ? [hotel.photoUrl] : []);
  const galleryPhotos = apiPhotos.length >= searchPhotos.length ? apiPhotos : searchPhotos;

  // Amenities: prefer richer API data
  const displayAmenities = (details?.amenities?.length ?? 0) > 0
    ? details!.amenities
    : hotel.amenities;

  // Cheapest room from API → update displayed price
  const cheapestRoom  = details?.rooms?.[0];
  const displayPrice  = cheapestRoom?.pricePerNight ?? hotel.pricePerNight;
  const subtotal      = displayPrice * nights;
  const taxes         = Math.round(subtotal * 0.14);
  const total         = subtotal + taxes;

  const isReal  = !!hotel.bookingComId;
  const affiliateLinks = buildHotelAffiliateLinks({
    destination: hotel.city,
    checkin,
    checkout,
    guests,
    rooms,
    country: "",
  });

  // Keyboard / scroll lock
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative flex w-full max-w-3xl flex-col rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl max-h-[92dvh] sm:max-h-[90vh]">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-6 py-4">
          <h2 id="modal-title" className="text-lg font-bold text-slate-900">{t("title")}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >✕</button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col md:flex-row min-h-0 flex-1 overflow-hidden">

          {/* ── Left: hotel details ── */}
          <div className="overflow-y-auto px-6 py-5 space-y-4 md:w-[52%] md:border-r border-slate-100 shrink-0">

            {/* Gallery (key resets idx when photos change) */}
            <Gallery
              key={galleryPhotos.length}
              photos={galleryPhotos}
              fallback={hotel.photoUrl}
              hotelName={hotel.name}
              city={hotel.city}
            />

            {/* Name + stars */}
            <div>
              <p className="font-bold text-slate-900 text-base leading-tight">{hotel.name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <StarRating stars={hotel.stars} />
                <span className="text-xs text-slate-400">{hotel.address}, {hotel.city}</span>
              </div>
            </div>

            {/* Stay dates */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">{checkin}</p>
                <p className="text-xs text-slate-400">{t("checkin")}</p>
              </div>
              <div className="flex flex-1 flex-col items-center gap-1">
                <p className="text-xs text-slate-400">{t("nights", { count: nights })}</p>
                <div className="h-px w-full bg-slate-300" />
                <p className="text-xs text-slate-500">{t("guests", { count: guests })} · {t("rooms", { count: rooms })}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">{checkout}</p>
                <p className="text-xs text-slate-400">{t("checkout")}</p>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 rounded-xl border border-slate-100 px-4 py-3">
              {hotel.originalPrice && (
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{t("originalPrice")}</span>
                  <span className="line-through">{fmt(hotel.originalPrice)} / night</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-600">
                <span>{fmt(displayPrice)} × {t("nights", { count: nights })}</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t("taxes")}</span>
                <span>{fmt(taxes)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>{t("total")}</span>
                <span className="text-base">{fmt(total)}</span>
              </div>
              {isReal && (
                <p className="text-xs text-emerald-600">{t("liveConfirm")}</p>
              )}
              {cheapestRoom && (
                <p className="text-xs text-slate-400">{t("cheapestRoom")}</p>
              )}
            </div>

            {/* Amenities */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("amenities")}</p>
              {detailsLoading ? (
                <div className="flex flex-wrap gap-1.5">
                  {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-6 w-20" />)}
                </div>
              ) : displayAmenities.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {displayAmenities.slice(0, 12).map((a) => (
                    <span key={a} className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      <span>{amenityIcon(a)}</span>{a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">{t("noAmenities")}</p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {hotel.freeCancellation && (
                <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">✓ Free cancellation</span>
              )}
              {hotel.breakfastIncluded && (
                <span className="rounded-md bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">☕ Breakfast included</span>
              )}
            </div>

            {/* Reviews */}
            {detailsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : details?.reviews ? (
              <div className="rounded-xl border border-slate-100 px-4 py-3 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-amber-600 px-2.5 py-1 text-sm font-bold text-white">
                    {details.reviews.score.toFixed(1)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t("reviews")}</p>
                    <p className="text-xs text-slate-400">
                      {t("verifiedReviews", { count: details.reviews.count.toLocaleString() })}
                    </p>
                  </div>
                  {/* Score bar */}
                  <div className="ml-auto flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-base ${
                          i < Math.round(details.reviews!.score / 2) ? "text-amber-400" : "text-slate-200"
                        }`}
                      >★</span>
                    ))}
                  </div>
                </div>
                {details.reviews.snippets.length > 0 && (
                  <ul className="space-y-2 border-t border-slate-50 pt-2">
                    {details.reviews.snippets.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-xs text-amber-400">★</span>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          "{s.text}"
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            {hotel.roomsLeft <= 5 && (
              <p className="text-sm font-medium text-red-500">
                ⚡ Only {hotel.roomsLeft} room{hotel.roomsLeft > 1 ? "s" : ""} left
              </p>
            )}
          </div>

          {/* ── Right: room types + booking options ── */}
          <div className="flex flex-col px-5 py-5 md:flex-1 border-t border-slate-100 md:border-t-0 overflow-y-auto gap-4">

            {/* Room types */}
            {detailsLoading ? (
              <div>
                <Skeleton className="mb-3 h-4 w-28" />
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ) : (details?.rooms?.length ?? 0) > 0 ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("availableRooms")}</p>
                <div className="space-y-2">
                  {details!.rooms.slice(0, 5).map((room, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border px-3 py-2.5 transition-colors ${
                        i === 0 ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                            {room.name}
                          </p>
                          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                            <span className="text-xs text-slate-500">{t("upTo", { count: room.maxOccupancy })}</span>
                            {room.freeCancellation && (
                              <span className="text-xs text-emerald-600">{t("freeCancel")}</span>
                            )}
                            {room.breakfast && (
                              <span className="text-xs text-sky-600">{t("breakfast")}</span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-base font-bold text-amber-600">
                            {fmt(room.pricePerNight)}
                          </p>
                          <p className="text-xs text-slate-400">/ night</p>
                        </div>
                      </div>
                      {i === 0 && (
                        <span className="mt-1.5 inline-block rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                          {t("bestPrice")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}


            {/* Other platforms */}
            {affiliateLinks.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {t("otherPlatforms")}
                </p>
                <div className="overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {affiliateLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-800">{link.name}</span>
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                        {t("searchLink")}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-xs text-slate-400">
              {isReal ? t("liveNote") : t("searchNote", { city: hotel.city })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export function BookingModal(props: { hotel: Hotel; onClose: () => void }) {
  return (
    <Suspense fallback={null}>
      <ModalInner {...props} />
    </Suspense>
  );
}
