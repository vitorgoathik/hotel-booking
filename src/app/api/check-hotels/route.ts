import { NextResponse } from "next/server";

export async function GET() {
  // Strip UTF-8 BOM that may be prepended when the key is copy-pasted from certain editors
  const key = (process.env.RAPIDAPI_KEY ?? "").replace(/^﻿/, "") || undefined;

  if (!key) {
    return NextResponse.json({ ok: false, error: "RAPIDAPI_KEY not set" }, { status: 500 });
  }

  try {
    const res = await fetch(
      "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=Bangkok",
      {
        headers: {
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
          "x-rapidapi-key": key,
        },
        cache: "no-store",
      },
    );
    const json = await res.json();
    return NextResponse.json({
      ok: res.ok && json.status === true,
      status: res.status,
      firstResult: json.data?.[0]?.label ?? null,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
