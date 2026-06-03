import { NextResponse } from "next/server";

export async function GET() {
  // Strip UTF-8 BOM that may be prepended when the key is copy-pasted from certain editors
  const key = (process.env.RAPIDAPI_KEY ?? "").replace(/^﻿/, "") || undefined;

  if (!key) {
    return NextResponse.json({ ok: false, error: "RAPIDAPI_KEY not set" }, { status: 500 });
  }

  try {
    const res = await fetch(
      "https://hotels-com-provider.p.rapidapi.com/v2/regions?query=Bangkok&locale=en_US&domain=US",
      {
        headers: {
          "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
          "x-rapidapi-key": key,
        },
        cache: "no-store",
      },
    );
    const json = await res.json();
    const first = json?.data?.[0];
    return NextResponse.json({
      ok: res.ok && !!first,
      status: res.status,
      firstResult: first?.regionNames?.shortName ?? null,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
