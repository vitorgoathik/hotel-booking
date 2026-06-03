import { type NextRequest, NextResponse } from "next/server";

const ONE_YEAR = 365 * 24 * 60 * 60;

const COUNTRY_LOCALE: Record<string, string> = {
  TH: "th",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  EC: "es", UY: "es", BO: "es", PY: "es", DO: "es", GT: "es", HN: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", CU: "es",
  BR: "pt-BR", PT: "pt-BR",
  FR: "fr", BE: "fr", CH: "fr", CA: "fr", LU: "fr",
  JP: "ja",
  CN: "zh",
  TW: "zh-TW", HK: "zh-TW", MO: "zh-TW",
  SA: "ar", AE: "ar", EG: "ar", KW: "ar", QA: "ar", BH: "ar", OM: "ar",
  JO: "ar", LB: "ar", MA: "ar", DZ: "ar", TN: "ar", IQ: "ar", YE: "ar",
  DE: "de", AT: "de",
  ID: "id",
  KR: "ko",
  IT: "it",
  VN: "vi",
  RU: "ru", UA: "ru", KZ: "ru", BY: "ru", UZ: "ru",
};

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (!req.cookies.get("NEXT_LOCALE")) {
    const country = req.headers.get("x-vercel-ip-country")
      ?? req.headers.get("cf-ipcountry")
      ?? "";
    const locale = COUNTRY_LOCALE[country] ?? "en";
    res.cookies.set("NEXT_LOCALE", locale, {
      path:     "/",
      maxAge:   ONE_YEAR,
      sameSite: "lax",
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
