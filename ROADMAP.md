# ROADMAP — Portfolio Implementation

본 문서는 portfolio 구현의 단계와 진행 상황을 추적한다. 작업 단위는 phase, 각 phase는 명확한 산출물과 검증 기준을 가진다.

전체 전략: **문서 → 도구(Harness/bkit/skill/agent) → 코드 → 배포** 순서로 단단하게 쌓아 올린다.

---

## Phase 0 — Foundation 문서 (현재)

**산출물**:

- ✅ DESIGN.md — 디자인 시스템 정의
- ✅ CONTENT.md — 콘텐츠 원본
- ✅ README.md — 프로젝트 소개 (개정)
- ✅ CLAUDE.md — Claude Code 컨텍스트
- ✅ ROADMAP.md — 본 문서

**검증**: 모든 문서가 일관되며 source of truth로 기능. 코드 작성 없이 의사결정 가능.

---

## Phase 1 — Harness 세팅

**산출물**:

- `portfolio/.claude/settings.json` — 프로젝트 권한, 모델, 환경
- `portfolio/.claude/settings.local.json` (gitignore) — 로컬 실험 설정
- 유용한 hook 설정:
  - `PostToolUse` Write/Edit → 자동 포맷 (prettier가 있을 때)
  - `PreToolUse` Bash → 위험 명령 가드 (rm -rf 등)
  - `UserPromptSubmit` → 큰 변경 시 DESIGN.md/CONTENT.md 참조 리마인더
- `.gitignore` 정비 (`.claude/settings.local.json`, `node_modules`, `.next` 등)

**검증**: Claude Code가 portfolio/에서 작업 시 settings이 적용됨 (hook 실행 확인).

---

## Phase 2 — bkit 설치 및 검증

**산출물**:

- `claude plugin install bkit` 실행
- `/control level` 적정 설정 (초기 L1 또는 L2 권장)
- bkit가 제공하는 38 skills / 36 agents 카탈로그 확인
- 간단한 dry run: `/pdca`로 더미 피처 1개 돌려서 흐름 체험

**검증**: bkit 명령이 정상 동작. PDCA 8-phase가 어떻게 흐르는지 이해 완료.

---

## Phase 3 — 커스텀 Skill / Agent

**산출물**:

- `portfolio/.claude/skills/` 디렉토리에 본 프로젝트 특화 skill 1~2개
  - 예: `/refresh-content` — CONTENT.md 변경 시 영향받는 컴포넌트 식별
  - 예: `/check-design-rule` — 작성한 컴포넌트가 DESIGN.md 안티패턴 위반 여부 검사
- `portfolio/.claude/agents/` 디렉토리에 본 프로젝트 특화 agent 1~2개
  - 예: `design-auditor` — 디자인 가드레일 위반 자동 감지
  - 예: `content-editor` — CONTENT.md 톤/문장 다듬기

**검증**: 커스텀 skill/agent 실제 호출해서 의도대로 동작.

---

## Phase 4 — Next.js 프로젝트 초기화 + 디자인 토큰

**산출물**:

- ✅ Next.js 15.5 + React 19 + TypeScript strict + App Router (`pnpm create next-app` 대신 수동 구성)
- ✅ `tailwind.config.ts` — DESIGN.md 토큰 입력 (컬러 9개 / 폰트 3종 / `out-quart` easing / `prose` max-width)
- ✅ `app/fonts.ts` + `app/layout.tsx` — Pretendard (local woff2) + Schibsted Grotesk + JetBrains Mono 로드
- ✅ Phosphor (`@phosphor-icons/react`) + Lordicon (`lord-icon-element` + `lottie-web`) 설치
- ✅ Motion (구 Framer Motion) 설치
- ✅ 기본 layout shell — `components/sections/Header.tsx` + `Footer.tsx` (Header는 reviewer 지적으로 glassmorphism 제거 → border-b만 유지)
- ✅ `types/index.ts` — Project / Skill / Experience / Award / Education / Guestbook 등 contract types 동결
- ✅ `lib/utils.ts` — `cn()` 헬퍼 (clsx + tailwind-merge)
- ✅ Prettier + `prettier-plugin-tailwindcss` 설정 (`.prettierrc.json` / `.prettierignore`)

**검증**: ✅ typecheck / lint / build PASS. First Load JS 106KB. `/check-design-rule` PASS (12 안티패턴 무위반).

---

## Phase 5 — Hero 섹션 구현 (시그니처 검증)

**산출물**:

- ✅ `components/sections/Hero.tsx` (RSC)
- ✅ `components/ui/CodeBlock.tsx` — 자체 mini-highlighter (라이브러리 의존 X)
- ✅ try/catch/finally 코드 블록 시그니처 시각화 (JetBrains Mono + DESIGN 토큰 컬러)
- ✅ 이름 + 역할 + 모토 (CONTENT.md Identity 그대로)
- ✅ CSS-only 호버 인터랙션 (motion 라이브러리 미사용)
- ✅ `app/page.tsx` — anchor placeholder 구조 도입

