# Changelog

본 프로젝트의 모든 주요 변경 사항을 기록한다.

형식은 [Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/)을 따르고, 버전 규약은 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따른다.

Phase는 [ROADMAP.md](./ROADMAP.md)와 매칭되며, 머지 직후 commit hash를 entry에 첨부한다.

---

## [Unreleased]

### Added

- **Phase 9 — 배포 (홈서버) 완료** 🚀
  - 인프라 자산 (사전 작성): `Dockerfile` (multi-stage node:22-slim + corepack pnpm@9.15.0 + non-root + node fetch healthcheck), `.dockerignore`, `deploy/docker-compose.yml` (GHCR image + portfolio-data volume + env_file + npm-proxy 외부 네트워크 + 로그회전 + 메모리 limit), `.github/workflows/ci.yml` (matrix typecheck/lint/build), `deploy/DEPLOY_RUNBOOK.md`, `deploy/nginx-proxy-manager/notes.md` _(commits: f9f1c95, 818728c)_
  - 실배포 (사용자 실행): `.env` 작성 (`openssl rand -hex 32` × 2 — `ADMIN_TOKEN` + `IP_HASH_SALT`), GHCR push (`docker login` + `docker push ghcr.io/juniqu-e/portfolio:latest` + git SHA 태그), `docker compose up -d`, NPM UI Proxy Host 등록, Cloudflare DNS 4건 CNAME 추가, cloudflared `~/homeserver/cloudflared/config.yml` ingress 3건 추가
  - 4 도메인 라이브: `wnsdlr.com`, `www.wnsdlr.com`, `leejunik.com`, `www.leejunik.com` (NPM 단일 Proxy Host 4 Domain Names)
  - 트래픽 경로: `사용자 → Cloudflare → cloudflared tunnel → localhost:80 (NPM) → portfolio:3000 (Next.js standalone)`
  - SSL: Cloudflare 종단 처리 (NPM 자체 SSL 미사용)
  - 운영: HTTP 200, Brotli 압축, `x-nextjs-cache: HIT`, 메타 라우트 4종 정상, 컨테이너 47MB/512MB · 0.02% CPU
- **Phase 8 — Awards / Education / Contact / Footer + 메타데이터** _(commit: a3c33c3)_
  - `components/sections/Awards.tsx` — 3행 (1등 1건 + 2등 2건), 1등 `accent-blue` + Trophy 라벨, 행 hover tint
  - `components/sections/Education.tsx` — CKA / 정처기 진행중 `accent-pink/15` pill, 정치외교학과 "학사" 표기
  - `components/sections/Contact.tsx` — Email mailto / GitHub / Velog 3 링크, `aria-label` + external `rel="noopener noreferrer"`
  - `components/sections/Footer.tsx` 보강 — mini 2-line try/catch/finally 시그니처 + 모토 (Hero 1글자 일치) + copyright
  - `content/awards.ts` / `content/education.ts` / `content/contact.ts` — 데이터 분리
  - 메타데이터 라우트: `app/icon.tsx` (favicon "L." + accent-blue dot) / `app/opengraph-image.tsx` (1200×630, 시스템 sans + 인라인 토큰 hex) / `app/sitemap.ts` / `app/robots.ts`
  - `app/layout.tsx` — Person JSON-LD (`@context`, `@type`, `name`, `jobTitle`, `sameAs`)
  - `app/page.tsx` — placeholder 제거, 8 섹션 전체 마운트
  - 8 routes 정적 prerender, page 6.76KB / First Load JS 109KB 유지
- **Phase 7 — Experience + Featured Projects + Modal** _(commit: fba8653)_
  - `components/sections/Experience.tsx` (RSC) — SSAFY 13기 · 14기 실습코치
  - `components/sections/Projects.tsx` (RSC, `bg-panel`) — 4 그룹 / 6 카드
  - `components/ui/ProjectCard.tsx` (client) — 수상 trophy 강조, `scale-1.02` 호버, 모달 trigger
  - `components/ui/ProjectModal.tsx` (client) — native `<dialog>` + `forwardRef` + `useImperativeHandle`, problem / solution / tech 구조
  - `content/experience.ts` / `content/projects.ts` (6 프로젝트) / `content/project-groups.ts`
  - 번들: page 3.46→6.76KB, First Load 106→109KB
