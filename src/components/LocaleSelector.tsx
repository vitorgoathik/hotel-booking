"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  th: "ภาษาไทย",
  es: "Español",
  ru: "Русский",
  "pt-BR": "Português (BR)",
  fr: "Français",
  ja: "日本語",
  zh: "中文",
  "zh-TW": "繁體中文",
  ar: "العربية",
  de: "Deutsch",
  id: "Bahasa Indonesia",
  ko: "한국어",
  it: "Italiano",
  vi: "Tiếng Việt",
};

export function LocaleSelector({ className = "" }: { className?: string }) {
  const currentLocale = useLocale();
  const router        = useRouter();
  const pathname      = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const locale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Select language"
      className={`rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm cursor-pointer transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1 ${className}`}
    >
      {routing.locales.map((locale) => (
        <option key={locale} value={locale}>
          {LOCALE_NAMES[locale] ?? locale}
        </option>
      ))}
    </select>
  );
}
