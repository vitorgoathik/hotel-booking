import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const SUPPORTED = [
  "en", "th", "es", "ru", "pt-BR", "fr", "ja", "zh", "zh-TW", "ar", "de", "id", "ko", "it", "vi",
] as const;
type Locale = (typeof SUPPORTED)[number];

const COUNTRY_LOCALE: Record<string, Locale> = {
  TH: "th",
  // Spanish-speaking
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es", EC: "es",
  UY: "es", BO: "es", PY: "es", DO: "es", GT: "es", HN: "es", SV: "es", NI: "es",
  CR: "es", PA: "es", CU: "es",
  // Portuguese (Brazilian)
  BR: "pt-BR", PT: "pt-BR",
  // French
  FR: "fr", BE: "fr", CH: "fr", CA: "fr", LU: "fr",
  // Japanese
  JP: "ja",
  // Chinese Simplified
  CN: "zh",
  // Chinese Traditional
  TW: "zh-TW", HK: "zh-TW", MO: "zh-TW",
  // Arabic
  SA: "ar", AE: "ar", EG: "ar", KW: "ar", QA: "ar", BH: "ar", OM: "ar",
  JO: "ar", LB: "ar", MA: "ar", DZ: "ar", TN: "ar", IQ: "ar", YE: "ar",
  // German
  DE: "de", AT: "de",
  // Indonesian
  ID: "id",
  // Korean
  KR: "ko",
  // Italian
  IT: "it",
  // Vietnamese
  VN: "vi",
  // Russian
  RU: "ru", UA: "ru", KZ: "ru", BY: "ru", UZ: "ru",
};

function isSupported(l: string): l is Locale {
  return (SUPPORTED as readonly string[]).includes(l);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const hdrs        = await headers();

  const fromCookie = cookieStore.get("NEXT_LOCALE")?.value ?? "";
  const country    = hdrs.get("x-vercel-ip-country") ?? hdrs.get("cf-ipcountry") ?? "";
  const fromCountry: Locale = COUNTRY_LOCALE[country] ?? "en";

  const locale: Locale = isSupported(fromCookie) ? fromCookie : fromCountry;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default as Record<string, unknown>,
  };
});
