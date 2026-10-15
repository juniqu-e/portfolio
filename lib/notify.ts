// 방명록 새 글 → 텔레그램 알림. TELEGRAM_BOT_TOKEN · TELEGRAM_CHAT_ID 가 없으면 아무것도 안 한다.
// 실패해도 방명록 등록에는 영향 없음 (로그만 남김).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wnsdlr.com";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function notifyGuestbookPending(entry: { id: number; name: string; body: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const name = entry.name.trim() || "익명";
  const text = [
    `📝 <b>방명록 승인 대기</b> #${entry.id}`,
    "",
    `<b>${escapeHtml(name)}</b>`,
    escapeHtml(entry.body),
    "",
    `<a href="${SITE_URL}/admin">${SITE_URL.replace(/^https?:\/\//, "")}/admin 에서 승인</a>`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`[notify] telegram HTTP ${res.status}`);
  } catch (err) {
    const e = err as Error & { cause?: { code?: string } };
    console.error(`[notify] telegram failed: ${e.name} ${e.message} ${e.cause?.code ?? ""}`);
  }
}
