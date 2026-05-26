import { buildClearedSessionCookie } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": buildClearedSessionCookie(),
      "cache-control": "no-store",
    },
  });
}
