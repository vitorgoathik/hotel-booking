"use client";

import { useState, useMemo } from "react";
import type { Hotel, SortOption } from "@/lib/types";
import { HotelCard } from "./HotelCard";
import { BookingModal } from "./BookingModal";
import { AdUnit } from "./AdUnit";

interface Props {
  hotels: Hotel[];
  destination: string;
  checkin: string;
  checkout: string;
  nights: number;
}

const AMENITY_FILTERS = [
  "Free WiFi",
  "Swimming Pool",
  "Fitness Center",
  "Restaurant",
  "Spa & Wellness",
  "Free Parking",
];

export function SearchResults({ hotels, destination, checkin, checkout, nights }: Props) {
  const [selected, setSelected] = useState<Hotel | null>(null);
  const [sort, setSort] = useState<SortOption>("price");
  const [maxPrice, setMaxPrice] = useState(500);
  const [starFilter, setStarFilter] = useState<Set<number>>(new Set());
  const [amenityFilter, setAmenityFilter] = useState<Set<string>>(new Set());
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);

  const maxAvailable = useMemo(
    () => Math.max(...hotels.map((h) => h.pricePerNight), 100),
    [hotels]
  );

  function toggleStar(s: number) {
    setStarFilter((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  }

  function toggleAmenity(a: string) {
    setAmenityFilter((prev) => {
      const next = new Set(prev);
      next.has(a) ? next.delete(a) : next.add(a);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      if (h.pricePerNight > maxPrice) return false;
      if (starFilter.size > 0 && !starFilter.has(h.stars)) return false;
      if (amenityFilter.size > 0) {
        for (const a of amenityFilter) {
          if (!h.amenities.includes(a)) return false;
        }
      }
      if (freeCancelOnly && !h.freeCancellation) return false;
      return true;
    });
  }, [hotels, maxPrice, starFilter, amenityFilter, freeCancelOnly]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price": return a.pricePerNight - b.pricePerNight;
        case "rating": return b.rating - a.rating;
        case "stars": return b.stars - a.stars;
        case "distance": return a.distanceToCenter - b.distanceToCenter;
        default: return 0;
      }
    });
  }, [filtered, sort]);

  return (
    <>
      {selected && (
        <BookingModal hotel={selected} onClose={() => setSelected(null)} />
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-6">
            {/* Price range */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">
                Max price / night
              </h3>
              <input
                type="range"
                min={0}
                max={maxAvailable}
                value={Math.min(maxPrice, maxAvailable)}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$0</span>
                <span className="font-medium text-amber-600">
                  ${Math.min(maxPrice, maxAvailable)}
                </span>
                <span>${maxAvailable}+</span>
              </div>
            </div>

            {/* Star rating */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Star rating</h3>
              <div className="space-y-2">
                {[5, 4, 3].map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={starFilter.has(s)}
                      onChange={() => toggleStar(s)}
                      className="accent-amber-600"
                    />
                    <span className="text-amber-400 text-sm">{"★".repeat(s)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Amenities</h3>
              <div className="space-y-2">
                {AMENITY_FILTERS.map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={amenityFilter.has(a)}
                      onChange={() => toggleAmenity(a)}
                      className="accent-amber-600"
                    />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            {/* Free cancellation */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={freeCancelOnly}
                  onChange={(e) => setFreeCancelOnly(e.target.checked)}
                  className="accent-amber-600"
                />
                Free cancellation only
              </label>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sort */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Sort by:</span>
            {(["price", "rating", "stars", "distance"] as SortOption[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  sort === s
                    ? "bg-amber-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s === "price" ? "Cheapest" : s === "rating" ? "Best Rated" : s === "stars" ? "Stars" : "Nearest"}
              </button>
            ))}
            <span className="ml-auto text-sm text-slate-400">
              {filtered.length} propert{filtered.length === 1 ? "y" : "ies"}
            </span>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
              <p className="text-lg font-medium text-slate-400">No hotels match your filters</p>
              <p className="mt-2 text-sm text-slate-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((hotel, idx) => (
                <>
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    nights={nights}
                    onSelect={setSelected}
                  />
                  {idx === 2 && (
                    <AdUnit
                      key="ad"
                      slot="SEARCH_MID_SLOT"
                      format="horizontal"
                      className="my-2"
                    />
                  )}
                </>
              ))}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            Prices for {destination} · {checkin} – {checkout} · Updated daily
          </p>
        </div>
      </div>
    </>
  );
}
