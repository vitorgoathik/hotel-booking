import type { Hotel, Destination } from "./types";

export const POPULAR_DESTINATIONS: Destination[] = [
  { slug: "paris", city: "Paris", country: "France", region: "Europe", minPrice: 79, hotelCount: 1247 },
  { slug: "new-york", city: "New York", country: "United States", region: "North America", minPrice: 129, hotelCount: 968 },
  { slug: "tokyo", city: "Tokyo", country: "Japan", region: "Asia", minPrice: 69, hotelCount: 1543 },
  { slug: "london", city: "London", country: "United Kingdom", region: "Europe", minPrice: 99, hotelCount: 1124 },
  { slug: "dubai", city: "Dubai", country: "UAE", region: "Middle East", minPrice: 89, hotelCount: 743 },
  { slug: "rome", city: "Rome", country: "Italy", region: "Europe", minPrice: 65, hotelCount: 892 },
  { slug: "barcelona", city: "Barcelona", country: "Spain", region: "Europe", minPrice: 59, hotelCount: 731 },
  { slug: "bali", city: "Bali", country: "Indonesia", region: "Asia", minPrice: 39, hotelCount: 865 },
  { slug: "bangkok", city: "Bangkok", country: "Thailand", region: "Asia", minPrice: 29, hotelCount: 1102 },
  { slug: "phuket", city: "Phuket", country: "Thailand", region: "Asia", minPrice: 35, hotelCount: 824 },
  { slug: "sydney", city: "Sydney", country: "Australia", region: "Oceania", minPrice: 89, hotelCount: 612 },
  { slug: "singapore", city: "Singapore", country: "Singapore", region: "Asia", minPrice: 99, hotelCount: 543 },
  { slug: "amsterdam", city: "Amsterdam", country: "Netherlands", region: "Europe", minPrice: 79, hotelCount: 589 },
  { slug: "istanbul", city: "Istanbul", country: "Turkey", region: "Europe", minPrice: 45, hotelCount: 1038 },
  { slug: "cancun", city: "Cancun", country: "Mexico", region: "North America", minPrice: 49, hotelCount: 467 },
  { slug: "maldives", city: "Maldives", country: "Maldives", region: "Asia", minPrice: 199, hotelCount: 312 },
  { slug: "prague", city: "Prague", country: "Czech Republic", region: "Europe", minPrice: 42, hotelCount: 763 },
  { slug: "lisbon", city: "Lisbon", country: "Portugal", region: "Europe", minPrice: 55, hotelCount: 618 },
  { slug: "miami", city: "Miami", country: "United States", region: "North America", minPrice: 89, hotelCount: 534 },
  { slug: "los-angeles", city: "Los Angeles", country: "United States", region: "North America", minPrice: 109, hotelCount: 721 },
];

const HOTEL_NAME_TEMPLATES = [
  "Grand {City} Hotel",
  "The {City} Palace",
  "Harborview Suites",
  "Royal {City} Residences",
  "{City} Meridian",
  "The Continental",
  "Skyline Hotel & Spa",
  "Park Prestige {City}",
  "Lumina Boutique Hotel",
  "Urban Select {City}",
  "The Crown Suites",
  "Pacific Heights Hotel",
  "Garden City Hotel",
  "Heritage House",
  "Ocean Breeze Resort",
  "Pinnacle Hotel",
  "Blue Horizon",
  "The {City} Grand",
  "Residences at {City}",
  "The Manor",
];

const ALL_AMENITIES = [
  "Free WiFi",
  "Swimming Pool",
  "Fitness Center",
  "Restaurant",
  "Spa & Wellness",
  "Room Service",
  "Bar / Lounge",
  "Business Center",
  "Free Parking",
  "Airport Shuttle",
];

