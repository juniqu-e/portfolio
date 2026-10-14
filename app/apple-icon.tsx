import { ImageResponse } from "next/og";

// iOS 홈 화면 아이콘 — 파비콘과 같은 구성, 180px.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BG = "#0A0D0B";
const GREEN = "#5CF08A";
const DIM = "#4A584D";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: BG,
        fontFamily: "ui-monospace, monospace",
      }}
    >
      <div style={{ display: "flex", gap: 8, padding: "18px 20px 0" }}>
        <span style={{ display: "block", width: 12, height: 12, borderRadius: 999, backgroundColor: "#FF6B6B", opacity: 0.8 }} />
        <span style={{ display: "block", width: 12, height: 12, borderRadius: 999, backgroundColor: "#FFB454", opacity: 0.8 }} />
        <span style={{ display: "block", width: 12, height: 12, borderRadius: 999, backgroundColor: GREEN, opacity: 0.8 }} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <span style={{ display: "block", color: GREEN, fontSize: 96, fontWeight: 700, lineHeight: 1, marginTop: -10 }}>$</span>
        <span style={{ display: "block", width: 34, height: 70, backgroundColor: GREEN }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 18, color: DIM, fontSize: 18 }}>
        wnsdlr.com
      </div>
    </div>,
    { ...size },
  );
}
