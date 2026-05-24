# ARCHITECTURE.md — 시스템 아키텍처

본 문서는 portfolio 프로젝트의 기술 아키텍처와 핵심 결정 근거를 정의한다. 모든 agent는 구현 시작 전 본 문서를 읽어야 한다.

---

## 시스템 개요

```
[방문자]
  │
  ▼ HTTPS (Let's Encrypt via NPM)
[Nginx Proxy Manager]  ← 기존 홈서버 인프라
  │   wnsdlr.com    → portfolio:PORT
  │   leejunik.com  → portfolio:PORT
  ▼
[portfolio Docker container]
  ├─ Next.js (App Router, SSR + Static)
  │    ├─ 정적 페이지/섹션 (Hero/About/Skills/...)
  │    ├─ /api/guestbook (POST/GET) — Route Handler
  │    ├─ /api/og — 동적 OG image
  │    └─ /sitemap.xml, /robots.txt
  ├─ SQLite (Docker volume 마운트)
  └─ GA4 (클라이언트 스크립트만)
```

---

## 핵심 기술 결정

### 1. Next.js App Router + Server Components 우선

| Why | 결정 |
|---|---|
| 정적 콘텐츠 위주이지만 방명록 = 일부 서버 필요 | App Router의 RSC + Route Handler 조합 |
| SEO 중요 (구직용) | SSR 가능 |
| 빠른 페이지 로드 | 정적 페이지는 Static, 방명록 API는 dynamic |
| 본인 학습 가치 | 최신 패턴 익히기 |

→ 모든 페이지는 기본 Server Component, 인터랙션 필요한 컴포넌트만 `"use client"`.

### 2. TypeScript Strict

| 항목 | 설정 |
|---|---|
| `strict` | `true` |
| `noUncheckedIndexedAccess` | `true` (배열 액세스 안전) |
| `any` 사용 | 금지 (필요 시 `unknown`으로 좁히기) |

### 3. 스타일

- **Tailwind CSS** (utility-first)
- DESIGN.md의 토큰을 `tailwind.config.ts` `theme.extend`에 직접 명시 (CSS 변수 indirection 없이 단순하게)
- 컴포넌트 변형은 `cva` (class-variance-authority) 또는 단순 props
- shadcn/ui 직접 도입 안 함 (디폴트 테마가 우리 디자인과 충돌). 필요한 primitive만 직접 작성

### 4. 폰트 로딩

- `next/font/local` 또는 `next/font/google`
- Pretendard: variable font, local 호스팅 (`PretendardVariable.woff2`)
- Schibsted Grotesk: Google Fonts
- JetBrains Mono: Google Fonts
- `font-display: swap`

### 5. 아이콘

- **Phosphor React** (`@phosphor-icons/react`) — Regular weight 통일
- **Lordicon** — `lord-icon-element` 또는 직접 Lottie 임포트 (호버 시 1회 재생)
- 직접 SVG 임포트는 Next/Image의 `<Image>` 사용 (priority 적절히)

### 6. 애니메이션

- **Framer Motion** (`motion/react` 패키지로 명명 변경됨) — 메인
- CSS transitions — 단순 hover
- View Transitions API — 페이지 전환 (Next.js 15+ 지원)
- 모든 모션 0.15~0.3초, ease-out 통일 (DESIGN.md)

### 7. 방명록 데이터 저장

| 옵션 | 평가 |
|---|---|
| **SQLite + better-sqlite3** ✅ | 단순, 파일 기반, 동시성 낮은 방명록에 적합, Docker volume 영속화 쉬움 |
| Postgres | 과잉, 별도 컨테이너 필요 |
| 외부 BaaS (Supabase 등) | 외부 의존, 비용/벤더락 |
| KV (Upstash) | 쓰기 패턴엔 가능하나 쿼리 약함 |

**결정**: SQLite. ORM은 `drizzle-orm` (가볍고 타입 안전) 또는 raw queries.
**경로**: `/data/guestbook.db` (Docker volume `portfolio-data:/data`).
**백업**: 일 1회 cron으로 백업 디렉토리에 복사 (infrastructure agent 책임).

### 8. 폼 보호 (방명록)

