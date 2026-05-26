import { z } from "zod";
import { buildSessionCookie, signSession } from "@/lib/admin-session";
import { getAdminCredentials, verifyPassword, verifyUsername } from "@/lib/admin-password";
import { extractIp, hashIp } from "@/lib/ip-hash";
import { checkLoginAttempt, recordLoginFailure } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

function jsonError(
  code: "VALIDATION_ERROR" | "UNAUTHORIZED" | "RATE_LIMITED" | "INTERNAL_ERROR",
  message: string,
  status: number,
  extraHeaders?: HeadersInit,
) {
  return new Response(JSON.stringify({ error: { code, message } }), {
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

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "ID와 비밀번호를 모두 입력해주세요.", 400);
  }
  const { username, password } = parsed.data;

  const ipHash = hashIp(extractIp(req));
  const lockKey = `login:${ipHash}`;
  const lock = checkLoginAttempt(lockKey);
  if (!lock.allowed) {
    return jsonError(
      "RATE_LIMITED",
      "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
      429,
      { "retry-after": String(lock.retryAfterSec) },
    );
  }

  let creds;
  try {
    creds = getAdminCredentials();
  } catch {
    return jsonError("INTERNAL_ERROR", "서버 설정 오류입니다.", 500);
  }

  const userOk = verifyUsername(username, creds.username);
  const passOk = userOk && verifyPassword(password, creds.passwordHash);

  if (!userOk || !passOk) {
    recordLoginFailure(lockKey);
    return jsonError("UNAUTHORIZED", "잘못된 ID 또는 비밀번호입니다.", 401);
  }

  let token: string;
  try {
    token = await signSession({ sub: "admin" });
  } catch {
    return jsonError("INTERNAL_ERROR", "세션 발급 실패.", 500);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": buildSessionCookie(token),
      "cache-control": "no-store",
    },
  });
}
