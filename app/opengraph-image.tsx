import { ImageResponse } from "next/og";

// 공유 카드 — 메인(터미널 스토리)과 같은 톤 (2026-10-14).
export const alt = "이준익 (Lee Junik) — Infrastructure Engineer · 서버 · 클라우드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0A0D0B";
const PANEL = "#101511";
const LINE = "#1E2921";
const INK = "#D7E3DA";
const MUTED = "#80907F";
const DIM = "#4A584D";
const GREEN = "#5CF08A";
const CYAN = "#7CC7FF";

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 56,
        backgroundColor: BG,
        color: INK,
        fontFamily: "ui-monospace, monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          border: `1px solid ${LINE}`,
          backgroundColor: PANEL,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 22px",
            borderBottom: `1px solid ${LINE}`,
            color: DIM,
            fontSize: 20,
          }}
        >
          <span style={{ display: "block", width: 12, height: 12, borderRadius: 999, backgroundColor: "#FF6B6B", opacity: 0.8 }} />
          <span style={{ display: "block", width: 12, height: 12, borderRadius: 999, backgroundColor: "#FFB454", opacity: 0.8 }} />
          <span style={{ display: "block", width: 12, height: 12, borderRadius: 999, backgroundColor: GREEN, opacity: 0.8 }} />
          <span style={{ marginLeft: 10 }}>junik@homeserver: ~/whoami — bash</span>
          <span style={{ marginLeft: "auto" }}>wnsdlr.com</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "28px 40px", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>
            <span style={{ color: GREEN }}>junik@homeserver</span>:<span style={{ color: CYAN }}>~/whoami</span>$&nbsp;whoami
          </div>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.04em", color: INK }}>
            INFRA
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontSize: 40, fontWeight: 700 }}>
            <span>lee</span>
            <span style={{ color: GREEN }}>junik</span>
            <span style={{ fontSize: 24, fontWeight: 400, color: MUTED }}>
              Infrastructure Engineer · 서버 · 클라우드
            </span>
          </div>
          <div style={{ display: "flex", marginTop: "auto", fontSize: 24, color: MUTED }}>
            기술의 가치는 사람이 할 수 있는 일을 넓히는 데 있다고 믿습니다.
          </div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
