"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ALL_CITIES, POPULAR_DESTINATIONS } from "@/lib/data";

interface FormState {
  destination: string;
  checkin: string;
  checkout: string;
  guests: number;
  rooms: number;
}

const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "";
const threeDaysLater = new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0] ?? "";
const today = new Date().toISOString().split("T")[0] ?? "";

const defaultState: Omit<FormState, "destination"> = {
  checkin: tomorrow,
  checkout: threeDaysLater,
  guests: 2,
  rooms: 1,
};

function DestinationInput({
  value,
  onChange,
  label,
  placeholder,
  searchInLabel,
  hotelCountLabel,
}: {
  value: string;
  onChange: (val: string) => void;
  label: string;
  placeholder: string;
  searchInLabel: (city: string) => string;
  hotelCountLabel: (count: number) => string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const matches = trimmed
    ? ALL_CITIES.filter(
        (d) =>
          d.city.toLowerCase().includes(trimmed.toLowerCase()) ||
          d.country.toLowerCase().includes(trimmed.toLowerCase())
      ).slice(0, 8)
    : POPULAR_DESTINATIONS.slice(0, 8);

  const exactMatch = ALL_CITIES.some(
    (d) => d.city.toLowerCase() === trimmed.toLowerCase()
  );
  const showCustomOption = trimmed.length > 0 && !exactMatch;

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className={inputCls}
      />
      {open && (matches.length > 0 || showCustomOption) && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {matches.map((d) => (
            <li key={d.slug}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-amber-50 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(d.city);
                  setQuery(d.city);
                  setOpen(false);
                }}
              >
                <span className="text-base">🏨</span>
                <span>
                  <span className="font-medium text-slate-900">{d.city}</span>
                  <span className="ml-1 text-slate-400">{d.country}</span>
                </span>
                <span className="ml-auto text-xs text-slate-400">
                  {hotelCountLabel(d.hotelCount)}
                </span>
              </button>
            </li>
          ))}
          {showCustomOption && (
            <li>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-amber-50 transition-colors border-t border-slate-100"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(trimmed);
                  setQuery(trimmed);
                  setOpen(false);
                }}
              >
                <span className="text-base">🔍</span>
                <span className="text-slate-600">{searchInLabel(trimmed)}</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export function HotelSearchForm({
  compact = false,
  defaultDestination = "",
}: {
  compact?: boolean;
  defaultDestination?: string;
}) {
  const router = useRouter();
  const t = useTranslations("search");
  const [form, setForm] = useState<FormState>({
    ...defaultState,
    destination: defaultDestination,
  });
  const [error, setError] = useState<string | null>(null);

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination.trim()) {
      setError(t("errDestination"));
      return;
    }
    if (!form.checkin || !form.checkout) {
      setError(t("errDates"));
      return;
    }
    if (form.checkin >= form.checkout) {
      setError(t("errCheckout"));
      return;
    }
    const params = new URLSearchParams({
      destination: form.destination.trim(),
      checkin: form.checkin,
      checkout: form.checkout,
      guests: String(form.guests),
      rooms: String(form.rooms),
    });
    router.push(`/search?${params.toString()}`);
  };

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20";
  const labelCls = "mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500";

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl bg-white shadow-xl ${compact ? "p-4" : "p-6"}`}
    >
      <div
        className={`grid gap-3 ${
          compact
            ? "grid-cols-2 md:grid-cols-4"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        <div className={compact ? "" : "md:col-span-2 lg:col-span-1"}>
          <DestinationInput
            value={form.destination}
            onChange={(v) => set("destination", v)}
            label={t("destination")}
            placeholder={t("destinationPlaceholder")}
            searchInLabel={(city) => t("searchIn", { city })}
            hotelCountLabel={(count) => t("hotelCount", { count })}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="checkin">{t("checkin")}</label>
          <input
            id="checkin"
            type="date"
            min={today}
            value={form.checkin}
            onChange={(e) => set("checkin", e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="checkout">{t("checkout")}</label>
          <input
            id="checkout"
            type="date"
            min={form.checkin || today}
            value={form.checkout}
            onChange={(e) => set("checkout", e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls} htmlFor="guests">{t("guests")}</label>
            <select
              id="guests"
              value={form.guests}
              onChange={(e) => set("guests", Number(e.target.value))}
              className={inputCls}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {t("guestOption", { count: n })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="rooms">{t("rooms")}</label>
            <select
              id="rooms"
              value={form.rooms}
              onChange={(e) => set("rooms", Number(e.target.value))}
              className={inputCls}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {t("roomOption", { count: n })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-5">
        <button
          type="submit"
          className="w-full rounded-xl bg-amber-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-amber-700 active:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {t("searchButton")}
        </button>
      </div>
    </form>
  );
}
