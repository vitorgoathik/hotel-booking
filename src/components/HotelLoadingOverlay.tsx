"use client";

import { useTranslations } from "next-intl";

interface Props {
  providers:  string[];
  settled:    string[];
  failed:     string[];
  message?:   string;
  allSettled?: boolean;
}

export function HotelLoadingOverlay({ providers, settled, failed, message, allSettled }: Props) {
  const t = useTranslations("loading");

  return (
    <div
      className={[
        "fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm",
        "transition-opacity duration-500",
        allSettled ? "opacity-0 pointer-events-none" : "opacity-100",
      ].join(" ")}
    >
      <div className="rounded-2xl bg-white shadow-xl border border-slate-100 p-8 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500 shrink-0" />
          <p className="font-semibold text-slate-800">
            {message ?? t("finding")}
          </p>
        </div>

        <div className="space-y-3">
          {providers.map((p) => {
            const done    = settled.includes(p);
            const errored = failed.includes(p);
            return (
              <div key={p} className="flex items-center gap-3">
                {done ? (
                  <span className="text-emerald-500 text-sm leading-none">✓</span>
                ) : errored ? (
                  <span className="text-slate-300 text-sm leading-none">✗</span>
                ) : (
                  <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-amber-300 shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    errored ? "text-slate-400" : done ? "text-slate-700" : "text-slate-500"
                  }`}
                >
                  {errored
                    ? t("unavailable",     { provider: p })
                    : done
                    ? t("loadedProvider",  { provider: p })
                    : t("loadingProvider", { provider: p })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
