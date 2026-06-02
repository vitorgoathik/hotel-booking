# BookingMole — Brazil API Integration

> Work on this AFTER localisation (TODO4) is complete.

## What the user needs to arrange

| Platform | Registration | Notes |
|---|---|---|
| **Expedia Affiliate (pt-BR)** | https://affiliates.expediagroup.com/pt-br/home | Variable commission. Brazilian affiliate portal. |
| **Decolar.com** | Contact Decolar partner team | No public API. Largest OTA in Brazil — deep-link affiliate only. |
| **Booking.com** | Already wired via `NEXT_PUBLIC_BOOKING_AID` | Ensure AID is set on Vercel. Strong Brazil inventory. |

New env vars: `NEXT_PUBLIC_EXPEDIA_AID`, `NEXT_PUBLIC_DECOLAR_AID` (when available).

## Tasks

### 1. No new data provider needed
Booking.com (already wired) covers Brazil well. Agoda is SEA-focused — do NOT add for Brazil.

### 2. Expedia CTA button when country === "BR"
In `HotelCard` and `BookingModal`:
```
https://www.expedia.com.br/Hotels/search?destination={city}&checkIn={date}&checkOut={date}&adults={n}&affcid={NEXT_PUBLIC_EXPEDIA_AID}
```

### 3. Decolar.com CTA when country === "BR"
```
https://www.decolar.com/shop/hotels/list/{city}/{checkIn}/{checkOut}/{guests}/1
```
Append affiliate params once Decolar agreement is in place.

### 4. Popular Brazilian hotel destinations
When locale is `pt-BR`: Rio de Janeiro, São Paulo, Salvador, Fortaleza, Recife, Florianópolis, Natal, Manaus, Foz do Iguaçu, Belo Horizonte, Brasília, Gramado, Porto de Galinhas, Maceió, Curitiba.

### 5. createHotelRouter Brazil logic
```ts
if (country === "BR") {
  providers.push(new BookingComHotelProvider(...)); // only Booking.com for Brazil
  // Agoda NOT added for Brazil
}
```
