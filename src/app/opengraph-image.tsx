import { ImageResponse } from "next/og";

export const alt = "VALOVOTE — Vote for the best of VALORANT";
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 76,
          color: "white",
          background:
            "radial-gradient(circle at 82% 18%, rgba(255,70,85,.28), transparent 34%), #090c11",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 6,
            color: "#ff6673",
          }}
        >
          COMMUNITY POWERED
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: -6,
          }}
        >
          Vote for the best of
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 126,
            fontWeight: 900,
            letterSpacing: -8,
            color: "#ff4655",
          }}
        >
          VALORANT
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "rgba(255,255,255,.5)",
          }}
        >
          Skins · Agents · Sprays · Flex · Pro Players
        </div>
      </div>
    ),
    size,
  );
}
