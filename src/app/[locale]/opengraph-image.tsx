import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };

export default async function OGImage() {
  const iconData = await readFile(join(process.cwd(), "public/booking.png"));
  const iconSrc = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #78350f 0%, #92400e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} width={180} height={180} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#f8fafc" }}>
            BookingMole
          </span>
          <span style={{ fontSize: 28, color: "#94a3b8" }}>
            Compare & Book Hotels Worldwide
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