- **Phase 6 — About + Tech Stack + Icon wrapper** _(commit: 61fbce6)_
  - `components/sections/About.tsx` (RSC) — 본문 + 정체성 요약 표 (dl 2-col, `bg-accent-blue/5` 호버)
  - `components/sections/TechStack.tsx` (RSC) — 6 카테고리 grid (2/3/4/6 컬럼 반응형, `scale-1.03` 호버)
  - `components/ui/Icon.tsx` — Phosphor registry wrapper (brand SVG follow-up 슬롯)
  - `content/profile.ts` / `content/skills.ts` — 데이터 분리
  - `types/index.ts` 확장 — `Profile` / `ParaSegment` / `IdentityRow`
- **Phase 5 — Hero 섹션** _(commit: 220f691)_
  - `components/sections/Hero.tsx` (RSC) — try/catch/finally 시그니처 + 이름 + 역할 + 모토 + CSS-only 호버
  - `components/ui/CodeBlock.tsx` — 자체 mini-highlighter (라이브러리 의존 X, JetBrains Mono + DESIGN 토큰)
  - `app/page.tsx` — anchor placeholder 구조 도입
- **Phase 4 — Next.js 초기화 + 디자인 토큰** _(commit: d160198)_
  - Next.js 15.5 + React 19 + TypeScript strict 수동 구성 (App Router)
  - `tailwind.config.ts` — DESIGN.md 토큰 매핑: 컬러 9개 (page / panel / ink / muted / subtle / line / line-strong / accent-blue / accent-pink), 폰트 3종 (sans / display / mono), `out-quart` easing, `prose` max-width
  - 폰트 로딩: Pretendard (local `public/fonts/PretendardVariable.woff2`) + Schibsted Grotesk + JetBrains Mono — `app/fonts.ts`에서 일괄 관리
  - 레이아웃 shell: `app/layout.tsx` + `components/sections/Header.tsx` + `components/sections/Footer.tsx`
  - `types/index.ts` — Phase 4 contract types 동결 (Project, ProjectGroup, ProjectAward, Skill, SkillCategory, ExperienceEntry, AwardEntry, EducationEntry, GuestbookEntry)
  - `lib/utils.ts` — `cn()` 헬퍼 (clsx + tailwind-merge)
  - 의존성: `@phosphor-icons/react`, `lord-icon-element` + `lottie-web`, `motion` (구 framer-motion), `class-variance-authority`, `clsx`, `tailwind-merge`
  - 개발 도구: Prettier 3 + `prettier-plugin-tailwindcss`, ESLint 9 + `eslint-config-next`, `.prettierrc.json` / `.prettierignore` 추가
- **Phase 9 사전 인프라** _(commit: f9f1c95)_
  - `Dockerfile` (multi-stage `node:22-slim` + corepack `pnpm@9.15.0` + non-root + node fetch healthcheck)
  - `.dockerignore` / `deploy/docker-compose.yml` (GHCR image + portfolio-data volume + env_file + external `npm-network` + 로그회전 + 메모리 limit)
  - `.github/workflows/ci.yml` — matrix typecheck/lint/build, Node 22, pnpm cache
  - `deploy/nginx-proxy-manager/notes.md` — NPM UI 체크리스트
  - `.env.example` — Public / Server-only / Runtime 분류 템플릿 (ARCHITECTURE.md / API.md / DEPLOYMENT.md 변수 통합)
  - `ARCHITECTURE.md` — `IP_HASH_SALT` 보안 모델 추가 (방명록 IP 해시 저장 근거)