다층 방어:
1. **Length cap** — 100자 hard limit (클라이언트 + 서버 검증)
2. **Honeypot field** — 봇이 채우는 hidden field. 채워져 있으면 silent drop
3. **Rate limit** — IP당 5분에 1회. Edge middleware 또는 LRU map (서버 메모리, 컨테이너 재시작 시 reset OK)
4. **Cloudflare Turnstile** (선택) — 추후 봇 공격 발생 시 도입. 초기엔 1~3만으로
5. **Content moderation** — 단순 욕설 필터 + URL 필터 (선택)
6. **Admin 모더레이션** — DB에 `approved` boolean 필드. 관리자 토큰으로 승인/삭제

### 9. 분석

- **GA4** — gtag.js 클라이언트 스크립트
- 환경 변수 `NEXT_PUBLIC_GA_ID`
- 쿠키 동의 (한국 PIPA + GDPR 고려): 첫 방문 시 동의 banner. **거부 시 GA 안 로드**
- 로컬 개발에서는 비활성

### 10. SEO / 메타데이터

- Next.js 메타데이터 API 사용 (`generateMetadata`)
- OG image: `/api/og` 동적 생성 (Next.js `ImageResponse`)
- sitemap.xml: `app/sitemap.ts`
- robots.txt: `app/robots.ts`
- 다국어는 1차에 미지원 (한국어 only). i18n은 추후

---

## 모듈 구조

```
portfolio/
├── app/
│   ├── layout.tsx              루트 레이아웃 (폰트, 메타, GA)
│   ├── page.tsx                메인 페이지 (모든 섹션 조합)
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── opengraph-image.tsx     (정적 OG, 메인 페이지용)
│   └── api/
│       ├── guestbook/
│       │   ├── route.ts        POST + GET
│       │   └── [id]/
│       │       └── route.ts    DELETE (관리자만)
│       └── og/
│           └── route.tsx       동적 OG image (페이지/프로젝트별)
│
├── components/
│   ├── sections/               섹션 단위
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── TechStack.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Awards.tsx
│   │   ├── Education.tsx
│   │   ├── Guestbook.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── ui/                     primitive
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Icon.tsx            Phosphor wrapper
│   │   ├── LordIcon.tsx        Lordicon wrapper (client)
│   │   └── ...
│   └── shared/                 cross-cutting
│       ├── SignatureBlock.tsx  try/catch/finally 시그니처 컴포넌트
│       ├── AnalyticsScript.tsx GA4 클라이언트
│       └── ConsentBanner.tsx   쿠키 동의
│
├── lib/
│   ├── db.ts                   SQLite client / drizzle setup
│   ├── guestbook.ts            방명록 비즈니스 로직
│   ├── rate-limit.ts           IP 기반 rate limit (LRU)
│   ├── content.ts              CONTENT.md → typed data 변환 헬퍼
│   └── og.ts                   OG image 생성 헬퍼
│
├── content/                    실제 콘텐츠 (CONTENT.md 기반 typed data)
│   ├── profile.ts              About 데이터
│   ├── skills.ts               TechStack 데이터
│   ├── projects.ts             Projects 데이터
│   ├── experience.ts           Experience 데이터
│   ├── awards.ts               Awards 데이터
│   └── education.ts            Education 데이터
│
├── types/
│   └── index.ts                공유 타입 (Phase 4 초기 정의)
│
├── public/
│   ├── fonts/                  PretendardVariable.woff2
│   ├── icons/                  static SVG
│   ├── images/                 프로젝트 스크린샷 등
│   └── lottie/                 Lordicon JSON
│
├── data/                       (gitignore. Docker volume 마운트 포인트)
│   └── guestbook.db
│
└── deploy/
    ├── docker-compose.yml      (또는 기존에 service 추가)
    ├── Dockerfile
    └── nginx-proxy-manager/    NPM 설정 노트 (UI로 입력하므로 reference만)
```

---

## 데이터 흐름

### 정적 콘텐츠 (Hero/About/Skills 등)
```
CONTENT.md → 사람이 content/*.ts로 옮김 → typed 데이터로 import
            → Server Component가 직접 import 후 렌더
            → HTML로 SSG/SSR → 클라이언트로 전송
```

