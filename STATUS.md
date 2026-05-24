# STATUS.md — 실시간 에이전트 상태 보드

모든 agent는 작업 시작/완료/블록 시 본 파일을 업데이트해야 한다. 한 agent = 한 줄.

**규칙**:
- 자기 줄만 수정 (다른 agent 줄 건드리지 말 것)
- 형식: `- [agent-name] <status> <files> <eta-or-note>`
- status: `idle`, `in_progress`, `ready-for-review`, `blocked`, `paused-for-doc-change`, `done`
- 파일 잠금: `[locked-by: <agent>]` 형식으로 표기

---

## Current State (sync timestamp: 2026-05-24)

- [orchestrator] **idle** — Phase 2 완료 직후, Phase 3 시작 대기
- [frontend] **idle** — Phase 4 시작 대기 (Next.js 초기화 후 활성)
- [backend] **idle** — portfolio 백엔드 작업 거의 없음 (Phase 6 contact form 시점에 활성 가능)
- [infrastructure] **idle** — Phase 9 배포 시점에 활성
- [reviewer] **idle** — 머지 직전 호출
- [documenter] **idle** — phase 완료 시마다 호출

---

## Locked Files

(현재 잠금 없음)

---

## Blockers / Issues

(현재 없음)

---

## 최근 활동 로그 (최신순, 최대 20개 유지)

- `2026-05-24` orchestrator: AGENTS.md / STATUS.md / 6 agent 정의 작성. 멀티에이전트 인프라 구축
- `2026-05-24` orchestrator: bkit 설치 완료 (40+ skills 로드)
- `2026-05-24` orchestrator: tailwind-design-system / accessibility skill 프로젝트 설치
- `2026-05-24` orchestrator: Foundation 문서 5종 작성 (DESIGN/CONTENT/CLAUDE/README/ROADMAP)
- `2026-05-24` orchestrator: .claude/settings.json + .gitignore + hooks 세팅
