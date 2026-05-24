---
name: check-design-rule
description: "DESIGN.md 가드레일에 대해 컴포넌트 파일을 빠르게 검사. Usage: /check-design-rule <path> where path is a file or directory. design-auditor agent를 호출하여 안티패턴 12개 + 토큰/모션/타이포 위반을 PASS/WARN/FAIL로 보고. 컴포넌트 작성 직후 또는 PR 머지 직전에 사용. Triggers: /check-design-rule, check design, design check, design audit, 디자인 검사."
---

# /check-design-rule — Design Guardrail Quick Check

본 skill은 단일 파일 또는 디렉토리에 대해 DESIGN.md 가드레일 검사를 빠르게 실행하는 entry point다. 내부적으로 `design-auditor` agent를 호출한다.

## 입력

`/check-design-rule <path>` 형식. path는 다음 중 하나:
- 파일 경로 (예: `components/sections/Hero.tsx`)
- 디렉토리 (예: `components/sections/` → 재귀 검사)
- `--diff` 플래그 (예: `/check-design-rule --diff` → `git diff HEAD~1` 의 변경 라인만)
- `--staged` 플래그 (`git diff --cached` 대상)

path 생략 시 사용자에게 질문.

## 실행 절차

1. **path 정규화 + 존재 확인**
   - 파일이면 그대로
   - 디렉토리면 `.tsx`/`.ts`/`.css` 만 글롭
   - `--diff`면 git 명령 실행
2. **design-auditor agent 호출**:
   ```
   Agent({
     description: "design audit on <path>",
     subagent_type: "design-auditor",
     prompt: "<path> 를 DESIGN.md 가드레일에 대해 검사. PASS/WARN/FAIL + 위반 라인 보고."
   })
   ```
3. **결과 가공 후 사용자 출력**:
   - FAIL 0건 → 한 줄 PASS 메시지
   - FAIL 1+ → agent 보고서 그대로 + 한 줄 요약 (수정 필요 N건)
4. **종료 코드 안내**: FAIL 있으면 머지 보류 권장 메시지

## 출력 형식

### PASS 케이스
```
✅ Design check PASS — components/sections/Hero.tsx
  검사 항목: 안티패턴 12개, 토큰, 모션, 아이콘, 타이포, 시그니처
  WARN: 0건  FAIL: 0건
```

### FAIL 케이스
```
❌ Design check FAIL — components/sections/Hero.tsx

[design-auditor 보고서 그대로 인용]

요약: FAIL 2건 / WARN 1건
다음: 위반 라인 수정 후 다시 /check-design-rule 실행
       (머지는 FAIL 0건일 때만)
```

## 사용 시점

| 시점 | 누가 |
|---|---|
| 컴포넌트 작성 직후 | frontend agent (self-check) |
| PR 머지 직전 | reviewer agent (게이트 4번) |
| 사람이 의심스러운 코드 발견 시 | head 또는 사용자 |
| CONTENT.md 갱신 후 영향 컴포넌트에 | head + `/refresh-content` 와 함께 |

## 금지 사항

- 본 skill 자체는 코드 수정 X (design-auditor가 read-only)
- DESIGN.md 외 규칙 (lint/typecheck/test) 검사 X — 별도 도구
- WARN을 자동으로 FAIL로 격상 X — 사람 판단 영역

## 예시

```bash
# 단일 파일
/check-design-rule components/sections/Hero.tsx

# 섹션 전체
/check-design-rule components/sections/

# 마지막 커밋 변경분만
/check-design-rule --diff

# 스테이지된 변경분 (pre-commit hook 자리)
/check-design-rule --staged
```
