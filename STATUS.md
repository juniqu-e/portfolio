# STATUS.md — 실시간 에이전트 상태 보드

모든 agent는 작업 시작/완료/블록 시 본 파일을 업데이트해야 한다. 한 agent = 한 줄.

**규칙**:

- 자기 줄만 수정 (다른 agent 줄 건드리지 말 것)
- 형식: `- [agent-name] <status> <files> <eta-or-note>`
- status: `idle`, `in_progress`, `ready-for-review`, `blocked`, `paused-for-doc-change`, `done`
- 파일 잠금: `[locked-by: <agent>]` 형식으로 표기

---

## Current State (sync timestamp: 2026-05-25)

- [head] **in_progress** — Phase 4 머지 3 commits 완료 (governance, phase-4, infra-phase9-prep). reviewer 3 WARN 일괄 처리 (Header 터치타깃, skip-link, API contract align, pnpm-workspace 삭제). next.config.ts `output: 'standalone'` 추가 (infra 통지 대응). Phase 5 frontend dispatch 중
- [frontend] **ready-for-review** — Phase 4 완료: Next.js 15.5 + React 19 + TS strict + Tailwind 3.4 토큰화 + 폰트 3종 로드 + 레이아웃 shell + types/index.ts. typecheck/lint/build PASS. **fix**: Header.tsx glassmorphism (안티패턴 #2) 제거 → bg/blur 모두 삭제, border-b만 유지 (option B). /check-design-rule PASS. First Load JS 106KB.
- [backend] **idle** — bootstrapped, awaiting task (Phase 6+ guestbook/OG/sitemap 시점 활성)
- [infrastructure] **ready-for-review** — Phase 9 사전 인프라 초안 완료. 신규 파일: `Dockerfile` (multi-stage node:22-slim + corepack pnpm@9.15.0 + non-root + node fetch healthcheck) / `.dockerignore` / `deploy/docker-compose.yml` (GHCR image + portfolio-data volume + env_file + external npm-network + 로그회전 + 메모리 limit) / `.github/workflows/ci.yml` (matrix typecheck/lint/build, Node 22, pnpm cache) / `deploy/nginx-proxy-manager/notes.md` (NPM UI 체크리스트). YAML lint PASS. **🚨 head에 통지**: `next.config.ts` 에 `output: 'standalone'` 추가 필요 (frontend 권한 — 직접 수정 X). 실제 `docker build` 검증은 Phase 5+ Hero 작성 후. hadolint 미설치 → 수동 review 권장.
- [reviewer] **ready-for-review** — Phase 4 6-게이트: **PASS w/ 3 WARN**. G1 typecheck PASS · G2 lint PASS (0 warn) · G3 tests N/A · G4 design 12-안티패턴 PASS (Header glassmorphism 제거 확인) · G5 a11y PASS (lang/focus-visible/aria/main OK) — WARN: Header nav 14px text padding 없음 → WCAG 2.5.8 (24×24) 잠재 미달, skip-link 미설치 · G6 content/conv PASS — **WARN: types/index.ts ↔ API.md contract drift** (GuestbookEntry: `id: number` vs API string, `body` vs API `message`, `createdAt` vs `created_at`, `name: string | null` vs API default "익명") + pnpm-workspace.yaml 미완성 템플릿 (`allowBuilds`는 pnpm 표준 키 아님). 코드 직접 수정 X — head 결정 대기.
- [documenter] **ready-for-review** — Phase 4 마무리 문서 갱신 완료: ROADMAP.md (Phase 4 ✅ + 진행표) / CHANGELOG.md (신규, Keep a Changelog 1.1, Phase 4 entries `commit: TBD`) / README.md (Stack 정합 + Commands 보강 + "Phase 4 후" → "Phase 4 완료"). /refresh-content 셀프 PASS (content/ 미생성, CONTENT.md 자체 일관성 OK).

---

## Locked Files

(현재 잠금 없음)

---

## Blockers / Issues

(현재 없음)

---

## 최근 활동 로그 (최신순, 최대 20개 유지)

- `2026-05-25` infrastructure: Phase 9 사전 인프라 초안 — Dockerfile + .dockerignore + deploy/docker-compose.yml + .github/workflows/ci.yml + NPM notes 작성 (YAML lint PASS, frontend에 `output: 'standalone'` 추가 요청 필요)
- `2026-05-25` documenter: Phase 4 마무리 문서 갱신 — ROADMAP Phase 4 ✅ + CHANGELOG.md 신규 (Keep a Changelog 1.1) + README Stack/Commands 정합
- `2026-05-25` infrastructure: .env.example 템플릿 작성 (ARCHITECTURE/API/DEPLOYMENT 변수 통합, IP_HASH_SALT 포함, .gitignore 검증)
- `2026-05-25` head: Phase 3 완료 — design-auditor agent + /check-design-rule + /refresh-content 작성, 패턴 smoke test PASS
- `2026-05-25` head: orchestrator → head 명칭 변경 (전 문서/agent/skill 일괄). tmux 7-윈도우 멀티인스턴스 세팅 완료
- `2026-05-24` head: AGENTS.md / STATUS.md / 6 agent 정의 작성. 멀티에이전트 인프라 구축
- `2026-05-24` head: bkit 설치 완료 (40+ skills 로드)
- `2026-05-24` head: tailwind-design-system / accessibility skill 프로젝트 설치
- `2026-05-24` head: Foundation 문서 5종 작성 (DESIGN/CONTENT/CLAUDE/README/ROADMAP)
- `2026-05-24` head: .claude/settings.json + .gitignore + hooks 세팅
