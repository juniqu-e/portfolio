# CLAUDE.md — Portfolio Project Context

이 문서는 Claude Code가 본 프로젝트에서 작업할 때 자동으로 참조하는 컨텍스트다. 모든 구현 결정의 가이드라인.

## Project

**wnsdlr.com** — 이준익 (Lee Junik) 개인 포트폴리오. DevOps / Platform Engineer 구직 목적.

**모토**: Try the code, Catch the people, Finally make it reliable.

## Source of Truth

코드보다 문서가 먼저다. 구현 시 항상 아래 문서를 참조한다:

| 문서 | 사용 시점 |
|---|---|
| [DESIGN.md](./DESIGN.md) | 모든 UI 결정 (컬러/타이포/모션/섹션 구조) |
| [CONTENT.md](./CONTENT.md) | 모든 텍스트/이미지/링크 컨텐츠 |
| [ROADMAP.md](./ROADMAP.md) | 무엇을 다음에 만들지 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 기술 아키텍처, 모듈 구조, 기술 결정 근거 |
| [SPEC.md](./SPEC.md) | 섹션별 기능 명세 + 수락 기준 |
| [API.md](./API.md) | API 엔드포인트 명세 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 배포 가이드 (Docker + NPM) |
| [AGENTS.md](./AGENTS.md) | 멀티에이전트 협업 헌장 (Phase 6+ 병렬 작업 시) |
| [STATUS.md](./STATUS.md) | 실시간 에이전트 상태 보드 |

문서와 코드가 충돌하면 **문서가 맞는 것**. 코드를 바꿔라. 디자인 결정을 임의로 바꾸지 말고, 문서를 먼저 업데이트한 다음 코드를 적용하라.

### ⚠️ 설치된 외부 Skill에 대한 우선순위 규칙

`.claude/skills/` 에 설치된 외부 skill(예: `tailwind-design-system`, `accessibility`)이 제안하는 패턴은 **참고용**. 본인 DESIGN.md와 충돌하면 **DESIGN.md가 우선**.

특히 주의:
- `tailwind-design-system` skill은 shadcn 스타일(HSL CSS 변수, 다크모드 토글)을 가정. 우리는 라이트모드 전용 + 직접 hex 컬러 사용. **skill 예제를 그대로 복붙 금지**, DESIGN.md의 토큰 명세에 맞게 변환.
- `accessibility` skill의 WCAG 2.2 AA 가이드는 그대로 따른다 (DESIGN.md와 충돌 없음).

### 프로젝트 커스텀 슬래시 명령

이 프로젝트에는 멀티 인스턴스 협업용 커스텀 슬래시 명령이 정의되어 있다 (`.claude/skills/`):

| 명령 | 용도 |
|---|---|
| `/start <role>` | 새 Claude 인스턴스를 특정 agent로 부트스트랩 (head/frontend/backend/infra/reviewer/docs) |
| `/develop <feature>` | 현재 agent 역할로 feature 작업 |
| `/review <feature>` | reviewer 전용 6-게이트 검사 |
| `/end [<state>]` | 작업 마무리 + STATUS.md 갱신 + 다음 agent 인계 |
| `/status [<agent>]` | STATUS.md 빠른 조회 |
| `/serve [<port>]` | Next.js dev 서버 실행 |
| `/logs [<target>]` | 로그 조회 (dev / docker / npm) |
| `/build [--docker]` | 프로덕션 빌드 |

새 tmux 윈도우/세션 진입 시 항상 `/start <role>` 부터 시작할 것.

## Stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS
- Pretendard (variable) + Schibsted Grotesk + JetBrains Mono
- Phosphor Icons (Regular weight 통일) + Lordicon
- Framer Motion (= motion/react)
- 패키지 매니저: **pnpm**

## Conventions

### TypeScript
- `strict: true` 유지
- `any` 금지. 정 필요하면 `unknown` 후 좁히기
- 컴포넌트 props는 명시적 type 정의
- 클라이언트 컴포넌트는 `"use client"` 명시. 서버 컴포넌트가 기본

### 파일 구조
```
app/             App Router 페이지/레이아웃
components/      재사용 UI (atomic 단위)
  ui/            primitive (Button, Card 등)
  sections/      페이지 섹션 단위 (Hero, About, Skills 등)
lib/             유틸 함수, 클라이언트
content/         정적 콘텐츠 (MDX 또는 TS 데이터)
public/          정적 자산 (이미지, Lottie JSON)
```

### 네이밍
- 컴포넌트: PascalCase (`HeroSection.tsx`)
- 유틸/훅: camelCase (`useMounted.ts`)
- 상수: SCREAMING_SNAKE
- CSS 변수: kebab-case (`--accent-blue`)

### 컴포넌트 작성
- 한 파일 한 컴포넌트 원칙
- props는 destructure로 받기
- 조건부 렌더링은 가독성 우선 (삼항 깊이 2 이하)
- 100줄 넘으면 분리 고려

## 디자인 가드레일 (DESIGN.md 요약)

### 절대 금지
- shadcn 디폴트 다크 + 보라 그라데이션
- glassmorphism
- 스킬 진행도 바 (%, 별점, 원 그래프)
- 마우스 따라다니는 blob
- 모든 섹션 fade-up scroll trigger
- 자동 반복 애니메이션
- 그라데이션 배경 전면
- 기본 lucide/heroicons 메인 사용
- Inter 폰트로만 처리
- Lorem ipsum

### 반드시 지킬 것
- 모든 트랜지션 0.15~0.3초, ease-out 통일
- 포인트 컬러 면적 10% 미만
- 블루→핑크 그라데이션은 단 1곳만
- Phosphor weight 통일
- 진행도 바 절대 X

## Commands

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm start        # 빌드된 서버 실행
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier 적용 (설정 후)
```

## 작업 우선순위

1. **문서 일관성**: DESIGN.md/CONTENT.md를 항상 source of truth로
2. **타입 안전성**: any 사용 금지, 컴파일 에러 0
3. **시각 정체성**: try/catch/finally 시그니처 노출 유지
4. **반응형**: mobile-first, breakpoint 일관
5. **접근성**: semantic HTML, alt 텍스트, focus 가시성

## 무엇을 하지 말 것

- 사용하지도 않는 abstraction 미리 만들기 (premature abstraction)
- "혹시 모를" 에러 핸들링 추가 (시스템 경계 외엔 신뢰)
- 주석으로 *무엇*을 설명 (이름으로 표현). 주석은 *왜*가 비자명할 때만
- "TODO: 나중에 리팩토링" 같은 부메랑 남기기
- 한 PR에 무관한 변경 섞기

## 메모리 / 사용자 정보

본 사용자에 대한 영속 메모리는 `~/.claude/projects/-home-zz262zz-homeserver/memory/`에 있다.
- 이름: 이준익 (juniqu-e)
- 역할: DevOps / Platform Engineer 지향
- 모토: try/catch/finally
- 학력: 정치외교학과 → SSAFY 12기
- 디자인 선호: 차분한 베이스 + 다이나믹 인터랙션, 시각/아이콘 중심, AI 클리셰 혐오

위 메모리는 자동으로 로드되니 별도로 다시 묻지 말 것.
