import { NextResponse } from "next/server";

const key = () => (process.env.RAPIDAPI_KEY ?? "").replace(/^﻿/, "");

async function probe(host: string, path: string): Promise<{ status: number; body: unknown }> {
  try {
    const r = await fetch(`https://${host}.p.rapidapi.com${path}`, {
      headers: { "x-rapidapi-host": `${host}.p.rapidapi.com`, "x-rapidapi-key": key() },
      cache: "no-store",
    });
    const body = await r.json().catch(() => null);
    return { status: r.status, body };
  } catch (e) {
    return { status: 0, body: String(e) };
  }
}

export async function GET() {
  if (!key()) {
    return NextResponse.json({ ok: false, error: "RAPIDAPI_KEY not set" }, { status: 500 });
  }

  // Test real search endpoints on both APIs simultaneously
  const [hcp, bc15] = await Promise.all([
    probe(
      "hotels-com-provider",
      "/v2/regions?query=Bangkok&locale=en_US&domain=US",
    ),
    probe(
      "booking-com15",
      "/api/v1/hotels/searchDestination?query=Bangkok",
    ),
  ]);

  return NextResponse.json({
    "hotels-com-provider": {
      status: hcp.status,
      ok: hcp.status === 200,
      firstResult:
        (hcp.body as { data?: Array<{ regionNames?: { shortName?: string } }> })?.data?.[0]?.regionNames?.shortName ?? null,
    },
    "booking-com15": {
      status: bc15.status,
      ok: bc15.status === 200,
      firstResult:
        (bc15.body as { data?: Array<{ label?: string }> })?.data?.[0]?.label ?? null,
    },
  });
}
