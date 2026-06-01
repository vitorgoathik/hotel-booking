export interface Destination {
  slug: string;
  city: string;
  country: string;
  region: string;
  minPrice: number;
  hotelCount: number;
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  originalPrice?: number;
  city: string;
  country: string;
  address: string;
  amenities: string[];
  distanceToCenter: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  roomsLeft: number;
}

export type SortOption = "price" | "rating" | "stars" | "distance";

export interface HotelSearchParams {
  destination: string;
  checkin: string;
  checkout: string;
  guests: number;
  rooms: number;
}
