import { z } from "zod";
import { getDb, type GuestbookRow } from "@/lib/db";
import { isAdminAuthorized, unauthorized } from "@/lib/admin-auth";
import type {
  GuestbookAdminEntry,
  GuestbookAdminListResponse,
  GuestbookStatus,
} from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  status: z.enum(["pending", "approved", "deleted", "all"]).default("pending"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.coerce.number().int().positive().optional(),
});

function jsonError(code: "VALIDATION_ERROR" | "INTERNAL_ERROR", message: string, status: number) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function statusOf(row: Pick<GuestbookRow, "approved" | "deleted">): GuestbookStatus {
  if (row.deleted === 1) return "deleted";
  if (row.approved === 1) return "approved";
  return "pending";
}

function whereClause(status: "pending" | "approved" | "deleted" | "all"): string {
  switch (status) {
    case "pending":
      return "approved = 0 AND deleted = 0";
    case "approved":
      return "approved = 1 AND deleted = 0";
    case "deleted":
      return "deleted = 1";
    case "all":
      return "1 = 1";
  }
}

export function GET(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();

  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    status: url.searchParams.get("status") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    cursor: url.searchParams.get("cursor") ?? undefined,
  });
  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "쿼리 파라미터를 확인해주세요.", 400);
  }
  const { status, limit, cursor } = parsed.data;

  try {
    const db = getDb();
    const where = whereClause(status);
    const sql = cursor
      ? `SELECT id, name, body, ip_hash, approved, deleted, created_at, updated_at
         FROM guestbook
         WHERE ${where} AND id < ?
         ORDER BY id DESC LIMIT ?`
      : `SELECT id, name, body, ip_hash, approved, deleted, created_at, updated_at
         FROM guestbook
         WHERE ${where}
         ORDER BY id DESC LIMIT ?`;
    const rows = (cursor
      ? db.prepare(sql).all(cursor, limit + 1)
      : db.prepare(sql).all(limit + 1)) as GuestbookRow[];

    const hasMore = rows.length > limit;
    const sliced = hasMore ? rows.slice(0, limit) : rows;
    const items: GuestbookAdminEntry[] = sliced.map((r) => ({
      id: r.id,
      name: r.name.length > 0 ? r.name : null,
      body: r.body,
      createdAt: r.created_at,
      status: statusOf(r),
      ipHash: r.ip_hash,
      updatedAt: r.updated_at,
    }));
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    const countRow = db
      .prepare(
        `SELECT
           SUM(CASE WHEN approved = 0 AND deleted = 0 THEN 1 ELSE 0 END) AS pending,
           SUM(CASE WHEN approved = 1 AND deleted = 0 THEN 1 ELSE 0 END) AS approved,
           SUM(CASE WHEN deleted = 1 THEN 1 ELSE 0 END) AS deleted
         FROM guestbook`,
      )
      .get() as { pending: number | null; approved: number | null; deleted: number | null };

    const payload: GuestbookAdminListResponse = {
      items,
      nextCursor,
      counts: {
        pending: countRow.pending ?? 0,
        approved: countRow.approved ?? 0,
        deleted: countRow.deleted ?? 0,
      },
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch {
    return jsonError("INTERNAL_ERROR", "잠시 후 다시 시도해주세요.", 500);
  }
}
