import { getDb } from "@/lib/db";
import { notFound, requireSession, unauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!(await requireSession(req))) return unauthorized();

  const { id: rawId } = await params;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isInteger(id) || id <= 0) return notFound();

  const now = new Date().toISOString();
  const result = getDb()
    .prepare(`UPDATE guestbook SET deleted = 1, updated_at = ? WHERE id = ? AND deleted = 0`)
    .run(now, id);

  if (result.changes === 0) return notFound();
  return Response.json({ ok: true }, { status: 200 });
}
