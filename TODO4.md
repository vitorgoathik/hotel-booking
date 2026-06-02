# BookingMole — TODO4: Complete Thai/Portuguese Localisation

Finish translation coverage and adopt the shared `LanguageSelector` dropdown component.

## Replace LanguageSelector with shared component
Delete `src/components/LanguageSelector.tsx`. In `layout.tsx`:
```tsx
import { LanguageSelector } from "@burrowsoft/shared";
<LanguageSelector locales={["en", "th"]} />
```

## Wire SearchForm strings (if pending)
Add `useTranslations("search")` and replace hardcoded strings:
- `"Destination"`, `"Check-in"`, `"Check-out"`, `"Guests"`, `"Rooms"`, `"Search Hotels"`

## Translate page-level hero
- `page.tsx` hero title/subtitle (if still hardcoded)
- Any destination-specific detail pages

## Verify modal labels
Check `BookingModal.tsx` — all amenity, review, room type labels should use `t()` calls.

## Test end-to-end
1. Load page in EN
2. Switch locale dropdown to TH — verify Thai render + Sarabun font
3. Switch back to EN
4. Reload — verify cookie persists

## Fill in ThaiReports.md
Document translation coverage. Link to `API Stories/Thai.md` for later API work (Agoda, Trip.com, etc.).

---

**API work:** See `API Stories/Thai.md` and `API Stories/Brazil.md` (start after localisation is complete).
