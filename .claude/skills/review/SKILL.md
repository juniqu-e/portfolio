---
name: review
description: "Run the 6-gate review against current branch or specific feature. Reviewer agent only. Checks: DESIGN.md anti-patterns, types, accessibility, content match, conventions, build/lint. Usage: /review <feature-or-branch>. Reports PASS/FAIL with specifics. Triggers: /review, review feature, gate check."
---

# /review — 6 게이트 검사

본 skill은 reviewer agent 전용. 다른 agent의 작업물을 머지 직전 검사한다. **코드를 직접 수정하지 않고 PASS/FAIL 보고만**.

## 사전 조건

- 현재 role이 `reviewer` 여야 함. 아니면 거부:
  ```
  ⚠️ reviewer agent로 부트스트랩한 후 사용하세요: /start reviewer
  ```

## 입력

- `/review <feature>` — feature 이름. 브랜치는 `feat/<feature>` 추정
- `/review <branch>` — 명시적 브랜치
- `/review` (인자 없음) — 현재 작업 브랜치 검사

## 실행 절차

### 1. 검사 대상 식별
```bash
git diff main...<branch> --name-only
```

영향받은 파일 목록 추출.

### 2. 6개 게이트 순차 실행

#### Gate 1 — DESIGN.md 안티패턴
```bash
# 12개 안티패턴 grep
grep -rn -E "bg-purple-|gradient-to.*purple" components/ app/   # 보라 그라데이션
grep -rn "backdrop-blur" components/ app/                       # glassmorphism
grep -rn -E "<progress|skill-bar|percentage" components/        # 진행도 바
grep -rn -E "cursor-glow|mouse-position|mouseFollow" components/ # blob
grep -rn "whileInView.*y:.*-20" components/                     # fade-up scroll
grep -rn -E "repeat: Infinity|infinite" components/             # 자동 반복
grep -rn -E "from-purple|via-pink.*to-" components/            # 그라데이션 도배
grep -rn "from 'lucide-react'" components/                      # 기본 lucide
grep -rn "font-family:.*Inter" .                                # Inter 단독
grep -rn -E "Lorem ipsum|placeholder.*text" components/         # placeholder
```

각 위반 발견 시 파일:줄번호 기록.

#### Gate 2 — 타입 정합성
```bash
grep -rn ": any" components/ app/ lib/                          # any 사용
pnpm typecheck                                                  # 컴파일
```

`any` 발견 또는 typecheck 실패 시 FAIL.

#### Gate 3 — 접근성 (WCAG 2.2)
```bash
grep -rn "<img" components/ app/ | grep -v "alt="              # alt 누락
grep -rn -E "<(div|span)[^>]*onClick" components/              # semantic violation
```

추가 수동 확인:
- 인터랙티브 요소에 `aria-label` 또는 visible text
- focus 가시성 (Tailwind `focus:` 적용)
- target size 24x24 CSS px (Button 등)

#### Gate 4 — CONTENT.md 일치
```bash
# 영향받은 컴포넌트가 사용해야 할 CONTENT.md 섹션 매핑
# (Hero → "Identity", About → "About Me", etc.)
# 컴포넌트에 하드코딩된 텍스트가 CONTENT.md와 일치하는지 spot check
```

수상 라벨 / 모토 / 시그니처 코드 블록 보존 여부 확인.

#### Gate 5 — 컨벤션 (CLAUDE.md)
- 한 파일 한 컴포넌트 (heuristic: `export default` 1개)
- 100줄 가이드 (초과 시 경고)
- `"use client"` 명시 (client 컴포넌트)
- 불필요한 주석 X

#### Gate 6 — 빌드 / 린트
```bash
pnpm lint
pnpm build
```

에러 0개 요구.

### 3. 결과 정리

STATUS.md 의 reviewer 줄 갱신:
```
- [reviewer] reviewed <feature>, result: PASS | FAIL
  - Gate 1 (anti-pattern): PASS — 위반 없음
  - Gate 2 (type): PASS
  - Gate 3 (a11y): FAIL — components/sections/Hero.tsx:24 alt 누락
  - Gate 4 (content): PASS
  - Gate 5 (convention): PASS
  - Gate 6 (build): PASS
```

### 4. 사용자에게 보고

PASS:
```
✅ <feature> 검사 통과
  - 6/6 게이트 통과
  - 영향 파일: <list>
다음: orchestrator 윈도우에서 머지 진행
```

FAIL:
```
❌ <feature> 검사 실패
  - 통과: 5/6 게이트
  - 실패: Gate 3 (접근성)
    - components/sections/Hero.tsx:24 — <img> alt 누락
    - components/ui/Button.tsx:18 — focus 가시성 없음
다음: frontend 윈도우에서 위 항목 수정 후 다시 /review hero
```

## 절대 금지

- 코드 직접 수정 (해당 agent에게 재작업 요청만)
- 게이트 통과 못 했는데 PASS 보고
- 본인 판단으로 안티패턴 예외 적용 (예외는 orchestrator + 사람이 결정)
- 다른 agent의 STATUS.md 줄 수정

## bkit 보조

다음 bkit skill을 보조로 호출 가능:
- `/code-review` — 일반 코드 품질
- `/qa-phase` — QA 게이트 (L1~L5)

위 도구의 결과를 자기 검사 결과와 함께 보고.
