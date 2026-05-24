# API.md — API 명세

본 문서는 portfolio의 API 엔드포인트를 정의한다. backend agent + reviewer의 주요 참조 문서.

규칙:

- 모든 API는 Next.js App Router의 Route Handler (`app/api/.../route.ts`)
- 응답은 Web `Response` API + JSON
- 검증은 Zod
- 타입은 `types/api.ts` (또는 `types/index.ts`)에 정의

---

## 베이스 URL

- 개발: `http://localhost:3000`
- 프로덕션: `https://wnsdlr.com` (및 `https://leejunik.com`)

---

## 인증

대부분 endpoint는 인증 불필요. 관리자 endpoint만 헤더 토큰.

```
Authorization: Bearer <ADMIN_TOKEN>   ← env에 정의
```

---

## 공통 에러 응답 형식

```json
{
  "error": {
    "code": "VALIDATION_ERROR" | "RATE_LIMITED" | "NOT_FOUND" | "UNAUTHORIZED" | "INTERNAL_ERROR",
    "message": "사용자에게 보여줄 수 있는 메시지",
    "details": [ { "field": "...", "issue": "..." } ]  // 검증 에러 시
  }
}
```

HTTP status:

- 400: VALIDATION_ERROR
- 401: UNAUTHORIZED
- 404: NOT_FOUND
- 429: RATE_LIMITED
- 500: INTERNAL_ERROR

---

## 1. 방명록 API

### 1.1 `POST /api/guestbook` — 방명록 작성

**Body** (JSON):

```ts
{
  name?: string;       // 선택, 최대 20자, 미입력/빈 문자열이면 서버가 "익명" 으로 저장 (DB nullable)
  body: string;        // 필수, 1~100자 (types/index.ts GuestbookEntry.body 와 일치)
  honeypot?: string;   // hidden field. 채워져 있으면 봇으로 판단
}
```

**Validation (Zod)**:

```ts
const schema = z.object({
  name: z.string().max(20).optional(), // 빈/없음 → 서버에서 "익명" 또는 null 처리
  body: z.string().min(1).max(100),
  honeypot: z.string().optional(),
});
```

**보안 처리 흐름**:

1. **Honeypot 검사**: `honeypot`이 비어있지 않으면 → 200 OK 응답하되 DB 저장 안 함 (silent drop, 봇이 실패 모르게)
2. **Rate limit**: 동일 IP가 5분 내에 이미 요청했으면 429 응답
3. **Length 검증**: Zod schema
4. **content 정제**:
   - 양 끝 공백 trim
   - 줄바꿈 정규화 (\r\n → \n)
   - HTML/스크립트 escape (저장은 raw text, 출력 시 React가 자동 escape)
5. **DB insert**: approved=false 로 저장

**응답** (201):

```json
{
  "ok": true,
  "pending": true,
  "message": "후기가 등록되었습니다. 검토 후 노출됩니다."
}
```

**에러**:

- 400 VALIDATION_ERROR — message 너무 길거나 누락
- 429 RATE_LIMITED — "잠시 후 다시 시도해주세요"

**비고**:

- IP 추출: `request.headers.get('x-forwarded-for')` 또는 `x-real-ip` 우선, 없으면 connection IP
- Cloudflare 등 프록시 뒤에 있으면 NPM이 set
- 클라이언트 측 IP만 보지 말 것 (스푸핑 가능)

---

### 1.2 `GET /api/guestbook` — 방명록 목록 조회

**Query Parameters**:

```
limit?: number  (default 10, max 50)
cursor?: number (id of last item, for pagination — SQLite integer id)
```

**응답** (200) — `types/index.ts` 의 `GuestbookEntry[]` 와 일치:

```json
{
  "items": [
    {
      "id": 12345,
      "name": "익명",
      "body": "응원합니다!",
      "createdAt": "2026-05-24T22:00:00Z"
    }
  ],
  "nextCursor": 12340 | null
}
```

**조건**:

- `approved = true AND deleted = false` 만 반환
- `createdAt DESC` 정렬 (DB 컬럼은 `created_at` snake_case, 응답 직렬화 시 camelCase 변환)
- `name`은 빈 문자열이면 "익명"으로 대체. DB에 null 저장된 경우도 응답에선 "익명"

**Caching**:

- `Cache-Control: public, s-maxage=30, stale-while-revalidate=60` (CDN/NPM이 30초 캐싱 OK)
- 새 방명록 승인 시 캐시 무효화는 자연스럽게 (60초 내 갱신)

**에러**: 500 INTERNAL_ERROR (DB 장애 시)

---

### 1.3 `DELETE /api/guestbook/:id` — 방명록 삭제 (관리자)

**인증**: `Authorization: Bearer <ADMIN_TOKEN>`

**Path Parameter**: `id` — guestbook 행 ID

**동작**: soft delete (`deleted = true` 업데이트)

**응답** (200):

```json
{ "ok": true }
```

**에러**:

- 401 UNAUTHORIZED — 토큰 없거나 틀림
- 404 NOT_FOUND — id 존재 안 함

---

### 1.4 `PATCH /api/guestbook/:id/approve` — 방명록 승인 (관리자)

**인증**: `Authorization: Bearer <ADMIN_TOKEN>`

**동작**: `approved = true` 업데이트

**응답** (200): `{ "ok": true }`

