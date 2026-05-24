import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          color: "#0A0A0A",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          position: "relative",
          fontFamily: "ui-sans-serif, sans-serif",
        }}
      >
        <span style={{ display: "block" }}>L</span>
        <span
          style={{
            display: "block",
            position: "absolute",
            bottom: 5,
            right: 7,
            width: 5,
            height: 5,
            borderRadius: 999,
            backgroundColor: "#6B9BD2",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
