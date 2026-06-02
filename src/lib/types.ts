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
  latitude?: number;
  longitude?: number;
  // Real API fields — present when data comes from Booking.com via RapidAPI
  bookingComId?: number;
  bookingComDestId?: string;
  photoUrl?: string;
  photos?: string[];
}

export type SortOption = "price" | "rating" | "stars" | "distance";

export interface HotelSearchParams {
  destination: string;
  checkin: string;
  checkout: string;
  guests: number;
  rooms: number;
}
