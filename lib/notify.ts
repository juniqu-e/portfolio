// 방명록 새 글 → 텔레그램 알림 + 승인/거절 버튼.
// TELEGRAM_BOT_TOKEN · TELEGRAM_CHAT_ID 가 없으면 아무것도 안 한다. 실패해도 방명록 등록에는 영향 없음.
// 버튼 응답은 app/api/telegram/webhook/route.ts 가 받는다.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://leejunik.com";

export type GuestbookAction = "approve" | "reject";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function telegram(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`[telegram] ${method} HTTP ${res.status}`);
    return res;
  } catch (err) {
    const e = err as Error & { cause?: { code?: string } };
    console.error(`[telegram] ${method} failed: ${e.name} ${e.message} ${e.cause?.code ?? ""}`);
    return null;
  }
}

// 알림 본문. status 가 있으면 처리 결과 줄을 붙인다(버튼 누른 뒤 메시지 갱신용).
export function guestbookMessage(
  entry: { id: number; name: string; body: string },
  status?: string,
): string {
  const name = entry.name.trim() || "익명";
  return [
    `📝 <b>방명록 승인 대기</b> #${entry.id}`,
    "",
    `<b>${escapeHtml(name)}</b>`,
    escapeHtml(entry.body),
    "",
    status ?? `<a href="${SITE_URL}/admin">${SITE_URL.replace(/^https?:\/\//, "")}/admin</a>`,
  ].join("\n");
}

export async function notifyGuestbookPending(entry: { id: number; name: string; body: string }) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) return;

  await telegram("sendMessage", {
    chat_id: chatId,
    text: guestbookMessage(entry),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ 승인", callback_data: `gb:approve:${entry.id}` },
          { text: "🚫 거절", callback_data: `gb:reject:${entry.id}` },
        ],
      ],
    },
  });
}