**검증**: ✅ 4 게이트 (typecheck / lint / build / `/check-design-rule`) PASS. First Load JS 106KB 유지. AI 클리셰 없음.

---

## Phase 6 — About / Tech Stack 섹션

**산출물**:

- ✅ `components/sections/About.tsx` (RSC) — 본문 + 정체성 요약 표 (dl 2-col, `bg-accent-blue/5` 호버)
- ✅ `components/sections/TechStack.tsx` (RSC) — 6 카테고리 grid (2/3/4/6 컬럼 반응형, `bg-panel`, `scale-1.03` 호버)
- ✅ `components/ui/Icon.tsx` — brand-first / Phosphor-fallback wrapper (registry 패턴)
- ✅ `content/profile.ts`, `content/skills.ts` — 데이터 분리
- ✅ types 확장 — `Profile` / `ParaSegment` / `IdentityRow`
- ✅ **follow-up**: `public/icons/` 26 devicon 브랜드 SVG + Phosphor placeholder 대체 (OPA→ShieldCheck). 호버 멀티컬러 호환을 위해 icon 색 전환 제거, 컨테이너 `border-line-strong` + 라벨 `text-accent-blue`로 시각 피드백 유지

**검증**: ✅ 4 게이트 PASS. First Load JS 106KB 유지. 진행도 바 0건.

---

## Phase 7 — Experience / Projects 섹션

**산출물**:

- ✅ `components/sections/Experience.tsx` (RSC) — SSAFY 13기 · 14기 실습코치 상세
- ✅ `components/sections/Projects.tsx` (RSC, `bg-panel`) — 4 그룹 / 6 카드
- ✅ `components/ui/ProjectCard.tsx` (client, `scale-1.02` 호버) — 수상 trophy 강조 + 모달 trigger
- ✅ `components/ui/ProjectModal.tsx` (client) — native `<dialog>` + `forwardRef` + `useImperativeHandle` + problem / solution / tech 구조
- ✅ `content/experience.ts` / `content/projects.ts` (6 프로젝트) / `content/project-groups.ts` — 데이터 분리

**검증**: ✅ 4 게이트 PASS. 번들: page 3.46→6.76KB, First Load 106→109KB (모달 클라이언트 컴포넌트 도입 비용).

---

## Phase 8 — Awards / Education / Contact / Footer

**산출물**:

- ✅ `components/sections/Awards.tsx` — 3행 (1등 1건 + 2등 2건), 1등 `accent-blue` 강조 + Trophy 라벨, 행 hover tint
- ✅ `components/sections/Education.tsx` — CKA/정처기 진행중은 `accent-pink/15` pill, 정치외교학과는 "학사" (reviewer WARN 해소: `kind === "education" && status === "completed" → "학사"` 분기)
- ✅ `components/sections/Contact.tsx` — 3 링크 (Email mailto / GitHub / Velog), `aria-label` + external `rel="noopener noreferrer"`
- ✅ `components/sections/Footer.tsx` 보강 — mini 2-line try/catch/finally 시그니처 + 모토 (Hero와 1글자 일치) + copyright
- ✅ `content/{awards,education,contact}.ts` — 데이터 분리
- ✅ 메타데이터: `app/icon.tsx` (favicon "L." + accent-blue dot) / `app/opengraph-image.tsx` (1200×630, 시스템 sans + 인라인 토큰 hex) / `app/sitemap.ts` / `app/robots.ts` / `app/layout.tsx` Person JSON-LD
- ✅ `app/page.tsx` — 8 섹션 전체 마운트 (placeholder 제거)

**검증**: ✅ reviewer 6-게이트 PASS (1 WARN 해소 후). 8 routes 정적 prerender. page 6.76KB / First Load JS 109KB 유지. OG/icon/themeColor raw hex 모두 DESIGN.md 토큰 정확 매핑. 사용자 시각 검증 PASS.

---

## Phase 9 — 배포 (홈서버) ✅

**산출물**:

- ✅ Dockerfile (multi-stage node:22-slim + corepack pnpm + non-root + node fetch healthcheck)
- ✅ `.dockerignore` + `deploy/docker-compose.yml` (GHCR image + portfolio-data volume + env_file + npm-proxy 외부 네트워크 + 로그회전 + 메모리 limit)
- ✅ `.github/workflows/ci.yml` (matrix typecheck/lint/build, Node 22 + pnpm cache)
- ✅ `deploy/DEPLOY_RUNBOOK.md` (사용자 9-단계 실배포 절차 + 롤백 + 트러블슈팅)
- ✅ GHCR `ghcr.io/juniqu-e/portfolio` (public) — `:latest` + git SHA 태그
- ✅ 홈서버 배포 (Cloudflare Tunnel → NPM → portfolio:3000)
- ✅ 4 도메인 연결: `wnsdlr.com`, `www.wnsdlr.com`, `leejunik.com`, `www.leejunik.com` (NPM 단일 Proxy Host 4 Domain Names)
- ✅ HTTPS (Cloudflare 종단, NPM 자체 SSL X — 기존 인프라 일관)
- ⏳ 모니터링 (uptime/error) — 후속 (Phase 10+)