**에러**: 동일

---

## 2. OG Image 생성

### 2.1 `GET /api/og` — 동적 OG image

**Query Parameters**:

```
title?: string  (default: "이준익 / Lee Junik")
subtitle?: string  (default: "DevOps / Platform Engineer")
```

**응답**: 1200×630 PNG 이미지

**구현**: Next.js `ImageResponse` (`next/og`)

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  // 파라미터 파싱 + ImageResponse 생성
  // 디자인: 흰 배경 + 큰 이름 + try/catch/finally 시그니처
}
```

**캐싱**: `Cache-Control: public, max-age=86400` (24시간)

---

## 3. SEO 정적 파일 (Next.js native)

### 3.1 `GET /sitemap.xml`

**구현**: `app/sitemap.ts`

```ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://wnsdlr.com", lastModified: new Date(), priority: 1 },
    // (선택) /projects/[slug] 라우트 생기면 동적 추가
  ];
}
```

### 3.2 `GET /robots.txt`

**구현**: `app/robots.ts`

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://wnsdlr.com/sitemap.xml",
  };
}
```

---

## 데이터베이스 스키마 (SQLite)

```sql
CREATE TABLE guestbook (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,  -- SQLite native integer (types/index.ts: id: number)
  name        TEXT,                                -- nullable, 미입력/빈 → null, 응답에선 "익명"
  body        TEXT NOT NULL,                       -- 본문 (types/index.ts: body: string)
  ip_hash     TEXT NOT NULL,                       -- SHA-256(ip + IP_HASH_SALT)
  approved    INTEGER NOT NULL DEFAULT 0,          -- 0=대기, 1=승인
  deleted     INTEGER NOT NULL DEFAULT 0,          -- soft delete
  created_at  TEXT NOT NULL,                       -- ISO 8601, 응답 직렬화 시 createdAt
  updated_at  TEXT NOT NULL
);

CREATE INDEX idx_guestbook_visible
  ON guestbook (approved, deleted, created_at DESC)
  WHERE deleted = 0 AND approved = 1;

CREATE INDEX idx_guestbook_ip_recent
  ON guestbook (ip_hash, created_at DESC);
```

**IP 처리**: raw IP는 저장하지 않음 (개인정보 보호). SHA-256(IP + secret salt) 저장. rate-limit 검증 시 같은 방식으로 해시 후 비교.

**Migration**: 1차에는 raw SQL `CREATE TABLE` 실행 (앱 부팅 시 1회). 추후 drizzle-kit migration 도입 고려.

---

## Rate Limit 구현

```ts
// lib/rate-limit.ts
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, number>({
  max: 10000,
  ttl: 5 * 60 * 1000, // 5분
});

export function checkRateLimit(ipHash: string): boolean {
  const last = cache.get(ipHash);
  if (last && Date.now() - last < 5 * 60 * 1000) return false;
  cache.set(ipHash, Date.now());
  return true;
}
```

**제약**: 메모리 기반이라 컨테이너 재시작 시 reset. portfolio 규모에선 충분. 더 엄격히 하려면 DB 기반으로 (별도 테이블 + index)

---

## 검증 / 보안 체크리스트

backend agent + reviewer 가 검사:

### 모든 API 공통

- [ ] Zod schema로 입력 검증
- [ ] 응답에 stack trace / 내부 경로 노출 안 됨
- [ ] error 메시지는 사용자 친화적 (영문/한글 일관)
- [ ] CORS: same-origin only (외부 도메인 차단)
- [ ] HTTPS 강제 (NPM 레벨에서)

### Guestbook 전용

- [ ] honeypot 체크 first (DB 접근 전)
- [ ] rate-limit 체크 (DB 접근 전)
- [ ] Zod 검증 통과
- [ ] IP 해시 처리 (raw IP 저장 X)
- [ ] message는 1~100자
- [ ] HTML/script 입력은 plain text로 저장, 출력 시 React escape
- [ ] approved=false로 초기 저장
- [ ] 모더레이션 큐 알림 (선택, Phase 후반)

### Admin 전용

- [ ] `Authorization: Bearer` 헤더 검증
- [ ] 토큰 비교는 timing-safe (`crypto.timingSafeEqual`)
- [ ] 토큰 누락/오류 시 401 (404 X — 존재 정보 누설 방지 위해)
- [ ] HTTPS 강제

---

## 환경 변수 의존

API가 사용하는 env (ARCHITECTURE.md `.env.example` 참조):

```bash
ADMIN_TOKEN=<random 32+ chars>
DB_PATH=/data/guestbook.db
RATE_LIMIT_WINDOW_MS=300000
RATE_LIMIT_MAX_REQUESTS=1
IP_HASH_SALT=<random 32+ chars>     # IP 해시용 salt
```

`IP_HASH_SALT`가 바뀌면 기존 IP hash는 매칭 불가. salt는 영속화 + 백업 필요.

---

## 향후 확장

- **2차 추가 시점**:
  - Cloudflare Turnstile 도입 (`/api/guestbook` POST 시 token 검증)
  - 모더레이션 webhook (디스코드/슬랙 알림)
  - admin UI (`/admin/guestbook`)
- **3차 (선택)**:
  - 댓글 좋아요/신고
  - RSS feed for 방명록
  - 프로젝트별 댓글 (분리된 endpoint)
