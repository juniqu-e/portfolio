import { timingSafeEqual } from "node:crypto";

export function isAdminAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length < 16) return false;

  const header = req.headers.get("authorization");
  if (!header) return false;
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) return false;
  const provided = match[1]!.trim();

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function unauthorized(): Response {
  return new Response(
    JSON.stringify({ error: { code: "UNAUTHORIZED", message: "Unauthorized." } }),
    { status: 401, headers: { "content-type": "application/json; charset=utf-8" } },
  );
}

export function notFound(): Response {
  return new Response(
    JSON.stringify({ error: { code: "NOT_FOUND", message: "Not found." } }),
    { status: 404, headers: { "content-type": "application/json; charset=utf-8" } },
  );
}
