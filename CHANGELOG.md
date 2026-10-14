# Changelog

본 프로젝트의 모든 주요 변경 사항을 기록한다.

형식은 [Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/)을 따르고, 버전 규약은 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따른다.

Phase는 [ROADMAP.md](./ROADMAP.md)와 매칭되며, 머지 직후 commit hash를 entry에 첨부한다.

---

## [Unreleased]

### Changed

- **Phase 16 — 터미널 스토리 페이지가 메인(`/`)으로** _(2026-10-14)_
  - `app/page.tsx` → `StoryPage`. `app/story` 라우트 삭제, `next.config.ts`에 `/story → /` 301. 루트 메타데이터 적용(색인 허용), `themeColor` 다크, description 갱신
  - `PhilosophyFilm`(철학 영상) 메인에서 제외 — d87e60d에 다른 에이전트의 작업 중 파일이 섞여 들어갔던 것을 되돌림. 컴포넌트·`public/media/philosophy/`는 유지(미사용)
  - 구 섹션형 메인 `components/sections/*`는 미사용 상태로 유지(리빌드 참고)

- **Phase 15.7 — 터미널 정리** _(2026-10-14)_
  - 배너에서 motto 줄 삭제(name · role만) · `ls` 설명: philosophy/ "기술과 삶의 철학", certifications/ "자격증" · `philosophy.md` 삭제 · `cat README.md`(또는 `open`)는 GitHub 프로필 README를 새 탭으로

- **Phase 15.6 — /story 스택 섹션 · certifications · 문구 정정** _(2026-10-14)_
  - `Stack.tsx` 신설(`skills.ts` 4그룹, 터미널 톤) · `Whoami` → `Certifications`(운전면허 제외, 최신 위) · 터미널 `cd certifications` · `cd stack`
  - 히어로: 터미널 힌트 문장을 `open terminal` 버튼 옆으로 모음(가짜 프롬프트 줄 삭제)
  - 철학 01 본문 · 타임라인 카드 11장 문구를 사용자 문장으로 교체. **PADING은 프론트엔드 담당으로 정정**(K8s 구현 아님), 정보처리기사는 낙방 강조 제거, 워크스테이션은 "효율적으로 기록하기 위해"
  - served from "GMKtec G3 · Intel N100 홈서버 · Cloudflare"

### Fixed

- **Phase 15.5 — 전광판이 데스크톱에서 멈추고 모바일에서 너무 빠르던 문제** _(2026-10-14)_
  - 원인: CSS `animation` 마퀴 — OS "동작 줄이기"가 켜진 환경에서 globals의 reduced-motion 규칙이 애니메이션을 끄고, 속도가 트랙 길이에 비례해 화면마다 달랐다
  - 조치: `Marquee.tsx` — Motion `useAnimationFrame`으로 60px/s 일정 속도, 첫 span 너비에서 wrap. CSS 키프레임 제거

### Changed

- **Phase 15.5 — 터미널 처음엔 접힘 + 힌트** _(2026-10-14)_
  - 첫 방문은 접힌 알약 상태(이전: 데스크톱 펼침). 알약에 `terminal` 라벨 + 3회 테두리 강조, 히어로에 프롬프트 힌트 줄(`$ help` 커서, ls · cd story · cd philosophy)과 백틱 안내

- **Phase 15.4 — 터미널을 떠 있는 창으로** _(2026-10-14)_
  - `TerminalWindow.tsx`: 페이지 어디서든 z-50에 고정, 머리띠를 잡아 드래그(Motion `useDragControls`, 상·하단 바 사이로 제한), 접기(알약) · 백틱 토글 · Esc, 상태는 sessionStorage. 데스크톱 기본 펼침 / 모바일 기본 접힘
  - 히어로는 INFRA + 이름·기간 요약 + "open terminal" 버튼(`terminal-bus.ts`)

- **Phase 15.3 — /story 터미널 히어로 · 어조 · 구성 정리** _(2026-10-14)_
  - 히어로에 **입력 가능한 터미널**(`Terminal.tsx`): `help` `ls` `cd <섹션>` `cat` `pwd` `whoami` `uptime` `clear`, Tab 자동완성 · ↑↓ 이력 · 빠른 명령 칩. `cd story` 등은 공유 Lenis 인스턴스(`lenis.ts`)로 스크롤
  - 철학 2장면(03 link 삭제), 모토·본문을 "~라고 믿습니다 / 생각합니다" 어조로. `story.md` 절(`Story.tsx`) 삭제
  - 좌상단 프롬프트 `junik@homeserver:~/whoami$`. whoami는 자격만(`certifications.ts`), 위치를 타임라인 뒤로
  - 타임라인 11장: RAPA 과정 입과(2026.07) 추가, CCNA 카드 제목 "CCNA · 문제은행" + 주소 줄, 카드 문구 합니다체
  - 크레딧: 전광판 마퀴(초록 모노 · 14s · 양끝 페이드), deployed by "GitHub Actions → GHCR"

