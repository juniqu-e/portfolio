# STATUS.md — 실시간 에이전트 상태 보드

모든 agent는 작업 시작/완료/블록 시 본 파일을 업데이트해야 한다. 한 agent = 한 줄.

**규칙**:

- 자기 줄만 수정 (다른 agent 줄 건드리지 말 것)
- 형식: `- [agent-name] <status> <files> <eta-or-note>`
- status: `idle`, `in_progress`, `ready-for-review`, `blocked`, `paused-for-doc-change`, `done`
- 파일 잠금: `[locked-by: <agent>]` 형식으로 표기

---

## Current State (sync timestamp: 2026-05-25)

- [head] **in_progress** — Phase 7 시각 검증 PASS. reviewer Phase 7 6-게이트 dispatch (모달 a11y/focus trap 중점). PASS 시 commit + push + Phase 8 (Awards/Education/Contact/Footer + 메타데이터) 위임
- [frontend] **ready-for-review** — Phase 7 Experience + Projects + Modal 완료. 신규 7: content/experience.ts (SSAFY 13/14기 코치 1 entry, duties 5) / content/projects.ts (6 projects, award 3종) / content/project-groups.ts (4 그룹 라벨) / components/sections/Experience.tsx (RSC, sm:grid-cols-[200px_1fr], dl duties 표 모바일 stack) / components/sections/Projects.tsx (RSC, bg-panel, 그룹 헤더 dot+label+hairline, md:grid-cols-2) / components/ui/ProjectCard.tsx ("use client", button, scale-1.02+border-line-strong+shadow-sm, trophy 라벨, stack chip top-5+overflow) / components/ui/ProjectModal.tsx ("use client", forwardRef + useImperativeHandle, native dialog, backdrop:bg-ink/40, problem(blockquote tagline + paragraph description) / solution(dl responsibilities) / tech(stack chips), Trophy/X 아이콘, max-h-[85dvh] 스크롤). 갱신: app/page.tsx (Hero+About+TechStack+Experience+Projects+contact placeholder). 자율 결정: ① card+modal split (head 명세) ② problem→solution→tech 매핑 ③ award.competition+rank 분리, role은 personal만 ④ tagline은 프로젝트별 가장 직접 one-liner. 검증: typecheck/lint/build PASS, /check-design-rule PASS (안티패턴 12/토큰/모션/아이콘/타이포/AC 매핑 WARN 0 FAIL 0, dialog::backdrop 패턴 허용). 번들: page **3.46→6.76KB** (+3.3, 6 dialog 마크업), First Load JS **106→109KB** (+3, Trophy/X client+useImperativeHandle). `/` 정적 prerender 유지.
- [backend] **idle** — bootstrapped, awaiting task (Phase 6+ guestbook/OG/sitemap 시점 활성)
- [infrastructure] **ready-for-review** — Phase 9 사전 인프라 초안 완료. 신규 파일: `Dockerfile` (multi-stage node:22-slim + corepack pnpm@9.15.0 + non-root + node fetch healthcheck) / `.dockerignore` / `deploy/docker-compose.yml` (GHCR image + portfolio-data volume + env_file + external npm-network + 로그회전 + 메모리 limit) / `.github/workflows/ci.yml` (matrix typecheck/lint/build, Node 22, pnpm cache) / `deploy/nginx-proxy-manager/notes.md` (NPM UI 체크리스트). YAML lint PASS. **🚨 head에 통지**: `next.config.ts` 에 `output: 'standalone'` 추가 필요 (frontend 권한 — 직접 수정 X). 실제 `docker build` 검증은 Phase 5+ Hero 작성 후. hadolint 미설치 → 수동 review 권장.
- [reviewer] **ready-for-review** — Phase 7 6-게이트: **PASS (FAIL 0 / WARN 0)**. G1 typecheck · G2 lint · G3 N/A · G4 design PASS (안티패턴 12 clean — backdrop:bg-ink/40는 `::backdrop` 패턴 허용, motion import 0, Phosphor SSR weight=regular 통일 Trophy×2+X, transition 200ms ease-out 통일, raw hex 0, gradient sprawl 0) · **G5 a11y PASS (모달 검증 핵심)**: native `<dialog>` + `showModal()` (focus trap/Escape/main inert 자동), `aria-labelledby={titleId}` 모달 제목 연결, backdrop 클릭 닫기 — `e.target===dialogRef.current` 가드 정확, 닫기 버튼 `<button type="button" aria-label="모달 닫기" h-9 w-9>` 36×36 WCAG 2.5.8 통과, ProjectCard `<button>+aria-label+focus-visible:scale/border/shadow` 명시, Trophy/X 데코 처리, Experience `<article>+<section aria-labelledby>+<dl><dt><dd>`, Projects 그룹 dot/hairline `aria-hidden` 정확, heading 위계 h1→h2→h3 일관 · G6 SPEC §Experience AC1-3 + §Projects AC1-7 정합 (CONTENT.md description 1글자 + duties 5행 + 6 프로젝트 매핑 + Award 3종 rank/competition 일치 + tagline em-dash/bold 추출 합리적 + problem→solution→tech 정확 구조 + scale-1.02+border-line-strong+shadow-sm 0.2s ease-out AC4 토큰 일치). Build PASS, page 6.76KB (+3.3), **First Load 109KB (+3)** Phase 4-6 대비 — Trophy/X+useImperativeHandle 비용 합리적. soft notes(게이트 차감 X): ProjectModal.tsx 140줄(Problem/Solution/Tech 분리 follow-up), X 아이콘 aria-hidden 명시 권장, projects.ts description bold→string 평탄화(SPEC 1글자 일치 미명시 → 차감 X).
- [documenter] **ready-for-review** — Phase 4 마무리 문서 갱신 완료: ROADMAP.md (Phase 4 ✅ + 진행표) / CHANGELOG.md (신규, Keep a Changelog 1.1, Phase 4 entries `commit: TBD`) / README.md (Stack 정합 + Commands 보강 + "Phase 4 후" → "Phase 4 완료"). /refresh-content 셀프 PASS (content/ 미생성, CONTENT.md 자체 일관성 OK).

---

## Locked Files

(현재 잠금 없음)

---

## Blockers / Issues

(현재 없음)

---

## 최근 활동 로그 (최신순, 최대 20개 유지)

- `2026-05-25` frontend: Phase 7 Experience + Projects + Modal — content/experience.ts + content/projects.ts(6) + content/project-groups.ts + Experience(RSC) + Projects(RSC, bg-panel) + ProjectCard(client, scale-1.02) + ProjectModal(client, native dialog forwardRef + useImperativeHandle, problem/solution/tech). 4 게이트 PASS, page 3.46→6.76KB, First Load 106→109KB
- `2026-05-25` frontend: Phase 6 후속 — devicon 26 brand SVG(public/icons/) + Icon.tsx brand-first/Phosphor-fallback(OPA→ShieldCheck) + TechStack 호버 멀티컬러 호환(icon 색전환 제거, 컨테이너 border-line-strong, 라벨 text-accent-blue). 4 게이트 PASS, First Load 106KB 유지
- `2026-05-25` frontend: Phase 6 About + TechStack — types(+Profile/ParaSegment/IdentityRow) + content/{profile,skills}.ts + Icon wrapper(Phosphor registry, brand SVG follow-up) + About(dl 2-col, bg-accent-blue/5 hover) + TechStack(bg-panel, grid 2/3/4/6, scale-1.03 hover). 4 게이트 PASS, First Load 106KB 유지
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