- **Phase 3 — 커스텀 Skill / Agent** _(commit: feb2145)_
  - `.claude/agents/design-auditor.md` — DESIGN.md 안티패턴 12개 자동 감지 agent
  - `.claude/skills/check-design-rule/` — 컴포넌트/디렉토리 PASS/WARN/FAIL 보고
  - `.claude/skills/refresh-content/` — CONTENT.md ↔ `content/*.ts` drift 검사 가이드

### Changed

- **Phase 6 follow-up — devicon 브랜드 SVG + Phosphor fallback** _(commit: ed9455c)_
  - `public/icons/` 26 devicon 브랜드 SVG 추가 (Phosphor placeholder 대체)
  - `components/ui/Icon.tsx` — brand-first / Phosphor-fallback 패턴 (OPA → ShieldCheck 등)
  - `TechStack` 호버 멀티컬러 호환 — icon 색 전환 제거, 컨테이너 `border-line-strong` + 라벨 `text-accent-blue`로 시각 피드백 유지
- **Phase 8 fix — Education 정치외교학과 표기** _(reviewer WARN 해소)_
  - `components/sections/Education.tsx` — `e.kind === "education" && e.status === "completed"` 분기 추가하여 "학사" 표시 (CONTENT.md / SPEC §섹션 7 1글자 일치)
- **Phase 4 fix — Header glassmorphism 제거** _(reviewer 지적 → frontend 대응)_
  - `components/sections/Header.tsx` — `bg-*/blur-*` 모두 삭제, `border-b`만 유지하여 시각적 구분 확보 (DESIGN.md 안티패턴 #2 회피, `/check-design-rule` 재검사 PASS)
- **`next.config.ts` — `output: 'standalone'`** _(commit: 61c2dcf)_
  - infra `Dockerfile` 요구사항 대응 — frontend 권한 경유 1줄 추가, 빌드 산출물 standalone 분리로 Docker 이미지 최소화
- **AGENTS.md — non-head agents → head escalation 룰 명문화** _(commit: 2ac04bf)_
  - 멀티에이전트 거버넌스: non-head agent는 사용자에게 직접 질문 금지, head 통해서만 에스컬레이션
- **`.claude/settings.json` — Bash 권한 allowlist 확장 + wildcard** _(commit: ecc4eeb, 27f0b7d)_
  - 멀티에이전트 작업 시 권한 프롬프트 영구 해소를 위한 `Bash(*)` wildcard 적용 (자율 실행 보장)

---

## Pre-history (Phase 0~3, commit log 참조)

상세 변경사항은 commit log 참조. 핵심 산출물 요약만 기재.

### [Phase 2.5] — multi-agent infrastructure _(commit: 4693f2d)_

- `AGENTS.md` — 멀티에이전트 협업 헌장 (Single Writer / Contract-First / 머지는 head만 등 6 규칙)
- `STATUS.md` — 실시간 agent 상태 보드
- `.claude/agents/` — head / frontend / backend / infrastructure / reviewer / documenter 6 agent 정의
- `.claude/skills/` — `/start`, `/develop`, `/end`, `/review`, `/status`, `/serve`, `/logs`, `/build` 8 커스텀 슬래시 명령

### [Phase 2.6] — orchestrator → head rename _(commit: 60198df)_

- agent / skill / 문서 전반에서 `orchestrator` 명칭을 `head`로 통일
- tmux 7-윈도우 멀티인스턴스 워크플로우 README 정착

### [Phase 0~1] — foundation docs + harness _(commit: a45c1c2 외)_

- Foundation 문서 5종 — `DESIGN.md` / `CONTENT.md` / `CLAUDE.md` / `README.md` / `ROADMAP.md`
- 보강 문서 — `ARCHITECTURE.md` / `SPEC.md` / `API.md` / `DEPLOYMENT.md`
- `.claude/settings.json` + `.gitignore` + hooks (PostToolUse 자동 포맷, PreToolUse rm -rf 가드)
- bkit 플러그인 설치 (40+ skills)
- `tailwind-design-system` + `accessibility` skill 프로젝트 설치
