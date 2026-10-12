import { ImageResponse } from "next/og";

export const alt = "이준익 (Lee Junik) — Infrastructure Engineer · 서버 · 클라우드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0A0A0A";
const MUTED = "#595959";
const SUBTLE = "#8E8E8E";
const ACCENT = "#6B9BD2";

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        backgroundColor: "#FFFFFF",
        fontFamily: "ui-sans-serif, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 22, color: SUBTLE, fontFamily: "ui-monospace, monospace" }}>
          wnsdlr.com
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            color: MUTED,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span
            style={{
              display: "block",
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: ACCENT,
            }}
          />
          Infrastructure · Server · Cloud
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 160,
            fontWeight: 800,
            color: INK,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          이준익
        </span>
        <span
          style={{
            fontSize: 80,
            fontWeight: 500,
            color: MUTED,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Lee Junik
        </span>
        <span
          style={{
            display: "flex",
            fontSize: 34,
            color: MUTED,
            fontFamily: "ui-monospace, monospace",
            marginTop: 32,
          }}
        >
          Infrastructure Engineer · 서버 · 클라우드
        </span>
      </div>
    </div>,
    { ...size },
  );
}