- **Phase 15.2 — /story 타임라인 10장 · 카드 상세 모달 · 방명록** _(2026-10-14)_
  - 타임라인을 10장으로 재구성: SSAFY 입과 → PADING → WhistleHub → Amoverse(À moi) → 실습코치 → 홈서버 → AI 지식관리 워크스테이션 → 정보처리기사 → CCNA·ccna.wnsdlr.com → VCP 준비
  - 카드 클릭 → `ChapterModal`(터미널 톤 native dialog). 프로젝트 카드는 `content/projects.ts`를 slug로 끌어와 summary · what i did · metrics · stack · 링크를 그대로 보여 주고, 장별 덮어쓰기(`Chapter.detail`) 가능
  - 홈서버 카드에 **실행 중 서비스 목록**(2026-10-14 `docker ps` 27개, 4그룹) — 공개 주소는 사용자용 서비스만, 관리 도구는 이름만
  - "now(systemctl status)" · "running(docker ps)" 섹션 삭제(`Status.tsx` 제거). 방명록 섹션을 /story에 추가하고 연락처를 마지막으로
  - `GuestbookForm` · `GuestbookList`에 `tone` prop("light" 기본 · "term") — 메인 페이지 모양은 그대로
  - 타임라인 높이 55→45svh/장, 모달 안은 `data-lenis-prevent`로 네이티브 스크롤

- **Phase 15.1 — /story 두 철학 반영** _(2026-10-14)_
  - 모토 확정: 기술 "기술의 가치는 사람이 할 수 있는 일을 넓히는 데 있다." · 삶 "미래를 바꾸려면, 변화의 대가도 선택해야 한다." (`content/story.ts` 신설, CONTENT.md §"/story — 두 철학")
  - `Philosophy`: About 4문단 공유 → 두 모토 + 연결 3장면으로 교체 (label tech/life/link)
  - `Story` 신설: `less ~/story.md` — 성장 이야기 3절 (대가를 먼저 배움 → 운영에서 기술의 쓸모 → 두 문장이 만나는 자리)
  - `Hero`: INFRA 아래 기술 모토 한 줄 · `Whoami`: motto 행 · `data.ts` 타임라인 문구를 정체성 문서 기준으로 정리("비전공으로"·"반 2등" 삭제, RAPA 카드에 선택의 대가 한 줄) · `/story` 메타 description 갱신
  - 메인(`/`) Hero 모토 반영은 보류 — CONTENT.md Hero 노트 참조


- **Phase 14.1 — 단순화** _(2026-10-12)_
  - 모토 폐기: Hero의 try/catch/finally 코드 블록(`CodeBlock.tsx` 삭제)·모토 줄, Footer 모토, 메타·OG 모토 제거. "궁금하면 해 보고…" 문구 제거
  - About: 인프라 철학 4문단만. 숫자 그리드·정체성 요약표 삭제(`Profile`은 `aboutBody`만)
  - Tech Stack: 4그룹 19개(Server/Cloud · Operations · Languages · Tools). Languages = Python·JavaScript·Java, Tools = Git·Jira·Notion·Slack·Mattermost·Figma
  - Experience: 교안 제작 삭제 / Projects: 사내 네트워크 설계 삭제
  - Education 섹션을 SSAFY·RAPA 상세 카드로 재작성, **Certifications 섹션 신설**(정보처리기사 → CCNA → 운전면허 → Running VCP)

