---
name: start
description: "Bootstrap this Claude instance as a specific project agent. Usage: /start <role> where role is head | frontend | backend | infra | reviewer | docs. Reads the matching .claude/agents/*.md plus AGENTS.md, DESIGN.md, SPEC.md, STATUS.md, and other relevant docs. Use at the START of every new Claude Code session in any tmux window/worktree. Triggers: /start, start head, start frontend, start backend, start infra, start reviewer, start docs."
---

# /start — Agent Bootstrap

본 skill은 새 Claude 인스턴스가 자기 역할을 인지하고 필요한 컨텍스트를 로드하는 부트스트랩 명령이다. **모든 멀티 인스턴스 세션의 첫 명령**.

## 입력

`/start <role>` 형식. role은 다음 중 하나:

| role | 별칭 |
|---|---|
| `head` | `lead`, `pm` |
| `frontend` | `fe`, `front` |
| `backend` | `be`, `back` |
| `infra` | `infrastructure`, `ops`, `devops` |
| `reviewer` | `review`, `qa` |
| `docs` | `doc`, `documenter`, `documentation` |

role을 지정하지 않으면 사용 가능한 role 목록을 제시하고 사용자에게 확인 요청.

## 실행 절차

1. **role을 정규형으로 매핑** (예: `fe` → `frontend`)
2. **사용자에게 한 줄 보고**: "이 인스턴스를 <role> agent로 부트스트랩합니다"
3. **읽어야 할 문서를 순서대로 로드**:

   공통 (모든 role):
   - `AGENTS.md` — 협업 헌장
   - `CLAUDE.md` — 프로젝트 컨벤션
   - `STATUS.md` — 다른 agent 현재 상태
   - `ROADMAP.md` — 현재 phase

   role별 추가:

   | role | 필독 |
   |---|---|
   | head | `.claude/agents/head.md`, `ARCHITECTURE.md`, `SPEC.md`, `DESIGN.md`, `CONTENT.md` |
   | frontend | `.claude/agents/frontend.md`, `DESIGN.md`, `SPEC.md`, `CONTENT.md`, `ARCHITECTURE.md` |
   | backend | `.claude/agents/backend.md`, `API.md`, `ARCHITECTURE.md`, `SPEC.md` |
   | infra | `.claude/agents/infrastructure.md`, `DEPLOYMENT.md`, `ARCHITECTURE.md` |
   | reviewer | `.claude/agents/reviewer.md`, `DESIGN.md`, `SPEC.md`, `API.md`, `CLAUDE.md` |
   | docs | `.claude/agents/documenter.md`, `CONTENT.md`, `ROADMAP.md` |

4. **읽기 후 자기 점검**:
   - 자기 권한 (어떤 파일을 쓸 수 있는지)
   - 자기 금지 (절대 만지지 말 파일)
   - DESIGN.md 안티패턴 12개 (frontend/reviewer 필수)
   - 현재 STATUS.md 상의 다른 agent 상태

5. **STATUS.md 업데이트**: 자기 줄을 `idle`로 갱신
   ```
   - [<role>] idle — bootstrapped, awaiting task
   ```
   ⚠️ 다른 agent 줄은 절대 건드리지 말 것.

6. **사용자에게 보고**:
   ```
   ✅ <role> agent 부트스트랩 완료.
   
   역할: <한 줄 요약>
   다음 명령: /develop <feature> 또는 사용자 지시 대기.
   ```

## 출력 형식 (간결)

장황한 요약 X. 핵심만:
```
✅ frontend agent 준비 완료.

읽은 문서: AGENTS.md, CLAUDE.md, STATUS.md, ROADMAP.md, 
        .claude/agents/frontend.md, DESIGN.md, SPEC.md, CONTENT.md, ARCHITECTURE.md

권한: components/, app/, lib/, tailwind.config.ts, public/
금지: app/api/, Dockerfile, types/ 수정

대기 중.
```

## 절대 금지

- 부트스트랩 시 다른 파일을 *수정*하지 말 것 (STATUS.md 자기 줄만 OK)
- 다른 agent 줄 건드리지 말 것
- role 모호하면 사용자에게 질문 (임의 가정 X)
- 부트스트랩만 하고 즉시 작업 시작 X (사용자 다음 지시 대기)
