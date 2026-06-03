import type { Hotel, Destination } from "./types";

export const ALL_CITIES: Destination[] = [
  // ── Europe ──────────────────────────────────────────────────────────────────
  { slug: "london", city: "London", country: "United Kingdom", region: "Europe", minPrice: 99, hotelCount: 2847 },
  { slug: "paris", city: "Paris", country: "France", region: "Europe", minPrice: 79, hotelCount: 3156 },
  { slug: "rome", city: "Rome", country: "Italy", region: "Europe", minPrice: 65, hotelCount: 2134 },
  { slug: "barcelona", city: "Barcelona", country: "Spain", region: "Europe", minPrice: 59, hotelCount: 1892 },
  { slug: "amsterdam", city: "Amsterdam", country: "Netherlands", region: "Europe", minPrice: 79, hotelCount: 1456 },
  { slug: "berlin", city: "Berlin", country: "Germany", region: "Europe", minPrice: 69, hotelCount: 2234 },
  { slug: "prague", city: "Prague", country: "Czech Republic", region: "Europe", minPrice: 42, hotelCount: 1654 },
  { slug: "vienna", city: "Vienna", country: "Austria", region: "Europe", minPrice: 85, hotelCount: 1234 },
  { slug: "lisbon", city: "Lisbon", country: "Portugal", region: "Europe", minPrice: 55, hotelCount: 1389 },
  { slug: "madrid", city: "Madrid", country: "Spain", region: "Europe", minPrice: 65, hotelCount: 1756 },
  { slug: "athens", city: "Athens", country: "Greece", region: "Europe", minPrice: 55, hotelCount: 987 },
  { slug: "budapest", city: "Budapest", country: "Hungary", region: "Europe", minPrice: 48, hotelCount: 1123 },
  { slug: "florence", city: "Florence", country: "Italy", region: "Europe", minPrice: 75, hotelCount: 876 },
  { slug: "venice", city: "Venice", country: "Italy", region: "Europe", minPrice: 90, hotelCount: 654 },
  { slug: "milan", city: "Milan", country: "Italy", region: "Europe", minPrice: 80, hotelCount: 1345 },
  { slug: "munich", city: "Munich", country: "Germany", region: "Europe", minPrice: 85, hotelCount: 1089 },
  { slug: "zurich", city: "Zurich", country: "Switzerland", region: "Europe", minPrice: 149, hotelCount: 456 },
  { slug: "geneva", city: "Geneva", country: "Switzerland", region: "Europe", minPrice: 139, hotelCount: 389 },
  { slug: "brussels", city: "Brussels", country: "Belgium", region: "Europe", minPrice: 79, hotelCount: 678 },
  { slug: "copenhagen", city: "Copenhagen", country: "Denmark", region: "Europe", minPrice: 109, hotelCount: 543 },
  { slug: "stockholm", city: "Stockholm", country: "Sweden", region: "Europe", minPrice: 105, hotelCount: 612 },
  { slug: "oslo", city: "Oslo", country: "Norway", region: "Europe", minPrice: 119, hotelCount: 456 },
  { slug: "helsinki", city: "Helsinki", country: "Finland", region: "Europe", minPrice: 99, hotelCount: 398 },
  { slug: "dublin", city: "Dublin", country: "Ireland", region: "Europe", minPrice: 95, hotelCount: 534 },
  { slug: "edinburgh", city: "Edinburgh", country: "United Kingdom", region: "Europe", minPrice: 85, hotelCount: 567 },
  { slug: "nice", city: "Nice", country: "France", region: "Europe", minPrice: 79, hotelCount: 456 },
  { slug: "porto", city: "Porto", country: "Portugal", region: "Europe", minPrice: 52, hotelCount: 678 },
  { slug: "dubrovnik", city: "Dubrovnik", country: "Croatia", region: "Europe", minPrice: 79, hotelCount: 345 },
  { slug: "santorini", city: "Santorini", country: "Greece", region: "Europe", minPrice: 109, hotelCount: 234 },
  { slug: "mykonos", city: "Mykonos", country: "Greece", region: "Europe", minPrice: 119, hotelCount: 198 },
  { slug: "reykjavik", city: "Reykjavik", country: "Iceland", region: "Europe", minPrice: 129, hotelCount: 234 },
  { slug: "krakow", city: "Krakow", country: "Poland", region: "Europe", minPrice: 39, hotelCount: 765 },
  { slug: "warsaw", city: "Warsaw", country: "Poland", region: "Europe", minPrice: 49, hotelCount: 876 },
  { slug: "istanbul", city: "Istanbul", country: "Turkey", region: "Europe", minPrice: 45, hotelCount: 2038 },
  { slug: "seville", city: "Seville", country: "Spain", region: "Europe", minPrice: 59, hotelCount: 567 },
  { slug: "valencia", city: "Valencia", country: "Spain", region: "Europe", minPrice: 55, hotelCount: 543 },
  { slug: "split", city: "Split", country: "Croatia", region: "Europe", minPrice: 65, hotelCount: 456 },
  { slug: "tallinn", city: "Tallinn", country: "Estonia", region: "Europe", minPrice: 49, hotelCount: 345 },
  { slug: "riga", city: "Riga", country: "Latvia", region: "Europe", minPrice: 45, hotelCount: 312 },
  { slug: "vilnius", city: "Vilnius", country: "Lithuania", region: "Europe", minPrice: 45, hotelCount: 289 },
  { slug: "bucharest", city: "Bucharest", country: "Romania", region: "Europe", minPrice: 39, hotelCount: 654 },
  { slug: "sofia", city: "Sofia", country: "Bulgaria", region: "Europe", minPrice: 35, hotelCount: 456 },
  { slug: "naples", city: "Naples", country: "Italy", region: "Europe", minPrice: 59, hotelCount: 678 },
  { slug: "porto-montenegro", city: "Kotor", country: "Montenegro", region: "Europe", minPrice: 65, hotelCount: 234 },
  { slug: "tbilisi", city: "Tbilisi", country: "Georgia", region: "Europe", minPrice: 49, hotelCount: 567 },

  // ── Middle East & Africa ────────────────────────────────────────────────────
  { slug: "dubai", city: "Dubai", country: "UAE", region: "Middle East", minPrice: 89, hotelCount: 2134 },
  { slug: "abu-dhabi", city: "Abu Dhabi", country: "UAE", region: "Middle East", minPrice: 85, hotelCount: 987 },
  { slug: "doha", city: "Doha", country: "Qatar", region: "Middle East", minPrice: 85, hotelCount: 756 },
  { slug: "tel-aviv", city: "Tel Aviv", country: "Israel", region: "Middle East", minPrice: 95, hotelCount: 567 },
  { slug: "jerusalem", city: "Jerusalem", country: "Israel", region: "Middle East", minPrice: 79, hotelCount: 432 },
  { slug: "cairo", city: "Cairo", country: "Egypt", region: "Africa", minPrice: 39, hotelCount: 1234 },
  { slug: "marrakech", city: "Marrakech", country: "Morocco", region: "Africa", minPrice: 45, hotelCount: 1089 },
  { slug: "cape-town", city: "Cape Town", country: "South Africa", region: "Africa", minPrice: 59, hotelCount: 1234 },
  { slug: "nairobi", city: "Nairobi", country: "Kenya", region: "Africa", minPrice: 55, hotelCount: 678 },
  { slug: "zanzibar", city: "Zanzibar", country: "Tanzania", region: "Africa", minPrice: 65, hotelCount: 345 },
  { slug: "muscat", city: "Muscat", country: "Oman", region: "Middle East", minPrice: 69, hotelCount: 456 },
  { slug: "sharm-el-sheikh", city: "Sharm el-Sheikh", country: "Egypt", region: "Africa", minPrice: 49, hotelCount: 456 },

  // ── Asia – Southeast ────────────────────────────────────────────────────────
  { slug: "bangkok", city: "Bangkok", country: "Thailand", region: "Asia", minPrice: 29, hotelCount: 4567 },
  { slug: "phuket", city: "Phuket", country: "Thailand", region: "Asia", minPrice: 35, hotelCount: 2134 },
  { slug: "chiang-mai", city: "Chiang Mai", country: "Thailand", region: "Asia", minPrice: 25, hotelCount: 1234 },
  { slug: "pattaya", city: "Pattaya", country: "Thailand", region: "Asia", minPrice: 28, hotelCount: 876 },
  { slug: "koh-samui", city: "Koh Samui", country: "Thailand", region: "Asia", minPrice: 45, hotelCount: 567 },
  { slug: "krabi", city: "Krabi", country: "Thailand", region: "Asia", minPrice: 35, hotelCount: 543 },
  { slug: "hua-hin", city: "Hua Hin", country: "Thailand", region: "Asia", minPrice: 35, hotelCount: 456 },
  { slug: "singapore", city: "Singapore", country: "Singapore", region: "Asia", minPrice: 99, hotelCount: 1567 },
  { slug: "kuala-lumpur", city: "Kuala Lumpur", country: "Malaysia", region: "Asia", minPrice: 39, hotelCount: 2345 },
  { slug: "penang", city: "Penang", country: "Malaysia", region: "Asia", minPrice: 35, hotelCount: 876 },
  { slug: "langkawi", city: "Langkawi", country: "Malaysia", region: "Asia", minPrice: 49, hotelCount: 456 },
  { slug: "bali", city: "Bali", country: "Indonesia", region: "Asia", minPrice: 39, hotelCount: 2345 },
  { slug: "jakarta", city: "Jakarta", country: "Indonesia", region: "Asia", minPrice: 45, hotelCount: 1987 },
  { slug: "yogyakarta", city: "Yogyakarta", country: "Indonesia", region: "Asia", minPrice: 28, hotelCount: 567 },
  { slug: "lombok", city: "Lombok", country: "Indonesia", region: "Asia", minPrice: 35, hotelCount: 345 },
  { slug: "ho-chi-minh-city", city: "Ho Chi Minh City", country: "Vietnam", region: "Asia", minPrice: 28, hotelCount: 2134 },
  { slug: "hanoi", city: "Hanoi", country: "Vietnam", region: "Asia", minPrice: 25, hotelCount: 1567 },
  { slug: "hoi-an", city: "Hoi An", country: "Vietnam", region: "Asia", minPrice: 32, hotelCount: 678 },
  { slug: "da-nang", city: "Da Nang", country: "Vietnam", region: "Asia", minPrice: 32, hotelCount: 678 },
  { slug: "nha-trang", city: "Nha Trang", country: "Vietnam", region: "Asia", minPrice: 28, hotelCount: 456 },
  { slug: "siem-reap", city: "Siem Reap", country: "Cambodia", region: "Asia", minPrice: 22, hotelCount: 456 },
  { slug: "phnom-penh", city: "Phnom Penh", country: "Cambodia", region: "Asia", minPrice: 22, hotelCount: 567 },
  { slug: "luang-prabang", city: "Luang Prabang", country: "Laos", region: "Asia", minPrice: 25, hotelCount: 234 },
  { slug: "yangon", city: "Yangon", country: "Myanmar", region: "Asia", minPrice: 32, hotelCount: 456 },
  { slug: "manila", city: "Manila", country: "Philippines", region: "Asia", minPrice: 35, hotelCount: 1456 },
  { slug: "cebu", city: "Cebu", country: "Philippines", region: "Asia", minPrice: 32, hotelCount: 876 },
  { slug: "boracay", city: "Boracay", country: "Philippines", region: "Asia", minPrice: 49, hotelCount: 345 },

  // ── Asia – East ─────────────────────────────────────────────────────────────
  { slug: "tokyo", city: "Tokyo", country: "Japan", region: "Asia", minPrice: 69, hotelCount: 4567 },
  { slug: "osaka", city: "Osaka", country: "Japan", region: "Asia", minPrice: 59, hotelCount: 2345 },
  { slug: "kyoto", city: "Kyoto", country: "Japan", region: "Asia", minPrice: 79, hotelCount: 1456 },
  { slug: "hiroshima", city: "Hiroshima", country: "Japan", region: "Asia", minPrice: 55, hotelCount: 456 },
  { slug: "okinawa", city: "Okinawa", country: "Japan", region: "Asia", minPrice: 69, hotelCount: 456 },
  { slug: "seoul", city: "Seoul", country: "South Korea", region: "Asia", minPrice: 65, hotelCount: 3456 },
  { slug: "busan", city: "Busan", country: "South Korea", region: "Asia", minPrice: 55, hotelCount: 1234 },
  { slug: "jeju", city: "Jeju", country: "South Korea", region: "Asia", minPrice: 59, hotelCount: 567 },
  { slug: "beijing", city: "Beijing", country: "China", region: "Asia", minPrice: 65, hotelCount: 3456 },
  { slug: "shanghai", city: "Shanghai", country: "China", region: "Asia", minPrice: 75, hotelCount: 4567 },
  { slug: "chengdu", city: "Chengdu", country: "China", region: "Asia", minPrice: 55, hotelCount: 1456 },
  { slug: "hong-kong", city: "Hong Kong", country: "Hong Kong", region: "Asia", minPrice: 89, hotelCount: 2345 },
  { slug: "taipei", city: "Taipei", country: "Taiwan", region: "Asia", minPrice: 59, hotelCount: 1567 },
  { slug: "macau", city: "Macau", country: "Macau", region: "Asia", minPrice: 85, hotelCount: 345 },
  { slug: "ulaanbaatar", city: "Ulaanbaatar", country: "Mongolia", region: "Asia", minPrice: 39, hotelCount: 189 },

  // ── Asia – South ─────────────────────────────────────────────────────────────
  { slug: "mumbai", city: "Mumbai", country: "India", region: "Asia", minPrice: 49, hotelCount: 1987 },
  { slug: "delhi", city: "Delhi", country: "India", region: "Asia", minPrice: 39, hotelCount: 2345 },
  { slug: "goa", city: "Goa", country: "India", region: "Asia", minPrice: 39, hotelCount: 1234 },
  { slug: "jaipur", city: "Jaipur", country: "India", region: "Asia", minPrice: 35, hotelCount: 876 },
  { slug: "agra", city: "Agra", country: "India", region: "Asia", minPrice: 32, hotelCount: 456 },
  { slug: "kolkata", city: "Kolkata", country: "India", region: "Asia", minPrice: 35, hotelCount: 876 },
  { slug: "bangalore", city: "Bangalore", country: "India", region: "Asia", minPrice: 42, hotelCount: 987 },
  { slug: "colombo", city: "Colombo", country: "Sri Lanka", region: "Asia", minPrice: 39, hotelCount: 567 },
  { slug: "kathmandu", city: "Kathmandu", country: "Nepal", region: "Asia", minPrice: 25, hotelCount: 456 },
  { slug: "maldives", city: "Maldives", country: "Maldives", region: "Asia", minPrice: 199, hotelCount: 312 },

  // ── Americas – North ─────────────────────────────────────────────────────────
  { slug: "new-york", city: "New York", country: "United States", region: "North America", minPrice: 149, hotelCount: 2987 },
  { slug: "los-angeles", city: "Los Angeles", country: "United States", region: "North America", minPrice: 119, hotelCount: 2456 },
  { slug: "miami", city: "Miami", country: "United States", region: "North America", minPrice: 99, hotelCount: 1456 },
  { slug: "las-vegas", city: "Las Vegas", country: "United States", region: "North America", minPrice: 79, hotelCount: 1234 },
  { slug: "chicago", city: "Chicago", country: "United States", region: "North America", minPrice: 99, hotelCount: 1567 },
  { slug: "san-francisco", city: "San Francisco", country: "United States", region: "North America", minPrice: 129, hotelCount: 1123 },
  { slug: "seattle", city: "Seattle", country: "United States", region: "North America", minPrice: 99, hotelCount: 876 },
  { slug: "boston", city: "Boston", country: "United States", region: "North America", minPrice: 109, hotelCount: 765 },
  { slug: "washington-dc", city: "Washington DC", country: "United States", region: "North America", minPrice: 109, hotelCount: 876 },
  { slug: "new-orleans", city: "New Orleans", country: "United States", region: "North America", minPrice: 89, hotelCount: 654 },
  { slug: "orlando", city: "Orlando", country: "United States", region: "North America", minPrice: 79, hotelCount: 1234 },
  { slug: "honolulu", city: "Honolulu", country: "United States", region: "North America", minPrice: 139, hotelCount: 456 },
  { slug: "nashville", city: "Nashville", country: "United States", region: "North America", minPrice: 89, hotelCount: 543 },
  { slug: "toronto", city: "Toronto", country: "Canada", region: "North America", minPrice: 89, hotelCount: 1234 },
  { slug: "vancouver", city: "Vancouver", country: "Canada", region: "North America", minPrice: 99, hotelCount: 876 },
  { slug: "montreal", city: "Montreal", country: "Canada", region: "North America", minPrice: 79, hotelCount: 765 },
  { slug: "cancun", city: "Cancun", country: "Mexico", region: "North America", minPrice: 49, hotelCount: 876 },
  { slug: "mexico-city", city: "Mexico City", country: "Mexico", region: "North America", minPrice: 55, hotelCount: 1456 },
  { slug: "tulum", city: "Tulum", country: "Mexico", region: "North America", minPrice: 65, hotelCount: 345 },
  { slug: "havana", city: "Havana", country: "Cuba", region: "North America", minPrice: 45, hotelCount: 345 },
  { slug: "san-juan", city: "San Juan", country: "Puerto Rico", region: "North America", minPrice: 85, hotelCount: 312 },
  { slug: "punta-cana", city: "Punta Cana", country: "Dominican Republic", region: "North America", minPrice: 75, hotelCount: 345 },

  // ── Americas – South ─────────────────────────────────────────────────────────
  { slug: "rio-de-janeiro", city: "Rio de Janeiro", country: "Brazil", region: "South America", minPrice: 59, hotelCount: 1987 },
  { slug: "sao-paulo", city: "São Paulo", country: "Brazil", region: "South America", minPrice: 65, hotelCount: 2345 },
  { slug: "buenos-aires", city: "Buenos Aires", country: "Argentina", region: "South America", minPrice: 49, hotelCount: 1456 },
  { slug: "santiago", city: "Santiago", country: "Chile", region: "South America", minPrice: 59, hotelCount: 876 },
  { slug: "lima", city: "Lima", country: "Peru", region: "South America", minPrice: 49, hotelCount: 876 },
  { slug: "cusco", city: "Cusco", country: "Peru", region: "South America", minPrice: 42, hotelCount: 456 },
  { slug: "bogota", city: "Bogota", country: "Colombia", region: "South America", minPrice: 45, hotelCount: 876 },
  { slug: "cartagena", city: "Cartagena", country: "Colombia", region: "South America", minPrice: 55, hotelCount: 456 },
  { slug: "medellin", city: "Medellín", country: "Colombia", region: "South America", minPrice: 42, hotelCount: 567 },
  { slug: "quito", city: "Quito", country: "Ecuador", region: "South America", minPrice: 42, hotelCount: 456 },
  { slug: "montevideo", city: "Montevideo", country: "Uruguay", region: "South America", minPrice: 49, hotelCount: 345 },

  // ── Oceania ─────────────────────────────────────────────────────────────────
  { slug: "sydney", city: "Sydney", country: "Australia", region: "Oceania", minPrice: 89, hotelCount: 1987 },
  { slug: "melbourne", city: "Melbourne", country: "Australia", region: "Oceania", minPrice: 85, hotelCount: 1654 },
  { slug: "brisbane", city: "Brisbane", country: "Australia", region: "Oceania", minPrice: 75, hotelCount: 987 },
  { slug: "gold-coast", city: "Gold Coast", country: "Australia", region: "Oceania", minPrice: 75, hotelCount: 654 },
  { slug: "cairns", city: "Cairns", country: "Australia", region: "Oceania", minPrice: 65, hotelCount: 456 },
  { slug: "auckland", city: "Auckland", country: "New Zealand", region: "Oceania", minPrice: 79, hotelCount: 765 },
  { slug: "queenstown", city: "Queenstown", country: "New Zealand", region: "Oceania", minPrice: 89, hotelCount: 345 },
  { slug: "bora-bora", city: "Bora Bora", country: "French Polynesia", region: "Oceania", minPrice: 229, hotelCount: 45 },
  { slug: "fiji", city: "Fiji", country: "Fiji", region: "Oceania", minPrice: 65, hotelCount: 234 },
];

// Featured on the homepage destination grid
export const POPULAR_DESTINATIONS: Destination[] = ALL_CITIES.filter((c) =>
  [
    "Paris", "Tokyo", "Bali", "Bangkok", "Dubai", "New York",
    "London", "Singapore", "Phuket", "Rome", "Sydney", "Maldives",
  ].includes(c.city)
);

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
  const dest = ALL_CITIES.find(
    (d) => d.city.toLowerCase() === city.toLowerCase() || d.slug === city.toLowerCase().replace(/\s+/g, "-")
  );
  const baseSeed = seedFromString(city.toLowerCase() + checkin);
  const basePrice = dest?.minPrice ?? 60;

  const hotels: Hotel[] = [];

  for (let i = 0; i < 10; i++) {
    const rand = (offset: number) => seededRandom(baseSeed + i * 200 + offset);

    const stars = Math.floor(rand(1) * 3) + 3;
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

    const citySlug = (dest?.city ?? city).toLowerCase().replace(/\s+/g, "-");
    hotels.push({
      id: `${citySlug}-${i + 1}`,
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
