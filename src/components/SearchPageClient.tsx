"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Hotel } from "@/lib/types";
import { SearchResults } from "./SearchResults";
import { HotelLoadingOverlay } from "./HotelLoadingOverlay";
import { generateHotels } from "@/lib/data";

interface Props {
  destination: string;
  country:     string;
  checkin:     string;
  checkout:    string;
  guests:      number;
  rooms:       number;
  nights:      number;
}

const PROVIDERS    = ["Booking.com"];
const REFRESH_MS   = 5 * 60 * 1000;

export function SearchPageClient({
  destination, country, checkin, checkout, guests, rooms, nights,
}: Props) {
  const [hotels,       setHotels]       = useState<Hotel[]>([]);
  const [isReal,       setIsReal]       = useState(false);
  const [initialLoad,  setInitialLoad]  = useState(true);
  const [overlayOn,    setOverlayOn]    = useState(true);
  const [allSettled,   setAllSettled]   = useState(false);
  const [settled,      setSettled]      = useState<string[]>([]);
  const [failed,       setFailed]       = useState<string[]>([]);
  const [overlayMsg,   setOverlayMsg]   = useState<string | undefined>();
  const [loadedAt,     setLoadedAt]     = useState<Date | null>(null);
  const [toastMsg,     setToastMsg]     = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchHotels = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setOverlayMsg("Fetching up-to-date prices…");
      setOverlayOn(true);
      setAllSettled(false);
    }
    setSettled([]);
    setFailed([]);

    try {
      const params = new URLSearchParams({
        destination,
        country,
        checkin,
        checkout,
        guests: String(guests),
        rooms:  String(rooms),
      });
      const res = await fetch(`/api/hotels?${params}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json() as { hotels: Hotel[] };
      const fetched = data.hotels;

      setSettled(PROVIDERS);
      setAllSettled(true);

      if (fetched.length > 0) {
        setHotels(fetched);
        setIsReal(true);
        setToastMsg(null);
      } else {
        setHotels(generateHotels(destination, checkin));
        setIsReal(false);
      }
    } catch {
      setFailed(PROVIDERS);
      setAllSettled(true);
      if (isRefresh && loadedAt) {
        const hhmm = loadedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        setToastMsg(`Prices could not be refreshed — last updated at ${hhmm}`);
      } else {
        setHotels(generateHotels(destination, checkin));
        setIsReal(false);
      }
    }

    const now = new Date();
    setLoadedAt(now);

    // Fade overlay out after a brief pause so the checkmarks are readable
    setTimeout(() => {
      setOverlayOn(false);
      setInitialLoad(false);
      setOverlayMsg(undefined);
    }, 600);
  }, [destination, country, checkin, checkout, guests, rooms, loadedAt]);

  // Initial fetch
  useEffect(() => {
    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 5-minute auto-refresh
  useEffect(() => {
    if (!loadedAt) return;
    timerRef.current = setTimeout(() => fetchHotels(true), REFRESH_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loadedAt, fetchHotels]);

  return (
    <>
      {overlayOn && (
        <HotelLoadingOverlay
          providers={PROVIDERS}
          settled={settled}
          failed={failed}
          message={overlayMsg}
          allSettled={allSettled}
        />
      )}

      {toastMsg && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          ⚠ {toastMsg}
        </div>
      )}

      {loadedAt && (
        <p className="mb-4 text-xs text-slate-400">
          Prices as of{" "}
          {loadedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          {isReal && (
            <span className="ml-2 font-medium text-emerald-600">· ✓ Live prices from Booking.com</span>
          )}
        </p>
      )}

      {!initialLoad && (
        hotels.length > 0 ? (
          <SearchResults
            hotels={hotels}
            destination={destination}
            checkin={checkin}
            checkout={checkout}
            guests={guests}
            rooms={rooms}
            nights={nights}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
            <p className="text-lg font-medium text-slate-400">No hotels found for this destination</p>
            <p className="mt-2 text-sm text-slate-400">Try a different city or dates</p>
          </div>
        )
      )}
    </>
  );
}