- **Phase 14 — 인프라 엔지니어(서버·클라우드) 포지셔닝으로 콘텐츠 전면 개편** _(2026-10-12)_
  - 소스: Obsidian 볼트 `30-Output/취업 - 인프라 SI/`(이력서·포트폴리오 마스터, 자소서 §0 데이터 팩트, 03 기술 스택 표) + `20-Wiki/Projects/`
  - Hero: 역할 라벨 `Infrastructure Engineer · 서버 · 클라우드` + 한국어 훅 2줄. try/catch/finally 시그니처·모토 유지
  - About: 본문 3문단 교체(홈서버 운영·측정 습관·RAPA 과정), **운영 기록 숫자 그리드 6칸** 신설(`Profile.numbers`), 요약표 Interest → Focus
  - Tech Stack: 6카테고리 재편(Server/OS/Storage → Cloud/Edge → Container/Delivery → Observability/Availability → Network/Security → Languages & Tools). 근거 없는 Terraform·OPA·Django·Spring·Vue·Figma·Slack 제거, Ubuntu·Windows Server·Bash·Cloudflare·Prometheus·Grafana·Go·Kotlin devicon 추가, HAProxy·keepalived·Uptime Kuma·MinIO·Cisco·Storage·DNS·Obsidian은 Phosphor fallback. `Skill.note`를 title 속성으로 노출
  - Projects: 그룹 `in-progress` → `infra-lab`. 홈서버 인프라 · ccna.wnsdlr.com · AI 지식관리 워크스테이션(운영 중) / 가용성 인프라 · Windows Server · Linux 서버 · 사내망 설계(구축·실습) / PADING(K8s 관점 재서술) · Mattermost / WhistleHub · Amoverse. DevFlow Harness 삭제(구현물 없음). `Project.period`·`Project.metrics` 추가 → 카드·모달에 숫자 노출, 모달 헤딩 Problem/Solution → Summary/What I did
  - Experience: 실습코치 기간 2025.06 ~ 2026.06 확정, EKS 가이드 검수·개선 제안을 첫 항목으로
  - Education: CCNA(2026.10)·정보처리기사(2026.09) 취득, AWS SAA·RHCSA 준비 중, RAPA 과정 수료 예정, SSAFY 수료. CKA 제거. `EducationEntry.detail`·`statusLabel` 추가(SSAFY가 "학사"로 찍히던 라벨 버그 수정)
  - Footer: 한국어 한 줄 추가. layout 메타·OG 이미지·JSON-LD jobTitle 갱신
  - 문서: CONTENT.md 전면 개정(Projects 상세는 `content/projects.ts`가 정본), CLAUDE.md·README·SPEC·DESIGN 역할 라벨 갱신

- **Phase 12 — admin 인증 재설계 (Bearer → ID/PW + 쿠키 세션)** _(commits: 00cf1ff backend, e0d1bc9 frontend, d832614+8f6ef37 merges)_
  - URL: `/admin/guestbook` → `/admin` 단일 페이지 / `/admin/login` 신규
  - 인증: ADMIN_TOKEN Bearer 제거 → ADMIN_USERNAME + bcrypt PASSWORD_HASH + SESSION_SECRET (.env 3종 신규)
  - 세션: HMAC-SHA256 서명 쿠키 24h fixed, HttpOnly + Secure + SameSite=Lax
  - middleware.ts: `/admin/:path*` matcher, 미인증 시 `/admin/login?next=…` 307 redirect
  - 보안: bcryptjs verify + timingSafeEqual username, Edge Web Crypto (middleware bundle 34.4kB, bcryptjs 제외), 로그인 rate-limit 5분/5회, 실패 메시지 일반화 (enumeration 방어), safeNext open-redirect 가드
  - setup 스크립트 (`/tmp/setup-admin-credentials.sh`): stdin 비밀번호 입력 + bcrypt 해시 + Docker Compose `$` → `$$` escape 자동 처리
  - 라이브 검증: `/admin` 307→login, `/admin/login` 200, wrong cred 401 (일반화 메시지), valid cred 200 + Set-Cookie
- **Phase 11 — 방명록 admin UI + admin API** _(commits: 9bce063 backend, 8211ea3 frontend, 2fa3e13 merge)_
  - backend: `GET /api/admin/guestbook` (Bearer, status filter, SUM(CASE) counts, cursor pagination, Cache-Control no-store), `PATCH /api/admin/guestbook/[id]/restore` (deleted=1 only, 404 idempotency), types/index.ts `+GuestbookStatus +GuestbookAdminEntry +GuestbookAdminListResponse`
  - frontend: `app/admin/layout.tsx` (noindex/nofollow), `app/admin/guestbook/page.tsx` (client + AdminGate render-prop), `components/admin/AdminGate.tsx` (localStorage `portfolio-admin-token`, 4-상태 union, 401 vs 404 vs 네트워크 분기), `components/admin/GuestbookAdminList.tsx` (4-탭 + status별 action 분기 + cursor pagination + aria-live)
  - 워크트리 isolation **첫 사이클 검증** — backend는 `feat/backend`, frontend는 `feat/frontend` 에서 commit + push, head가 master 머지
  - 머지 시 자연 정리: STATUS.md 자기 줄 분리 머지 / frontend 로컬 `GuestbookAdminEntry` → backend `types/index.ts` 정의로 통합 (entry.approved/deleted → entry.status string union)
  - 라이브 검증: `/admin/guestbook` 200 + `<meta robots="noindex,nofollow">`, `/api/admin/guestbook` 401 (no auth) / 200 (Bearer + JSON 정상)
