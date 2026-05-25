import { z } from "zod";
import { getDb, type GuestbookRow } from "@/lib/db";
import { extractIp, hashIp } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import type { GuestbookEntry, GuestbookListResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PostSchema = z.object({
  name: z.string().trim().max(20).optional().default(""),
  body: z.string().min(1).max(100),
  honeypot: z.string().optional(),
});

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  cursor: z.coerce.number().int().positive().optional(),
});

function jsonError(
  code: "VALIDATION_ERROR" | "RATE_LIMITED" | "INTERNAL_ERROR",
  message: string,
  status: number,
  details?: { field: string; issue: string }[],
  extraHeaders?: HeadersInit,
) {
  return new Response(JSON.stringify({ error: { code, message, ...(details ? { details } : {}) } }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Invalid JSON body.", 400);
  }

  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => ({
      field: i.path.join(".") || "(root)",
      issue: i.message,
    }));
    return jsonError("VALIDATION_ERROR", "입력 값을 확인해주세요.", 400, details);
  }

  const { name, body, honeypot } = parsed.data;

  // Honeypot: 봇이 채우면 silent 200 (DB 접근 없음, 봇이 실패를 모르게)
  if (honeypot && honeypot.length > 0) {
    return Response.json({ ok: true, pending: true, message: "후기가 등록되었습니다. 검토 후 노출됩니다." }, { status: 201 });
  }

  const ipHash = hashIp(extractIp(req));
  const rl = checkRateLimit(ipHash);
  if (!rl.allowed) {
    return jsonError(
      "RATE_LIMITED",
      "잠시 후 다시 시도해주세요.",
      429,
      undefined,
      { "retry-after": String(rl.retryAfterSec) },
    );
  }

  const normalizedBody = body.replace(/\r\n/g, "\n").trim();
  if (normalizedBody.length === 0) {
    return jsonError("VALIDATION_ERROR", "본문을 입력해주세요.", 400);
  }
  const trimmedName = name.trim();
  const now = new Date().toISOString();

  try {
    const db = getDb();
    db.prepare(
      `INSERT INTO guestbook (name, body, ip_hash, approved, deleted, created_at, updated_at)
       VALUES (?, ?, ?, 0, 0, ?, ?)`,
    ).run(trimmedName, normalizedBody, ipHash, now, now);
  } catch {
    return jsonError("INTERNAL_ERROR", "잠시 후 다시 시도해주세요.", 500);
  }

  return Response.json(
    { ok: true, pending: true, message: "후기가 등록되었습니다. 검토 후 노출됩니다." },
    { status: 201 },
  );
}

export function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    cursor: url.searchParams.get("cursor") ?? undefined,
  });
  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "쿼리 파라미터를 확인해주세요.", 400);
  }
  const { limit, cursor } = parsed.data;

  try {
    const db = getDb();
    const rows = cursor
      ? (db
          .prepare(
            `SELECT id, name, body, created_at FROM guestbook
             WHERE approved = 1 AND deleted = 0 AND id < ?
             ORDER BY id DESC LIMIT ?`,
          )
          .all(cursor, limit + 1) as Pick<GuestbookRow, "id" | "name" | "body" | "created_at">[])
      : (db
          .prepare(
            `SELECT id, name, body, created_at FROM guestbook
             WHERE approved = 1 AND deleted = 0
             ORDER BY id DESC LIMIT ?`,
          )
          .all(limit + 1) as Pick<GuestbookRow, "id" | "name" | "body" | "created_at">[]);

    const hasMore = rows.length > limit;
    const sliced = hasMore ? rows.slice(0, limit) : rows;
    const items: GuestbookEntry[] = sliced.map((r) => ({
      id: r.id,
      name: r.name.length > 0 ? r.name : null,
      body: r.body,
      createdAt: r.created_at,
    }));
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;
    const payload: GuestbookListResponse = { items, nextCursor };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch {
    return jsonError("INTERNAL_ERROR", "잠시 후 다시 시도해주세요.", 500);
  }
}
