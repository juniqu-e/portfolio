import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/admin-session";

// 대표 주소는 leejunik.com (2026-10-15). 옛 주소 wnsdlr.com · www.* 는 경로 그대로 308 영구 이동.
// ccna.wnsdlr.com 같은 하위 서비스는 이 컨테이너로 오지 않으므로 영향 없음.
const CANONICAL_HOST = "leejunik.com";
const LEGACY_HOSTS = new Set(["wnsdlr.com", "www.wnsdlr.com", "www.leejunik.com"]);

export async function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0]!.toLowerCase();
  if (LEGACY_HOSTS.has(host)) {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") return NextResponse.next();

  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(cookie);
  if (session) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  if (pathname !== "/admin") {
    url.searchParams.set("next", pathname);
  }
  return NextResponse.redirect(url);
}

export const config = {
  // 정적 자산은 제외 — 호스트 이동은 페이지·API 요청에서만 일어나면 충분하다.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
