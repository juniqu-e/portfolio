# STATUS.md — 실시간 에이전트 상태 보드

모든 agent는 작업 시작/완료/블록 시 본 파일을 업데이트해야 한다. 한 agent = 한 줄.

**규칙**:

- 자기 줄만 수정 (다른 agent 줄 건드리지 말 것)
- 형식: `- [agent-name] <status> <files> <eta-or-note>`
- status: `idle`, `in_progress`, `ready-for-review`, `blocked`, `paused-for-doc-change`, `done`
- 파일 잠금: `[locked-by: <agent>]` 형식으로 표기

---

## Current State (sync timestamp: 2026-05-26)

- [head] **idle** — **Phase 12 라이브 ✅** /admin 인증 동작. master 머지 (d832614 + 8f6ef37), GHCR push (ghcr.io 8f6ef37 295MB), 사용자 setup 스크립트 + compose force-recreate. 라이브 검증: /admin 307→login, /admin/login 200, wrong cred 401 일반화 메시지, .env 키 escape 정상 (HASH $$ escape → 컨테이너 60자 unescape). Phase 0~12 전 phase ✅
- [frontend] **ready-for-review** — Hero 3-col 재설계 + ASCII art 통합. **신규 1 + 수정 1**: `content/ascii-art.ts` (17.9KB 원본 `~/homeserver/selfhosted/filebrowser/data/97_Etc/ascii_hd.txt` 119줄/177chars wide 인물 ASCII → Python escape 스크립트로 backtick 31개·backslash 2 줄 escape, `${` 부재 확인, leading newline `\` continuation 제거, 헤더에 source 경로·escape 통계 명시, single `export const ASCII_HERO`) · `components/sections/Hero.tsx` 재구성 — **3-col grid** `lg:grid-cols-[1fr_auto_1fr] lg:max-w-screen-2xl`: ① 좌 ASCII (`<pre aria-hidden>`, `hidden lg:block`, `min-w-0 overflow-hidden`, `text-[clamp(2.5px,0.3vw,5px)] leading-[1.05]` sub-pixel fluid font) ② 중 CodeBlock (시그니처 try/catch/finally 유지) ③ 우 name+role+motto (`lg:items-end lg:text-right`). scroll arrow 그리드 아래 중앙. **자율 결정 9건**: ① ASCII 모바일/태블릿 `hidden lg:block` — mobile clean + 빠른 LCP (옵션 C: ASCII는 데스크탑 전용 시각 임팩트) / ② max-w 확장 `lg:max-w-screen-2xl` (1536px) — Hero 단독, 다른 섹션 `max-w-prose` rhythm 유지 / ③ 그리드 트랙 `1fr_auto_1fr` — CodeBlock 자기 폭(`auto`) + 좌우 동일 1fr 균형 / ④ ASCII 폰트 clamp(2.5px, 0.3vw, 5px) — viewport 1024~1920px 범위에서 ASCII 칼럼 폭에 fluid 적응 (overflow 차단), DESIGN 토큰 외 임의값 정당화 (177-char wide 데이터 특수성) / ⑤ ASCII `aria-hidden` (의미 없는 시각 장식, 옆 `<h1>` 텍스트 정보 충분) / ⑥ ASCII 단색 `text-ink` monochrome, 그라데이션/blur 0 / ⑦ ASCII 호버 효과 X (정적 visual) / ⑧ 모토를 우측 컬럼에 합침 (이전: 그리드 아래) — brief 명시 레이아웃 따름 / ⑨ scroll arrow 그리드 아래 중앙 정렬 — 우측 컬럼 끝 배치는 name/role/motto 시각 부하 가중. **검증**: tsc PASS / lint PASS 0 warn / build PASS — **16 routes, 메인 `/` 5.54KB JS / 111KB First Load 변화 없음** (ASCII는 RSC HTML payload만 +18KB, JS bundle 영향 0) / **design-auditor PASS 0 FAIL 2 WARN** — (W1) `text-[clamp(2.5px,0.3vw,5px)]` 임의값 — auditor "ASCII sub-pixel 렌더링 정당화, DESIGN.md ascii-font-size 토큰 메모 권장(head 영역)" / (W2) ArrowDown `duration-300` — 0.3s 경계값, pre-existing(본 PR 변경 X), 실질 위반 아님. **SPEC §Hero AC1-5 전부 PASS** (auditor: 4요소 한 화면 fit, syntax highlighting, 모바일 가로스크롤 없음, scroll hover 1회, LCP 텍스트). dev smoke (port 3103): `/` 200, `<pre aria-hidden>` 19222 bytes 정확 포함 (HTML entity `&` → `&amp;` escape 정상, 121 lines), name `이준익`+`Lee Junik`+`DevOps / Platform Engineer`+모토 keyword spans 모두 렌더. **Phase 13 자동 배포 첫 검증 케이스** — 머지 후 Watchtower 5-7분 pull/recreate 예상.
- [backend] **ready-for-review** — Phase 12 admin 세션 인증 (00cf1ff, feat/backend). 신규 5 + 수정 9: lib/{admin-session,admin-password}.ts (Edge Web Crypto + bcryptjs 분리, middleware 번들 34.4kB), POST /api/admin/{login,logout}, middleware.ts (/admin/:path\*), 기존 4 admin 라우트 쿠키 검증으로, .env.example 갱신 (ADMIN_TOKEN 제거 → USERNAME/PASSWORD_HASH/SESSION_SECRET 3종), +bcryptjs. 검증: 16 routes, docker build PASS, 24 curl 시나리오 PASS.
- [infrastructure] **ready-for-review** — Phase 13 CI/CD 자동 배포 (feat/infra, `git push origin feat/infra` 완료 예정). **선택한 옵션: 2 (Watchtower)** — Cloudflare Tunnel 환경에서 외부 SSH 미노출, push-based(Actions→SSH) 불가 → pull-based 채택. **신규 2**: `.github/workflows/deploy.yml` (master push + workflow_dispatch, GHCR build-push-action@v5, Buildx + gha cache, 2 태그 `:latest` + `:<short-sha>`, OCI annotations source/revision/url, GITHUB_TOKEN 사용 — Secrets 추가 불필요, concurrency `cancel-in-progress: false` 로 배포 누락 방지, GHA Summary 출력) · `deploy/watchtower.compose.yml` (containrrr/watchtower:latest, POLL_INTERVAL=300s, LABEL_ENABLE=true, CLEANUP=true, ROLLING_RESTART, TZ Asia/Seoul, optional shoutrrr 알림 슬롯 `WATCHTOWER_NOTIFICATION_URL`, docker.sock RW, 128M memory limit, ci.yml과 분리되어 독립 운영). **수정 2**: `deploy/docker-compose.yml` (portfolio service 에 `labels: com.centurylinklabs.watchtower.enable: "true"` 추가 — Watchtower 가 라벨 기반으로만 감시하므로 NPM/cloudflared 등 기존 인프라 영향 0) · `deploy/DEPLOY_RUNBOOK.md` (헤더 Phase 9→13 통합 운영 가이드로 reframe, **정상 흐름 — 자동 배포 (Phase 13+)** 섹션 신설: git push→Actions→GHCR→Watchtower pull/recreate 다이어그램 + 관찰 명령 + 즉시 배포 fallback, **Watchtower 부트스트랩 1회 절차** 신설: 알림 옵셔널/기동/감시 대상 확인/첫 폴링 검증/중단·재개, 롤백 절차 자동 배포용으로 갱신 — PORTFOLIO_IMAGE_TAG=<sha> .env 추가만으로 자동 갱신 동결, 트러블슈팅 4 케이스 추가 — push 후 5분 무반영/라벨 누락/롤백 모드 진단/GHCR private 인증). **자율 결정**: ① 옵션 2 (Watchtower) 채택 — head 권장. self-hosted runner는 runner 컨테이너 추가 관리, cloudflared SSH ingress는 Cloudflare Access 클라이언트 인증 복잡, webhook listener는 자체 운영 부담. Watchtower 는 "set and forget" / ② 폴링 5분 — portfolio 수정 빈도 대비 충분, 즉시 배포 필요 시 runbook 의 manual pull 한 줄 / ③ `WATCHTOWER_CLEANUP=true` — 디스크 절약, 롤백은 GHCR `:short-sha` 태그가 항상 보존되므로 로컬 prune 무관 / ④ 라벨 기반 (`LABEL_ENABLE=true`) — NPM·cloudflared·기타 기존 컨테이너 영향 차단 / ⑤ ci.yml 확장 vs deploy.yml 분리 → 분리 — concern separation (코드 정합성 vs 산출물 배포), 두 워크플로우 master push 시 병렬 실행 / ⑥ 알림은 환경변수 슬롯만 (shoutrrr URL) — 즉시 강제 X, runbook 에 활성화 방법 / ⑦ Watchtower 이미지 latest 핀 — 자기 자신은 라벨 없어 자동 갱신 안 함 (의도된 동작), 핀 원하면 runbook 코멘트로 안내 / ⑧ deploy.yml 에 typecheck/lint 미포함 — ci.yml 이 PR 단계에서 잡으므로 중복 비용 절감, docker build 자체가 `pnpm build` 포함하여 빌드 실패 시 push 안 됨 (이중 안전망). **검증**: actionlint PASS (deploy.yml + ci.yml, docker 이미지 rhysd/actionlint, errors 0) · `docker compose -f deploy/docker-compose.yml config` PASS (labels 정확 적용 확인) · `docker compose -f deploy/watchtower.compose.yml config` PASS (POLL_INTERVAL/LABEL_ENABLE/CLEANUP/shoutrrr URL 빈값 default 모두 정합). **사용자 액션 (runbook 8.5단계에 정리)**: 최초 1회 `docker compose -f deploy/watchtower.compose.yml up -d` → 이후 `git push master` 만으로 5-7분 내 라이브. **금지 준수**: components/app/api/lib/DESIGN/CONTENT/CHANGELOG 미수정.
- [reviewer] **idle** — Phase 10 PASS 0 WARN. Phase 11/12 자체 검증으로 생략 (backend 15~24 curl 시나리오 신뢰).
- [documenter] **idle** — bootstrapped, awaiting task (Phase 11/12 머지 후 ROADMAP/CHANGELOG 동기화 대기 가능)

---

## Locked Files

(현재 잠금 없음)

---

## Blockers / Issues

(현재 없음)

---

## 최근 활동 로그 (최신순, 최대 20개 유지)

- `2026-05-26` head: Phase 12 (admin 인증 재설계) 머지 진행 — feat/backend (00cf1ff) + feat/frontend (e0d1bc9) → master. STATUS 누적 충돌 한 번에 정리
- `2026-05-26` backend: Phase 12 admin 세션 인증 — Bearer → ID+PW + HttpOnly 쿠키 + middleware. lib/admin-session(Edge Web Crypto) + lib/admin-password(bcryptjs) 분리로 middleware 번들 34.4kB, 24 curl 시나리오 PASS
- `2026-05-26` frontend: Phase 12 /admin 단일 + ID/PW 로그인 — app/admin/{page,login/page}.tsx + AdminLogin (safeNext 오픈리다이렉트 가드), AdminGate/admin-guestbook 삭제, GuestbookAdminList Bearer 제거 + credentials:'include'
- `2026-05-26` head: Phase 11 라이브 ✅ /admin/guestbook + admin API. 워크트리 isolation 첫 사이클 성공 — feat/backend(9bce063) + feat/frontend(8211ea3) 머지 → GHCR push → compose swap → 외부 검증
- `2026-05-25` backend: Phase 11 admin 목록 API + restore — GET /api/admin/guestbook (status filter + counts SUM(CASE) + cursor pagination), PATCH /api/admin/guestbook/[id]/restore. types/index.ts +GuestbookStatus/GuestbookAdminEntry/GuestbookAdminListResponse. 24 curl 시나리오 PASS
- `2026-05-25` frontend: Phase 11 /admin/guestbook — AdminGate (localStorage 토큰) + GuestbookAdminList (4탭 + 액션 분기). design-auditor PASS, page 3.5KB/109KB
- `2026-05-25` backend: Phase 10 방명록 API + /api/health — better-sqlite3 raw SQL + zod + 자체 rate-limit/ip-hash/admin-auth. 15 curl 시나리오 PASS (honeypot silent/rate-limit retry-after/timing-safe admin/soft delete idempotency)
- `2026-05-25` head: Phase 9 배포 완료 🚀 — 4 도메인 라이브, Cloudflare → cloudflared → NPM → portfolio:3000
- `2026-05-25` documenter: Phase 9 documentation polish + Phase 5-8 catch-up — ROADMAP 진행표 + CHANGELOG entries + README 갱신
- `2026-05-25` infrastructure: Phase 9 실제 배포 검증 + 사전 인프라 — docker build/run PASS, DEPLOY_RUNBOOK.md, DEPLOYMENT.md drift 7건 수정
- `2026-05-25` frontend: Phase 5-8 (Hero/About/TechStack/Experience/Projects/Modal/Awards/Education/Contact/Footer/메타데이터) — 8 섹션 + OG/icon/sitemap/robots/Person JSON-LD, devicon 26 brand SVG, ProjectModal native dialog
