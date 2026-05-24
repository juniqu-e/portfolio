# STATUS.md — 실시간 에이전트 상태 보드

모든 agent는 작업 시작/완료/블록 시 본 파일을 업데이트해야 한다. 한 agent = 한 줄.

**규칙**:

- 자기 줄만 수정 (다른 agent 줄 건드리지 말 것)
- 형식: `- [agent-name] <status> <files> <eta-or-note>`
- status: `idle`, `in_progress`, `ready-for-review`, `blocked`, `paused-for-doc-change`, `done`
- 파일 잠금: `[locked-by: <agent>]` 형식으로 표기

---

## Current State (sync timestamp: 2026-05-25)

- [head] **in_progress** — Phase 5 사용자 시각 검증 PASS (cloudflared 임시 tunnel). reviewer Phase 5 6-게이트 dispatch 완료, 대기 중. PASS 시 commit + push + Phase 6 (About + TechStack) 위임
- [frontend] **ready-for-review** — Phase 5 Hero 완료. 신규: `components/ui/CodeBlock.tsx` (자체 mini-highlighter, 토큰 매핑 K/F/V/P, `<pre><code whitespace-pre>`, 호버 시 border-strong + shadow-sm) / `components/sections/Hero.tsx` (RSC, `min-h-[calc(100dvh-3.5rem)]`, 좌측 이름+역할 우측 CodeBlock, 모토 group-hover 키워드 색전환, ArrowDown `/dist/ssr` regular + group-hover translate-y-1). 갱신: `app/page.tsx` (Hero + about/tech-stack/projects/contact anchor placeholder). 자율 결정: ① 시그니처 하드코딩 ② Server Component (motion 미사용, CSS만) ③ Phosphor SSR 경로. 검증: typecheck/lint/build PASS, /check-design-rule PASS (안티패턴 12 / 토큰 / 모션 / 아이콘 / 타이포 / 시그니처 WARN 0 FAIL 0). 번들: First Load JS **106KB** (Phase 4 동일, 트리 셰이크 효과로 증가 없음), `/` 정적 prerender.
- [backend] **idle** — bootstrapped, awaiting task (Phase 6+ guestbook/OG/sitemap 시점 활성)
- [infrastructure] **ready-for-review** — Phase 9 사전 인프라 초안 완료. 신규 파일: `Dockerfile` (multi-stage node:22-slim + corepack pnpm@9.15.0 + non-root + node fetch healthcheck) / `.dockerignore` / `deploy/docker-compose.yml` (GHCR image + portfolio-data volume + env_file + external npm-network + 로그회전 + 메모리 limit) / `.github/workflows/ci.yml` (matrix typecheck/lint/build, Node 22, pnpm cache) / `deploy/nginx-proxy-manager/notes.md` (NPM UI 체크리스트). YAML lint PASS. **🚨 head에 통지**: `next.config.ts` 에 `output: 'standalone'` 추가 필요 (frontend 권한 — 직접 수정 X). 실제 `docker build` 검증은 Phase 5+ Hero 작성 후. hadolint 미설치 → 수동 review 권장.
- [reviewer] **ready-for-review** — Phase 5 6-게이트: **PASS (WARN 0 / FAIL 0)**. G1 typecheck PASS · G2 lint PASS (0 warn) · G3 tests N/A · G4 design PASS (안티패턴 12 clean, Phosphor `weight="regular"` 통일, transition 200/300ms ease-out 통일, 그라데이션 0, raw hex 0, accent 포인트 면적 정지 시 0%) · G5 a11y PASS (h1 1개 + aria-labelledby="hero-name", CodeBlock `<pre aria-label>`, ArrowDown `aria-hidden` + scroll link `aria-label`+`min-h-9` 36px → WCAG 2.5.8 통과, Server Component) · G6 SPEC §Hero AC1-5 정합 (사용자 시각 검증 PASS 반영) + DESIGN §시그니처 1·2·3 + CONTENT identity/모토/코드 정확 일치. Build PASS, First Load 106KB 유지. follow-up 메모(게이트 외, 미차감): Footer mini 시그니처 추가는 향후 phase.
- [documenter] **ready-for-review** — Phase 4 마무리 문서 갱신 완료: ROADMAP.md (Phase 4 ✅ + 진행표) / CHANGELOG.md (신규, Keep a Changelog 1.1, Phase 4 entries `commit: TBD`) / README.md (Stack 정합 + Commands 보강 + "Phase 4 후" → "Phase 4 완료"). /refresh-content 셀프 PASS (content/ 미생성, CONTENT.md 자체 일관성 OK).

---

## Locked Files

(현재 잠금 없음)

---

## Blockers / Issues

(현재 없음)

---

## 최근 활동 로그 (최신순, 최대 20개 유지)

- `2026-05-25` frontend: Phase 5 Hero — CodeBlock(자체 mini-highlighter) + Hero(RSC, CSS-only 호버) + page.tsx anchor placeholder. typecheck/lint/build/design-rule 4 게이트 PASS, First Load 106KB 유지
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
