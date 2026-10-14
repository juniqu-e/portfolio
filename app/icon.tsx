import { ImageResponse } from "next/og";

// 파비콘 — 터미널 톤 (2026-10-14). 검은 바탕에 초록 프롬프트 `$` 와 커서 블록.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const BG = "#0A0D0B";
const LINE = "#1E2921";
const GREEN = "#5CF08A";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        backgroundColor: BG,
        border: `1px solid ${LINE}`,
        borderRadius: 6,
        fontFamily: "ui-monospace, monospace",
      }}
    >
      <span
        style={{
          display: "block",
          color: GREEN,
          fontSize: 20,
          fontWeight: 700,
          lineHeight: 1,
          marginTop: -2,
        }}
      >
        $
      </span>
      <span style={{ display: "block", width: 7, height: 14, backgroundColor: GREEN, marginTop: 2 }} />
    </div>,
    { ...size },
  );
}
