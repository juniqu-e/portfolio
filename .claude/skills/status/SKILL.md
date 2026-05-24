---
name: status
description: "Display current state of all agents from STATUS.md as a quick summary. Optionally filter by agent. Usage: /status or /status <agent>. Useful in any window before deciding next action. Triggers: /status, status check, what's going on, agent status."
---

# /status — 상태 보드 조회

본 skill은 STATUS.md를 읽어서 모든 agent의 현재 상태를 요약 표시한다.

## 입력

- `/status` — 모든 agent 상태
- `/status <agent>` — 특정 agent만
- `/status blockers` — blocked 상태인 agent만

## 동작

### 1. STATUS.md 읽기

`STATUS.md` 전체 파싱:
- Current State 섹션 (6개 agent 줄)
- Locked Files 섹션
- Blockers / Issues 섹션
- 최근 활동 로그 (상위 5개만 표시)

### 2. 요약 표 출력

```
📊 STATUS — 2026-05-24 23:00

| Agent          | Status              | Files                         | Note     |
|---             |---                  |---                            |---       |
| orchestrator   | 🟢 idle             | —                             |          |
| frontend       | 🔵 in_progress      | components/sections/Hero.tsx  | ~30min   |
| backend        | ⚪ idle             | —                             |          |
| infrastructure | ⚪ idle             | —                             |          |
| reviewer       | ⚪ idle             | —                             |          |
| documenter     | ⚪ idle             | —                             |          |

🔒 Locked Files: (없음)

⚠️ Blockers: (없음)

📜 최근 활동 (최대 5개):
  • frontend: Hero 구현 시작 (HH:MM)
  • orchestrator: AGENTS/STATUS 작성 완료 (HH:MM)
  • orchestrator: bkit 설치 완료 (HH:MM)
```

### 3. 상태 아이콘 매핑

| Status | 아이콘 |
|---|---|
| idle | ⚪ |
| in_progress | 🔵 |
| ready-for-review | 🟡 |
| blocked | 🔴 |
| paused | ⏸ |
| done | ✅ |

### 4. 다음 액션 제안

상태 분석 후 적절한 다음 액션을 사용자에게 제안:

- 모두 idle → "다음 작업 결정 필요. orchestrator 윈도우에서 `/develop <feature>`"
- frontend ready-for-review → "reviewer 윈도우에서 `/review <feature>`"
- reviewer FAIL → "해당 agent 윈도우에서 수정 후 `/end`"
- 블록 발생 → "어디가 블록인지 보고 + 해결"

## 옵션 동작

### `/status <agent>`
해당 agent 줄 + 그 agent가 작업 중이면 어떤 파일, ETA 표시.

### `/status blockers`
blocked 상태인 agent만 + 블록 이유 출력.

## 절대 금지

- STATUS.md 의 다른 agent 줄 수정 (읽기 전용)
- 추측으로 상태 표시 (STATUS.md 실제 내용만 사용)
- 너무 장황한 출력 (간결 표 + 다음 액션 1줄)
