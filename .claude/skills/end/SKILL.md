---
name: end
description: "Finalize current work and update STATUS.md with completion. Optionally indicate next agent. Replaces verbose hand-off messages. Usage: /end or /end <next-action>. Triggers: /end, end task, finish work, hand off."
---

# /end — 작업 마무리

본 skill은 현재 agent의 작업을 마무리하고 STATUS.md를 갱신한다. 다음 agent에게의 인계도 안내.

## 사전 검증

- 자기 role 확인 (`/start` 안 했으면 거부)
- STATUS.md 에 자기 줄이 `in_progress` 상태여야 의미 있음 (idle이면 경고)

## 입력

- `/end` (인자 없음) — 현재 작업 완료 처리
- `/end ready-for-review` — reviewer 호출 안내
- `/end blocked` — 블록 상태 명시
- `/end paused` — 일시 정지

## 동작

### 1. 상태 결정

현재 agent + 컨텍스트로 적절한 상태 자동 결정:

| 현재 role | 다음 상태 (기본) |
|---|---|
| frontend / backend / infra | `ready-for-review` |
| reviewer | PASS 또는 FAIL (검사 결과 기반) |
| docs | `done` |
| head | `idle` (다음 위임 대기) |

사용자가 명시했으면 그대로 사용.

### 2. 작업물 자체 점검

머지 또는 인계 전에 빠른 sanity check:
```bash
git status                       # 미커밋 변경 확인
git diff --stat HEAD             # 변경 요약
pnpm typecheck                   # frontend/backend면 (가능한 경우)
```

이상 발견 시 사용자에게 보고하고 정리 후 재실행 권고.

### 3. STATUS.md 갱신

자기 줄을 새 상태로:
```
- [frontend] ready-for-review — components/sections/Hero.tsx (37 lines, +1 new)
```

activity log에 한 줄 추가:
```
- `YYYY-MM-DD HH:MM` <role>: <한 줄 요약>
```

### 4. 다음 안내

상태별 안내:

**ready-for-review**:
```
✅ 작업 완료, ready-for-review 처리.

다음 단계:
  1. reviewer 윈도우에서: /review <feature>
  2. 게이트 통과 시 head 윈도우에서 머지

영향 파일: <files>
브랜치: <current branch>
```

**PASS (reviewer)**:
```
✅ <feature> 검사 통과
다음: head 윈도우에서 머지 진행:
  git checkout main
  git merge --no-ff feat/<feature>
  docs 윈도우에서: /develop changelog-<feature>
```

**FAIL (reviewer)**:
```
❌ <feature> 검사 실패. 재작업 필요.
다음: 해당 agent 윈도우에서 수정 후 다시 /end
실패 게이트: <gate-name>
구체 항목: <details>
```

**blocked**:
```
⏸ 블록 상태로 표시.
이유: <reason>
필요한 조치: <what's needed>
사용자/head의 개입 대기.
```

## 절대 금지

- 자기 작업이 안 끝났는데 ready-for-review 표시
- 머지를 직접 수행 (head 또는 사람만 가능)
- 다른 agent 줄 수정
- 검사 안 했는데 PASS 표시 (reviewer)

## bkit 연동

bkit이 활성이면 다음도 시도:
- `/btw` — 작업 중 떠오른 개선 아이디어가 있다면 기록
- 적절한 phase 명령어 호출 (예: `/pdca next`)
