import {
  readSessionCookieFromHeader,
  verifySession,
  type SessionPayload,
} from "@/lib/admin-session";

export async function requireSession(req: Request): Promise<SessionPayload | null> {
  return verifySession(readSessionCookieFromHeader(req));
}

export function unauthorized(): Response {
  return new Response(
    JSON.stringify({ error: { code: "UNAUTHORIZED", message: "Unauthorized." } }),
    { status: 401, headers: { "content-type": "application/json; charset=utf-8" } },
  );
}

export function notFound(): Response {
  return new Response(JSON.stringify({ error: { code: "NOT_FOUND", message: "Not found." } }), {
    status: 404,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
