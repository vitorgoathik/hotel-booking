"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Hotel } from "@/lib/types";
import { getNights } from "@/lib/data";
import { getBookingOptions } from "@/lib/affiliate";
import { useFormatPrice } from "./CurrencyProvider";

interface Props {
  hotel: Hotel;
  onClose: () => void;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(stars)}{"☆".repeat(5 - stars)}
    </span>
  );
}

function ModalInner({ hotel, onClose }: Props) {
  const fmt = useFormatPrice();
  const searchParams = useSearchParams();

  const checkin = searchParams.get("checkin") ?? new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "";
  const checkout = searchParams.get("checkout") ?? new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0] ?? "";
  const guests = Number(searchParams.get("guests") ?? "2");
  const rooms = Number(searchParams.get("rooms") ?? "1");
  const nights = getNights(checkin, checkout);

  const bookingOptions = getBookingOptions(hotel.city, checkin, checkout, guests, rooms);

  const roomRate = hotel.pricePerNight;
  const subtotal = roomRate * nights;
  const taxes = Math.round(subtotal * 0.14);
  const total = subtotal + taxes;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-lg flex-col rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl max-h-[92dvh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between rounded-t-2xl sm:rounded-t-2xl border-b border-slate-100 bg-white px-6 py-4">
          <h2 id="modal-title" className="text-lg font-bold text-slate-900">
            Hotel Summary
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Hotel info */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl">
              🏨
            </div>
            <div>
              <p className="font-semibold text-slate-900">{hotel.name}</p>
              <StarRating stars={hotel.stars} />
              <p className="text-sm text-slate-400">{hotel.address}, {hotel.city}</p>
            </div>
          </div>

          {/* Stay dates */}
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">{checkin}</p>
              <p className="text-xs text-slate-400">Check-in</p>
            </div>
            <div className="flex flex-1 flex-col items-center gap-1">
              <p className="text-xs text-slate-400">
                {nights} night{nights !== 1 ? "s" : ""}
              </p>
              <div className="h-px w-full bg-slate-300" />
              <p className="text-xs font-medium text-amber-600">
                {guests} guest{guests !== 1 ? "s" : ""} · {rooms} room{rooms !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">{checkout}</p>
              <p className="text-xs text-slate-400">Check-out</p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="space-y-2 rounded-xl border border-slate-100 px-4 py-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>{fmt(roomRate)} × {nights} night{nights !== 1 ? "s" : ""}</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Taxes &amp; fees (est.)</span>
              <span>{fmt(taxes)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
              <span>Total</span>
              <span className="text-amber-600 text-lg">{fmt(total)}</span>
            </div>
          </div>

          {/* Amenities */}
          {hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                >
                  ✓ {a}
                </span>
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {hotel.freeCancellation && (
              <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                ✓ Free cancellation
              </span>
            )}
            {hotel.breakfastIncluded && (
              <span className="rounded-md bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                ☕ Breakfast included
              </span>
            )}
          </div>

          {hotel.roomsLeft <= 5 && (
            <p className="text-sm font-medium text-red-500">
              ⚡ Only {hotel.roomsLeft} room{hotel.roomsLeft > 1 ? "s" : ""} left at this price
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="sticky bottom-0 shrink-0 border-t border-slate-100 bg-white px-6 py-4 space-y-2">
          {bookingOptions.map((opt, i) => (
            <a
              key={opt.label}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                i === 0
                  ? "flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-amber-700 active:bg-amber-800 transition-colors"
                  : "flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              }
            >
              {opt.label} ↗
            </a>
          ))}
          <p className="text-center text-xs text-slate-400 pt-1">
            Pre-filtered for{" "}
            <strong>{hotel.city}</strong> · {checkin} – {checkout}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BookingModal(props: Props) {
  return (
    <Suspense fallback={null}>
      <ModalInner {...props} />
    </Suspense>
  );
}
