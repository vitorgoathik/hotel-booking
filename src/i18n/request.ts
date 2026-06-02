import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const SUPPORTED = ["en", "th"] as const;
type Locale = (typeof SUPPORTED)[number];

function isSupported(l: string): l is Locale {
  return (SUPPORTED as readonly string[]).includes(l);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const hdrs        = await headers();

  const fromCookie  = cookieStore.get("NEXT_LOCALE")?.value ?? "";
  const country     = hdrs.get("x-vercel-ip-country") ?? hdrs.get("cf-ipcountry") ?? "";
  const fromCountry = country === "TH" ? "th" : "en";

  const locale: Locale = isSupported(fromCookie) ? fromCookie : fromCountry;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default as Record<string, unknown>,
  };
});