const STREET_NUMBERS = ["12", "45", "78", "23", "156", "89", "34", "210", "67", "301"];
const STREET_NAMES = [
  "Main Street",
  "Park Avenue",
  "Central Boulevard",
  "Grand Road",
  "Palace Street",
  "Market Square",
  "Harbour Walk",
  "Royal Drive",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function seedFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generateHotels(city: string, checkin: string): Hotel[] {
  const dest = POPULAR_DESTINATIONS.find(
    (d) => d.city.toLowerCase() === city.toLowerCase() || d.slug === city.toLowerCase().replace(/\s+/g, "-")
  );
  const baseSeed = seedFromString(city.toLowerCase() + checkin);
  const basePrice = dest?.minPrice ?? 80;

  const hotels: Hotel[] = [];

  for (let i = 0; i < 10; i++) {
    const rand = (offset: number) => seededRandom(baseSeed + i * 200 + offset);

    const stars = Math.floor(rand(1) * 3) + 3; // 3, 4, or 5
    const priceMultiplier = stars === 3 ? 1 : stars === 4 ? 1.85 : 3.4;
    const priceVariance = 0.8 + rand(2) * 0.4;
    const pricePerNight = Math.round(basePrice * priceMultiplier * priceVariance);

    const hasDiscount = rand(3) > 0.65;
    const originalPrice = hasDiscount
      ? Math.round(pricePerNight * (1.1 + rand(4) * 0.3))
      : undefined;

    const ratingBase = stars === 3 ? 7.0 : stars === 4 ? 8.0 : 8.5;
    const ratingRange = stars === 3 ? 1.5 : stars === 4 ? 1.0 : 1.3;
    const rating = Math.round((ratingBase + rand(5) * ratingRange) * 10) / 10;

    const reviewCount = Math.round(100 + rand(6) * 2900);

    const amenityCount =
      stars === 3
        ? 3 + Math.floor(rand(7) * 3)
        : stars === 4
          ? 5 + Math.floor(rand(7) * 3)
          : 7 + Math.floor(rand(7) * 3);

    // Deterministic shuffle via seeded sort
    const amenities = ALL_AMENITIES.slice()
      .map((a, idx) => ({ a, sort: seededRandom(baseSeed + i * 200 + 50 + idx) }))
      .sort((x, y) => x.sort - y.sort)
      .map(({ a }) => a)
      .slice(0, Math.min(amenityCount, ALL_AMENITIES.length));

    const distance = Math.round((0.1 + rand(9) * 4.9) * 10) / 10;
    const freeCancellation = rand(10) > 0.4;
    const breakfastIncluded = rand(11) > 0.6;
    const roomsLeft = Math.max(1, Math.ceil(rand(12) * 8));

    const templateIdx = Math.floor(rand(13) * HOTEL_NAME_TEMPLATES.length);
    const template = HOTEL_NAME_TEMPLATES[templateIdx] ?? "{City} Hotel";
    const name = template.replace(/{City}/g, dest?.city ?? city);

    const streetNum = STREET_NUMBERS[Math.floor(rand(14) * STREET_NUMBERS.length)] ?? "1";
    const streetName = STREET_NAMES[Math.floor(rand(15) * STREET_NAMES.length)] ?? "Main Street";
    const address = `${streetNum} ${streetName}`;

    hotels.push({
      id: `${(dest?.city ?? city).toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
      name,
      stars,
      rating,
      reviewCount,
      pricePerNight,
      originalPrice,
      city: dest?.city ?? city,
      country: dest?.country ?? "",
      address,
      amenities,
      distanceToCenter: distance,
      freeCancellation,
      breakfastIncluded,
      roomsLeft,
    });
  }

  return hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
}

export function getNights(checkin: string, checkout: string): number {
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  const diff = Math.round((b - a) / 86400000);
  return Math.max(1, diff);
}

export function getRatingLabel(rating: number): string {
  if (rating >= 9.0) return "Exceptional";
  if (rating >= 8.5) return "Excellent";
  if (rating >= 8.0) return "Very Good";
  if (rating >= 7.5) return "Good";
  return "Pleasant";
}
