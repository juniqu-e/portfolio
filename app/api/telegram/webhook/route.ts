import { timingSafeEqual } from "node:crypto";
import { getDb, type GuestbookRow } from "@/lib/db";
import { guestbookMessage, telegram, type GuestbookAction } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 텔레그램 웹훅 — 방명록 알림의 승인/거절 버튼(callback_query)만 처리한다.
// 1) setWebhook 때 정한 secret_token 헤더가 맞아야 하고 2) 누른 사람이 TELEGRAM_CHAT_ID 본인이어야 한다.
// 거절 = 관리자 페이지의 삭제와 같은 soft delete (/admin 삭제 탭에서 복원 가능).

type CallbackQuery = {
  id: string;
  from: { id: number };
  data?: string;
  message?: { message_id: number; chat: { id: number } };
};

function secretOk(req: Request): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = req.headers.get("x-telegram-bot-api-secret-token");
  if (!expected || !got) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}

function kstTime(): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export async function POST(req: Request) {
  if (!secretOk(req)) return new Response(null, { status: 401 });

  const update = (await req.json().catch(() => null)) as { callback_query?: CallbackQuery } | null;
  const cq = update?.callback_query;
  // 처리 대상이 아닌 업데이트는 200 으로 흘려보낸다 (텔레그램이 재전송하지 않게).
  if (!cq) return Response.json({ ok: true });

  const owner = String(cq.from.id) === process.env.TELEGRAM_CHAT_ID;
  const match = /^gb:(approve|reject):(\d+)$/.exec(cq.data ?? "");
  if (!owner || !match) {
    await telegram("answerCallbackQuery", { callback_query_id: cq.id, text: "권한이 없습니다." });
    return Response.json({ ok: true });
  }

  const action = match[1] as GuestbookAction;
  const id = Number(match[2]);
  const db = getDb();
  const now = new Date().toISOString();
  const changes =
    action === "approve"
      ? db
          .prepare(
            `UPDATE guestbook SET approved = 1, updated_at = ? WHERE id = ? AND deleted = 0 AND approved = 0`,
          )
          .run(now, id).changes
      : db
          .prepare(`UPDATE guestbook SET deleted = 1, updated_at = ? WHERE id = ? AND deleted = 0`)
          .run(now, id).changes;

  const row = db
    .prepare(`SELECT id, name, body, approved, deleted FROM guestbook WHERE id = ?`)
    .get(id) as Pick<GuestbookRow, "id" | "name" | "body" | "approved" | "deleted"> | undefined;

  const current = !row ? "없음" : row.deleted ? "거절(삭제)" : row.approved ? "승인" : "대기";
  const toast =
    changes > 0
      ? action === "approve"
        ? `#${id} 승인했습니다`
        : `#${id} 거절했습니다`
      : `#${id} 이미 처리됨 — 현재 ${current}`;

  await telegram("answerCallbackQuery", { callback_query_id: cq.id, text: toast });

  if (row && cq.message) {
    const status =
      row.deleted === 1
        ? `🚫 <b>거절됨</b> · ${kstTime()}`
        : row.approved === 1
          ? `✅ <b>승인됨</b> · ${kstTime()}`
          : undefined;
    if (status) {
      await telegram("editMessageText", {
        chat_id: cq.message.chat.id,
        message_id: cq.message.message_id,
        text: guestbookMessage(row, status),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    }
  }

  return Response.json({ ok: true });
}
