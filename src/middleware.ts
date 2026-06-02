import { type NextRequest, NextResponse } from "next/server";

const ONE_YEAR = 365 * 24 * 60 * 60;

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Set NEXT_LOCALE cookie on first visit only
  if (!req.cookies.get("NEXT_LOCALE")) {
    const country = req.headers.get("x-vercel-ip-country")
      ?? req.headers.get("cf-ipcountry")
      ?? "";
    const locale = country === "TH" ? "th" : "en";
    res.cookies.set("NEXT_LOCALE", locale, {
      path:    "/",
      maxAge:  ONE_YEAR,
      sameSite: "lax",
    });
  }

  return res;
}

export const config = {
  // Run on all pages except API routes, static files, and Next internals
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
