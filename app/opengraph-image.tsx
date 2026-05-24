import { ImageResponse } from "next/og";

export const alt =
  "이준익 (Lee Junik) — DevOps / Platform Engineer. Try the code, Catch the people, Finally make it reliable.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0A0A0A";
const MUTED = "#595959";
const SUBTLE = "#8E8E8E";
const LINE = "#EDEDED";
const PANEL = "#FAFAFA";
const ACCENT = "#6B9BD2";

export default function OG() {
  return new ImageResponse(
    (
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 22,
              color: SUBTLE,
              fontFamily: "ui-monospace, monospace",
            }}
          >
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
            DevOps / Platform
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 144,
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
                fontSize: 72,
                fontWeight: 500,
                color: MUTED,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Lee Junik
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: MUTED,
              fontFamily: "ui-monospace, monospace",
              marginTop: 16,
            }}
          >
            DevOps / Platform Engineer
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "22px 28px",
              backgroundColor: PANEL,
              border: `1px solid ${LINE}`,
              borderRadius: 12,
              fontSize: 24,
              fontFamily: "ui-monospace, monospace",
              lineHeight: 1.6,
              color: SUBTLE,
              marginTop: 8,
            }}
          >
            <span style={{ display: "flex" }}>
              <span style={{ color: ACCENT }}>try</span>
              <span>{" { "}</span>
              <span style={{ color: INK }}>code</span>
              <span>{"(); } "}</span>
              <span style={{ color: ACCENT }}>catch</span>
              <span>{" (people) { ... }"}</span>
            </span>
            <span style={{ display: "flex" }}>
              <span style={{ color: ACCENT }}>finally</span>
              <span>{" { "}</span>
              <span style={{ color: INK }}>shipReliableService</span>
              <span>{"(); }"}</span>
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{ display: "block", width: "100%", height: 1, backgroundColor: LINE }}
          />
          <span
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: INK,
              letterSpacing: "-0.01em",
            }}
          >
            Try the code, Catch the people, Finally make it reliable.
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
