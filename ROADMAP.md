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
- `pnpm create next-app` (App Router + TS + Tailwind)
- `tailwind.config.ts`에 DESIGN.md 토큰 입력 (컬러, 폰트, 스페이싱)
- `app/layout.tsx`에 Pretendard / Schibsted Grotesk / JetBrains Mono 로드
- Phosphor + Lordicon 설치
- Framer Motion 설치
- 기본 layout shell (헤더/푸터 골격)

**검증**: `pnpm dev`로 빈 페이지가 디자인 토큰 적용된 상태로 렌더링. 폰트 정상 표시.

---

## Phase 5 — Hero 섹션 구현 (시그니처 검증)

**산출물**:
- `components/sections/Hero.tsx`
- try/catch/finally 코드 블록 시그니처 시각화
- 이름 + 역할 + 모토
- 미세한 인터랙션 (호버 등)

**검증**: 본인이 봐서 *"이게 내 정체성을 표현한다"*고 느낌. AI 클리셰 없음. DESIGN.md 가드레일 통과.

---

## Phase 6 — About / Tech Stack 섹션

**산출물**:
- `components/sections/About.tsx` — 본문 + 정체성 요약 표
- `components/sections/TechStack.tsx` — 6개 카테고리 아이콘 그리드
- 아이콘 호버 인터랙션

**검증**: 모바일/데스크탑 모두 자연스러움. 진행도 바 없음.

---

## Phase 7 — Experience / Projects 섹션

**산출물**:
- `components/sections/Experience.tsx` — SSAFY 실습코치 상세
- `components/sections/Projects.tsx` — 4개 그룹, 6개 프로젝트 카드
- 프로젝트 상세 페이지 또는 모달
- 수상 프로젝트 강조 표시

**검증**: 모든 프로젝트가 problem→solution→tech 구조로 노출. 스크린샷 또는 placeholder 이미지 포함.

---

## Phase 8 — Awards / Education / Contact / Footer

**산출물**:
- `components/sections/Awards.tsx`
- `components/sections/Education.tsx`
- `components/sections/Contact.tsx`
- `components/Footer.tsx` (모토 재등장)
- 메타데이터 (OG image, favicon, sitemap)

**검증**: 모든 섹션 완성. Lighthouse 점수 90+ (Performance/Accessibility/SEO).

---

## Phase 9 — 배포 (홈서버)

**산출물**:
- 빌드 + 홈서버 배포 파이프라인 (Docker / Caddy / Nginx 중 선택)
- `wnsdlr.com` 도메인 연결
- HTTPS 설정 (Let's Encrypt)
- 모니터링 기본 (uptime, error 트래킹)

**검증**: 외부에서 wnsdlr.com 정상 접근. Mobile에서 정상 렌더링.

---

## Phase 10+ — 후속 개선

보류 항목:
- 다크모드 추가
- 유료 아이콘 팩 도입 (Streamline / Untitled UI Icons)
- 시그니처 일러스트/Lottie 자체 제작
- 블로그 섹션 또는 Velog 임베드
- i18n (영문 버전)
- Lighthouse 100점 튜닝

---

## 진행 현황 추적

각 phase 시작 시 해당 섹션의 ✅ 체크. 막힘이 생기면 해당 phase 내 메모로 기록.

| Phase | 상태 |
|---|---|
| 0 — Foundation 문서 | ✅ 완료 |
| 1 — Harness 세팅 | ✅ 완료 |
| 2 — bkit 설치 | ✅ 완료 |
| 2.5 — 멀티에이전트 인프라 (AGENTS/STATUS + 6 agents) | ✅ 완료 |
| 3 — 커스텀 skill/agent | ✅ 완료 (design-auditor + check-design-rule + refresh-content) |
| 4 — Next.js 초기화 | ⚪ 대기 |
| 5 — Hero 구현 | ⚪ 대기 |
| 6 — About / Tech Stack | ⚪ 대기 |
| 7 — Experience / Projects | ⚪ 대기 |
| 8 — Awards / Education / Contact / Footer | ⚪ 대기 |
| 9 — 배포 | ⚪ 대기 |