**검증**: ✅ 외부 4 도메인 모두 HTTP 200, Brotli 압축, `x-nextjs-cache: HIT`, 한글 콘텐츠 정상. 메타 라우트 4종 (`/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon`) 모두 200. 컨테이너 47MB / 512MB, 0.02% CPU.

---

## Phase 10 — 방명록 (Guestbook) + /api/health ✅

**산출물**:

- ✅ `lib/db.ts` — better-sqlite3 싱글톤 + WAL + CREATE TABLE IF NOT EXISTS + 인덱스 2건 + HMR-safe globalThis
- ✅ `lib/ip-hash.ts` — SHA-256(ip + IP_HASH_SALT), salt<16 throw, extractIp 헬퍼
- ✅ `lib/rate-limit.ts` — 메모리 Map + lazy sweep (Redis 미도입), retryAfterSec
- ✅ `lib/admin-auth.ts` — Bearer + timingSafeEqual, ADMIN_TOKEN<16 거부
- ✅ `app/api/health/route.ts` — Dockerfile HEALTHCHECK 의존 해소 (healthy 전환)
- ✅ `app/api/guestbook/route.ts` — POST(Zod + honeypot silent + rate-limit + INSERT approved=0) / GET(approved∧¬deleted, cursor pagination, Cache-Control)
- ✅ `app/api/guestbook/[id]/route.ts` — admin DELETE soft (404 동시성 안전)
- ✅ `app/api/guestbook/[id]/approve/route.ts` — admin PATCH
- ✅ `components/sections/Guestbook.tsx` + `components/ui/{GuestbookForm,GuestbookList}.tsx` + `lib/relative-time.ts` (한국어 상대시간)
- ✅ types/index.ts `+GuestbookListResponse`, pnpm-workspace.yaml 부활 (pnpm v10+ onlyBuiltDependencies 요구)

**검증**: ✅ reviewer 6-게이트 PASS 0 WARN. 보안 A~G 전부 ✅ (IP hash / admin timing-safe / honeypot pre-DB / rate-limit / Zod / XSS / 계약 정합). docker build PASS 295MB. 로컬 15 curl 시나리오 PASS. 라이브 검증: `/api/health` 200, GET 빈, POST 201, honeypot silent 201, rate-limit 429, admin 401/200/200, soft delete + 동시성 404. 컨테이너 healthy 전환 (Phase 9 unhealthy 해소). 번들 page 6.76→9.05KB / First Load 109→111KB.

---

## Phase 11+ — 후속 개선

보류 항목:

- 다크모드 추가
- 유료 아이콘 팩 도입 (Streamline / Untitled UI Icons)
- 시그니처 일러스트/Lottie 자체 제작
- 블로그 섹션 또는 Velog 임베드
- i18n (영문 버전)
- Lighthouse 100점 튜닝
- `.github/workflows/deploy.yml` 자동화 (현재 수동 docker push + compose up)
- 모니터링 통합 (Uptime Kuma / Sentry)
- 방명록 admin UI (`/admin/guestbook`) — 현재는 curl PATCH/DELETE

---

## 진행 현황 추적

각 phase 시작 시 해당 섹션의 ✅ 체크. 막힘이 생기면 해당 phase 내 메모로 기록.

| Phase                                                | 상태                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| 0 — Foundation 문서                                  | ✅ 완료                                                        |
| 1 — Harness 세팅                                     | ✅ 완료                                                        |
| 2 — bkit 설치                                        | ✅ 완료                                                        |
| 2.5 — 멀티에이전트 인프라 (AGENTS/STATUS + 6 agents) | ✅ 완료                                                        |
| 3 — 커스텀 skill/agent                               | ✅ 완료 (design-auditor + check-design-rule + refresh-content) |
| 4 — Next.js 초기화                                   | ✅ 완료 (15.5 + React 19 + Tailwind 토큰화 + 폰트 3종 + shell) |
| 5 — Hero 구현                                        | ✅ 완료 (Hero RSC + CodeBlock 자체 highlighter)                |
| 6 — About / Tech Stack                               | ✅ 완료 (About + TechStack + Icon wrapper + devicon 26)        |
| 7 — Experience / Projects                            | ✅ 완료 (Experience + 6 프로젝트 카드 + native dialog modal)   |
| 8 — Awards / Education / Contact / Footer            | ✅ 완료 (4 섹션 + OG/icon/sitemap/robots/Person JSON-LD)       |
| 9 — 배포                                             | ✅ 완료 (CF Tunnel → NPM → portfolio, 4 도메인, GHCR public)   |
| 10 — 방명록 + /api/health                            | ✅ 완료 (SQLite + Zod + rate-limit + admin auth, 라이브 검증)  |
| 11 — 방명록 admin UI                                 | ✅ 완료 (/admin/guestbook + AdminGate + 4-탭 + admin API)      |
| 12 — admin 세션 인증 (ID+PW + 쿠키)                  | ✅ 완료 (/admin/login + middleware + bcrypt + HMAC 24h 세션)   |
