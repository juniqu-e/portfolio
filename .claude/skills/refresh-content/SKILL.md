---
name: refresh-content
description: "CONTENT.md 변경 시 영향받는 content/*.ts 파일과 컴포넌트를 식별하고 갱신 가이드를 제시. Usage: /refresh-content [--section <name>] where section is identity|about|tech-stack|experience|projects|awards|education|contact|footer. 섹션 생략 시 CONTENT.md 전체 vs content/*.ts 비교. 코드 직접 수정은 X — 어떤 파일을 어떻게 갱신해야 하는지 가이드만. Triggers: /refresh-content, refresh content, content sync, 콘텐츠 갱신, content audit."
---

# /refresh-content — Content Drift Detector

본 skill은 CONTENT.md (콘텐츠 source of truth)와 `content/*.ts` (typed 데이터) / 컴포넌트(`components/sections/*.tsx`) 사이의 drift를 검출하고, 무엇을 어디서 갱신해야 하는지 가이드를 제시한다.

**핵심 가정**: CONTENT.md → `content/*.ts` → 컴포넌트 순서로 흐른다. CONTENT.md만 수정하고 코드에 반영 안 하면 drift 발생.

## 입력

`/refresh-content [옵션]`

| 옵션 | 동작 |
|---|---|
| (없음) | CONTENT.md 전체 vs 모든 `content/*.ts` 비교 |
| `--section <name>` | 특정 섹션만 검사. name은 identity / about / tech-stack / experience / projects / awards / education / contact / footer |
| `--since <ref>` | 특정 git ref 이후 CONTENT.md 변경된 부분만 (예: `--since HEAD~5`) |
| `--check-only` | 보고만, 갱신 가이드 출력 안 함 |

## 섹션 ↔ 파일 매핑

| CONTENT.md 섹션 | content/*.ts | 컴포넌트 |
|---|---|---|
| Identity (Hero) | — (정적 텍스트, layout/hero에 직접) | `components/sections/Hero.tsx`, `app/layout.tsx` (메타) |
| About Me | `content/profile.ts` | `components/sections/About.tsx` |
| Tech Stack | `content/skills.ts` | `components/sections/TechStack.tsx` |
| Experience | `content/experience.ts` | `components/sections/Experience.tsx` |
| Featured Projects | `content/projects.ts` | `components/sections/Projects.tsx` |
| Awards | `content/awards.ts` | `components/sections/Awards.tsx` |
| Education & Certification | `content/education.ts` | `components/sections/Education.tsx` |
| Contact | — (정적, footer에) | `components/sections/Contact.tsx`, `components/sections/Footer.tsx` |
| Footer Tagline | — | `components/sections/Footer.tsx` |

## 실행 절차

1. **CONTENT.md 파싱**: 섹션 헤더(`## ...`) 기준으로 chunk
2. **`content/*.ts` 읽기**: 각 데이터 파일의 export 객체/배열
3. **diff 검출** (섹션별):
   - **추가**: CONTENT.md에 있는데 `content/*.ts`에 없음
   - **수정**: 텍스트/필드 값이 다름
   - **삭제**: CONTENT.md에서 사라졌는데 `content/*.ts`엔 남음
   - **신규 섹션**: `content/*.ts` 자체가 없음 (Phase 4 이전엔 정상)
4. **컴포넌트 참조 확인**: `components/sections/<name>.tsx` 가 영향받는 필드를 사용 중인지 grep
5. **보고서 + 갱신 가이드 출력**

## 출력 형식

### Drift 없음
```
✅ Content sync OK
  CONTENT.md ↔ content/*.ts 일치. 갱신 불필요.
```

### Drift 발견
```
⚠️  Content drift detected (3 항목)

[Tech Stack] CONTENT.md에 추가됨, content/skills.ts에 미반영
  + "OPA / Conftest" (DevOps / Platform 카테고리)
  → content/skills.ts 의 devOpsPlatform 배열에 추가 필요
  → components/sections/TechStack.tsx 는 배열 순회하므로 자동 반영

[Featured Projects] 텍스트 변경
  - DevFlow Harness 설명 문장 갱신 (CONTENT.md L124)
  → content/projects.ts 의 devflowHarness.description 갱신 필요
  → components/sections/Projects.tsx 영향 없음 (데이터만 변경)

[Awards] 항목 삭제
  - 2024년 이전 수상 entry 없어짐 (확인 필요)
  → content/awards.ts 에서 해당 객체 제거 필요
  → 의도된 삭제인지 head에게 확인 권장

다음 단계:
  1. content/skills.ts, content/projects.ts, content/awards.ts 갱신
  2. 갱신 후 /check-design-rule components/sections/{TechStack,Projects,Awards}.tsx
  3. typecheck + 시각 확인
```

### Phase 4 이전 (코드 없음)
```
ℹ️  content/ 디렉토리 미존재 (Phase 4 시작 전)
  CONTENT.md 만 존재. Phase 4에서 content/*.ts 생성 시 본 skill 본격 활용.
  현재는 CONTENT.md 자체 일관성만 점검 중...

  CONTENT.md 자체 점검:
  ✅ 9개 섹션 모두 존재
  ✅ Identity 시그니처 코드 블록 + 모토 존재
  ⚠️  Tech Stack — Lordicon 7개 이상 사용 계획? DESIGN.md 권장 5~6개
```

## 사용 시점

| 시점 | 누가 |
|---|---|
| CONTENT.md 편집 직후 | head 또는 documenter |
| 사람이 콘텐츠 추가/수정 의뢰 | head (위임 전 영향도 파악) |
| documenter agent가 phase 마무리 | documenter |
| reviewer가 콘텐츠 관련 PR 검토 | reviewer (게이트 6) |

## 금지 사항

- 본 skill은 **read-only 분석**. 코드/문서 수정 X
- 의심스러운 drift를 "맞다/틀리다" 단정 X — 사람/head 판단 영역
- CONTENT.md 자체를 임의로 수정 X (DESIGN.md/CONTENT.md는 사람 영역)
- 진행도 바/별점 같은 시각 표현 제안 X (DESIGN.md 위반)

## 예시

```bash
# 전체 검사
/refresh-content

# Tech Stack만
/refresh-content --section tech-stack

# 지난 5개 커밋 동안 CONTENT.md 변경분
/refresh-content --since HEAD~5

# 검사만 (가이드 출력 생략)
/refresh-content --check-only
```

## 향후 확장 (Phase 4+)

- `--apply` 플래그: 명백한 drift는 자동 patch 생성 (review 후 사람 적용)
- CONTENT.md 변경 hook과 연동 (PostToolUse Edit on CONTENT.md → 자동 실행)