### 방명록 작성
```
브라우저 → Client Component (form) → POST /api/guestbook
       → Route Handler에서:
          1) honeypot 검사
          2) Zod validation (length, required)
          3) rate-limit 체크 (IP 기반)
          4) approved=false로 SQLite insert
       → 응답: { ok: true, pending: true }
       → 클라이언트: "후기가 등록되었습니다. 검토 후 노출됩니다" 표시
```

### 방명록 조회
```
Server Component (Guestbook 섹션) → GET /api/guestbook?limit=10
                                  → approved=true && deleted=false 인 것만
                                  → 최신순 정렬
                                  → 응답 JSON → 렌더
```

### 관리자 승인/삭제
```
방법 1: 별도 어드민 UI 만들지 않음 (학습 부담)
방법 2: GitHub Issues 방식 — 새 방명록 작성 시 webhook으로 디스코드/슬랙/이메일 알림
       → 본인이 SSH로 SQLite UPDATE 실행
방법 3: 간단한 어드민 페이지 (/admin/guestbook) — 환경변수 토큰으로 보호

→ 1차: 방법 2 (가장 단순)
→ 2차: 방법 3 (필요 시)
```

---

## 성능 예산 (Performance Budget)

Lighthouse 95+ 달성을 위한 가이드:

| 메트릭 | 목표 |
|---|---|
| LCP (Largest Contentful Paint) | < 1.5s |
| FID / INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.05 |
| Initial JS bundle (gzip) | < 100KB |
| 페이지 weight (initial) | < 500KB (HTML+CSS+JS) |

대응:
- 이미지는 `next/image` + 적절한 sizes
- 폰트 `font-display: swap`, subset
- Lordicon은 lazy load (Intersection Observer)
- 클라이언트 컴포넌트 최소화

---

## 보안 모델

| 영역 | 대응 |
|---|---|
| **방명록 spam** | honeypot + rate limit + length cap + 모더레이션 |
| **XSS** | React 기본 escape + 방명록 텍스트는 plain text only (HTML 입력 X) |
| **CSRF** | same-origin POST + 헤더 검증. /api/guestbook은 same-origin enforce |
| **시크릿 노출** | `.env.local` (gitignore), 클라이언트 노출 변수만 `NEXT_PUBLIC_` prefix |
| **관리자 작업** | 환경변수 토큰 (`ADMIN_TOKEN`), DELETE 엔드포인트는 헤더 검증 |
| **HTTPS** | NPM이 Let's Encrypt 자동. 모든 트래픽 HTTPS |
| **Cookie** | GA4 쿠키만, 동의 필요 |

---

## 브라우저 지원

- **최신 2 버전**: Chrome / Safari / Firefox / Edge
- IE: 지원 안 함
- Mobile: Safari iOS 14+, Chrome Android 100+
- `browserslist`:
  ```
  > 0.5%, last 2 versions, not dead, not ie 11
  ```

---

## 환경 변수

`.env.example` 에 다음 정의 (실제 값은 `.env.local` — gitignore):

```bash
# Public (브라우저 노출됨)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://wnsdlr.com

# Server-only
ADMIN_TOKEN=<long-random-string>
DB_PATH=/data/guestbook.db
RATE_LIMIT_WINDOW_MS=300000          # 5분
RATE_LIMIT_MAX_REQUESTS=1            # 5분당 1회
```

---

## 의존성 정책

- **추가 시 review 필요**: 새 라이브러리는 ARCHITECTURE.md에 추가 + orchestrator 승인
- **Lock file**: pnpm-lock.yaml commit
- **번들 크기 영향 모니터링**: `pnpm build` 시 출력 사이즈 체크
- **License**: MIT/Apache-2.0/ISC만. GPL/AGPL 도입 시 사용자 확인

---

## 향후 확장 포인트 (Phase 10+)

- 다크모드
- i18n (영문)
- 블로그 (`/blog/[slug]`) + RSS
- 방명록 admin UI
- 시그니처 일러스트/Lottie 자체 제작
- Cloudflare Turnstile 도입
- 모니터링 (Sentry, Uptime Kuma 연동)
