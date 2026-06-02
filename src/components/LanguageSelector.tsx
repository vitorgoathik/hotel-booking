"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

const LOCALES = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "th", flag: "🇹🇭", label: "TH" },
] as const;

export function LanguageSelector({ current }: { current: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${365 * 24 * 60 * 60};samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language selector">
      {LOCALES.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          disabled={isPending}
          aria-pressed={current === code}
          className={[
            "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors",
            current === code
              ? "bg-amber-600 text-white"
              : "text-slate-500 hover:bg-slate-100",
            isPending ? "opacity-50" : "",
          ].join(" ")}
        >
          <span aria-hidden>{flag}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
