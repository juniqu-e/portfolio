# Changelog

본 프로젝트의 모든 주요 변경 사항을 기록한다.

형식은 [Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/)을 따르고, 버전 규약은 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따른다.

Phase는 [ROADMAP.md](./ROADMAP.md)와 매칭되며, 머지 직후 commit hash를 entry에 첨부한다.

---

## [Unreleased]

### Added

- **Phase 4 — Next.js 초기화 + 디자인 토큰** _(commit: TBD, 머지 직후 첨부)_
  - Next.js 15.5 + React 19 + TypeScript strict 수동 구성 (App Router)
  - `tailwind.config.ts` — DESIGN.md 토큰 매핑: 컬러 9개 (page / panel / ink / muted / subtle / line / line-strong / accent-blue / accent-pink), 폰트 3종 (sans / display / mono), `out-quart` easing, `prose` max-width
  - 폰트 로딩: Pretendard (local `public/fonts/PretendardVariable.woff2`) + Schibsted Grotesk + JetBrains Mono — `app/fonts.ts`에서 일괄 관리
  - 레이아웃 shell: `app/layout.tsx` + `components/sections/Header.tsx` + `components/sections/Footer.tsx`
  - `types/index.ts` — Phase 4 contract types 동결 (Project, ProjectGroup, ProjectAward, Skill, SkillCategory, ExperienceEntry, AwardEntry, EducationEntry, GuestbookEntry)
  - `lib/utils.ts` — `cn()` 헬퍼 (clsx + tailwind-merge)
  - 의존성: `@phosphor-icons/react`, `lord-icon-element` + `lottie-web`, `motion` (구 framer-motion), `class-variance-authority`, `clsx`, `tailwind-merge`
  - 개발 도구: Prettier 3 + `prettier-plugin-tailwindcss`, ESLint 9 + `eslint-config-next`, `.prettierrc.json` / `.prettierignore` 추가
- **Phase 4 인프라 사전 작업** _(commit: TBD)_
  - `.env.example` — Public / Server-only / Runtime 분류 템플릿 (ARCHITECTURE.md / API.md / DEPLOYMENT.md 변수 통합)
  - `ARCHITECTURE.md` — `IP_HASH_SALT` 보안 모델 추가 (방명록 IP 해시 저장 근거)
- **Phase 3 — 커스텀 Skill / Agent** _(commit: feb2145)_
  - `.claude/agents/design-auditor.md` — DESIGN.md 안티패턴 12개 자동 감지 agent
  - `.claude/skills/check-design-rule/` — 컴포넌트/디렉토리 PASS/WARN/FAIL 보고
  - `.claude/skills/refresh-content/` — CONTENT.md ↔ `content/*.ts` drift 검사 가이드

### Changed

- **Phase 4 fix** — `components/sections/Header.tsx`에서 glassmorphism (DESIGN.md 안티패턴 #2) 제거. `bg-*/blur-*` 모두 삭제, `border-b`만 유지하여 시각적 구분 확보. _(reviewer 지적 → frontend 즉시 대응, /check-design-rule 재검사 PASS)_

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
