"use client";

import { buildHotelAffiliateLinks } from "@burrowsoft/shared";

interface Props {
  destination: string;
  checkin:     string;
  checkout:    string;
  guests:      number;
  rooms:       number;
  country:     string;
}

export function HotelAffiliateLinks({ destination, checkin, checkout, guests, rooms, country }: Props) {
  const links = buildHotelAffiliateLinks({ destination, checkin, checkout, guests, rooms, country });
  if (links.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Also search on</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div>
              <div className="font-semibold text-slate-900">{link.name}</div>
              <div className="mt-0.5 text-sm text-slate-500">{link.description}</div>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-all group-hover:gap-2.5">
              Search
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