- **Phase 10 — 방명록 (Guestbook) + `/api/health`** _(commit: 72b1d96)_
  - backend: `lib/db.ts` (better-sqlite3 싱글톤 + WAL + 마이그레이션), `lib/ip-hash.ts` (SHA-256 + salt), `lib/rate-limit.ts` (메모리 Map), `lib/admin-auth.ts` (Bearer + timingSafeEqual)
  - API: `app/api/health/route.ts`, `app/api/guestbook/route.ts` (POST + GET cursor pagination), `app/api/guestbook/[id]/route.ts` (admin DELETE soft), `app/api/guestbook/[id]/approve/route.ts` (admin PATCH)
  - frontend: `components/sections/Guestbook.tsx`, `components/ui/{GuestbookForm,GuestbookList}.tsx`, `lib/relative-time.ts`
  - 보안: honeypot pre-DB / rate-limit pre-DB / IP raw 미저장 / ADMIN_TOKEN timing-safe / Zod cap / XSS plain-text escape
  - **라이브 검증** (`https://wnsdlr.com`): /api/health 200, GET 빈, POST 201, honeypot silent 201, rate-limit 429, admin 401/200, soft delete + 동시성 404
  - Phase 9 healthcheck unhealthy → **healthy 전환** ✓
- **Phase 9 — 배포 (홈서버) 완료** 🚀
  - 인프라 자산 (사전 작성): `Dockerfile` (multi-stage node:22-slim + corepack pnpm@9.15.0 + non-root + node fetch healthcheck), `.dockerignore`, `deploy/docker-compose.yml` (GHCR image + portfolio-data volume + env*file + npm-proxy 외부 네트워크 + 로그회전 + 메모리 limit), `.github/workflows/ci.yml` (matrix typecheck/lint/build), `deploy/DEPLOY_RUNBOOK.md`, `deploy/nginx-proxy-manager/notes.md` *(commits: f9f1c95, 818728c)\_
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

## Phase 14.2 — About 장면 전환 애니메이션

- About 섹션을 스크롤 고정(sticky) 스토리텔링으로 변경: 철학 4문단이 스크롤 진행도에 따라 한 장면씩 교체 (Motion `useScroll`)
- 상단 `01 / 04` 카운터 + 4칸 진행 막대 (막대 클릭 시 해당 문단으로 이동)
- `prefers-reduced-motion` 사용자에게는 기존 정적 목록으로 렌더

## Phase 15 (실험) — /story 터미널 컨셉 페이지

- wedding.tonami-komuro.com 의 구성(프리로더 → 대형 글자 히어로 → 메시지 → 프로필 → 스토리 → 일시·장소 → RSVP → 크레딧)을 커리어로 옮긴 별도 경로 `/story`. 메인(`/`)은 그대로.
- 터미널 테마(`term.*` 색 토큰), 부팅 프리로더(세션당 1회), INFRA 대형 글자, 철학 4장면, whoami, 가로 고정 타임라인, systemctl status, docker ps 형식 운영 서비스, 연락처, 흐르는 감사 문구.
- Lenis 부드러운 스크롤 추가. `noindex` — 검색 노출 안 함. reduced-motion이면 프리로더·관성 스크롤 끔.

## Phase 15.1 — /story 두 철학 반영 (2026-10-14)

- 확정한 두 모토(기술·삶)를 `/story`에 먼저 반영: 히어로 모토 줄, `philosophy.md` 3장면, `story.md` 3절, whoami motto 행. 콘텐츠 정본 `content/story.ts` ← CONTENT.md §"/story — 두 철학" ← 볼트 `30-Output/나의 철학 — 두 문장.md`.
- 다음 결정: 메인(`/`) Hero에 모토 노출 여부 · `/story` `noindex` 해제 시점 · story 서사(타임라인 이전 시기 포함 여부)는 추후.
