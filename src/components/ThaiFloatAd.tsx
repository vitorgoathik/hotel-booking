"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

const ADS = [
  {
    url:   "https://s.lazada.co.th/s.ZhTKMF?c=b&t=p-i6RvCVf-sRab381",
    label: "🛍️ ดีลโรงแรม Lazada",
  },
  {
    url:   "https://s.lazada.co.th/s.ZhTKLe?c=a&t=p-iHa6GOt-s2EYQBV0",
    label: "💳 โปรโมชันพิเศษ",
  },
] as const;

export function ThaiFloatAd() {
  const locale    = useLocale();
  const [gone, setGone] = useState(false);

  if (locale !== "th" || gone) return null;

  return (
    <div className="fixed bottom-5 right-4 z-50 w-52 overflow-hidden rounded-2xl bg-white shadow-2xl border border-orange-100">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ background: "linear-gradient(90deg,#f5720a,#ff9800)" }}
      >
        <span className="text-sm font-bold text-white tracking-tight">Lazada</span>
        <button
          onClick={() => setGone(true)}
          aria-label="ปิดโฆษณา"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-white hover:bg-white/40 transition-colors text-xs leading-none"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-2.5 space-y-2">
        {ADS.map((ad) => (
          <a
            key={ad.url}
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-center text-sm font-semibold text-orange-900 hover:bg-orange-100 active:bg-orange-200 transition-colors"
          >
            {ad.label}
          </a>
        ))}
        <p className="text-center text-[10px] text-slate-400 pt-0.5">
          โฆษณา · Lazada.co.th
        </p>
      </div>
    </div>
  );
}
