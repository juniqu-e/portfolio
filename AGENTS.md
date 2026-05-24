# AGENTS.md — 멀티에이전트 협업 헌장

본 문서는 portfolio 프로젝트의 멀티 에이전트 협업 규칙을 정의한다. 모든 agent는 작업 시작 전 이 문서를 읽어야 한다. 위반 시 즉시 작업 중단 + 보고.

본 구조는 portfolio 프로젝트가 비록 단일 도메인이지만 **DevFlow Harness 같은 멀티 도메인 프로젝트 아키텍처 학습용 sandbox** 역할도 한다.

---

## 에이전트 명단

| Agent | Role | 한 줄 요약 |
|---|---|---|
| **head** | 두뇌 / PM | 전체 흐름 계획, 작업 배분, 통합 결정 |
| **frontend** | 프론트엔드 빌더 | UI 컴포넌트 / 페이지 / 디자인 토큰 구현 |
| **backend** | 백엔드 빌더 | API route handler, 서버 로직 (portfolio에선 최소) |
| **infrastructure** | 인프라 / 배포 | Docker, CI/CD, 홈서버 배포 |
| **reviewer** | 머지 리뷰어 | 통합 직전 코드/디자인/접근성 게이트 |
| **documenter** | 문서화 | ROADMAP/CHANGELOG 동기화, 콘텐츠 다듬기 |

---

## 핵심 규칙

### 1. **단일 파일 소유 원칙 (Single Writer)**
한 파일은 한 agent만 쓴다. 다른 agent가 같은 파일을 만져야 하면:
- 먼저 `STATUS.md`에 `[locked-by: <agent>]` 표시
- 해당 agent가 작업 끝낼 때까지 대기
- 충돌 발생 시 head가 조율

### 2. **공유 문서 read-only 정책**
병렬 작업 중 다음 문서는 **변경 금지**:
- `DESIGN.md` — 디자인 시스템 (source of truth)
- `CONTENT.md` — 콘텐츠 원본
- `CLAUDE.md` — Claude 컨텍스트
- `AGENTS.md` — 본 문서
- `types/index.ts` — 공유 타입 (Phase 4 이후 동결)

변경 필요 시:
- 작업 일시 정지 → `STATUS.md`에 `[paused-for-doc-change]` 기록
- head/사람에게 보고
- 일괄 업데이트 → 재개

### 3. **STATUS.md 상시 동기화**
모든 agent는 작업 시작/끝/블록될 때 `STATUS.md`에 한 줄 업데이트:
```
- [agent-name] <status> <touching-files> <eta>
  e.g., - [frontend] in_progress, components/sections/Hero.tsx, ~30min
```

### 4. **타입 우선 (Contract-First)**
구현 전에 `types/` 에 인터페이스 정의 → 모든 agent가 동일 타입 따름.
타입 정의 권한은 head + frontend lead만.

### 5. **머지는 head만**
각 agent가 자기 worktree/브랜치에서 작업.
머지는 head(또는 사람)가 단일 지점에서 순차 진행.
agent는 자기 브랜치 외부로 push/merge 금지.

### 6. **DESIGN.md 가드레일 절대 준수**
모든 agent는 작업 시작 전 `DESIGN.md`의 안티패턴 12개를 인지하고 회피.
reviewer agent는 머지 전 이를 강제 검사.

---

## 작업 흐름 (Lifecycle)

```
1. head: 작업 정의 + STATUS.md에 task 등록
2. head: 적합한 agent 선정 → 작업 위임
3. 해당 agent: STATUS.md 업데이트 → 작업 시작
4. 해당 agent: 작업 중 다른 agent와 충돌 가능성 발견 → head 보고
5. 해당 agent: 작업 완료 → STATUS.md에 `ready-for-review` 표시
6. reviewer: 게이트 검사 → pass/fail 결정
7. head: pass 시 머지, fail 시 해당 agent에 재작업 지시
8. documenter: 머지 후 ROADMAP / CHANGELOG 업데이트
```

---

## 파일 소유 매트릭스 (Write Permissions)

| 디렉토리/파일 | 주 소유자 | 보조 가능 |
|---|---|---|
| `components/sections/` | frontend | — |
| `components/ui/` | frontend | — |
| `app/` (페이지/레이아웃) | frontend | backend (API routes only) |
| `app/api/` | backend | — |
| `lib/` | frontend | backend |
| `tailwind.config.ts` | frontend | — |
| `next.config.ts` | frontend | infrastructure (deploy 관련) |
| `Dockerfile`, `.dockerignore` | infrastructure | — |
| `.github/workflows/` | infrastructure | — |
| `deploy/` (배포 스크립트, nginx config) | infrastructure | — |
| `types/` | head + frontend | — |
| `CHANGELOG.md` | documenter | — |
| `ROADMAP.md` (status section) | documenter | head |
| `STATUS.md` | all (각자 자기 줄) | — |
| `DESIGN.md`, `CONTENT.md`, `CLAUDE.md`, `AGENTS.md`, `README.md` | head + 사람 | — |

---

## 보고/에스컬레이션 프로토콜

agent가 다음 상황 마주치면 즉시 `STATUS.md` + head 메모로 보고:

| 상황 | 대응 |
|---|---|
| 자기 권한 외 파일 수정 필요 | 대기 + 보고 → head가 위임 또는 조율 |
| DESIGN.md 안티패턴 위반 위험 발견 | 대기 + 보고 |
| 타입 정의 부족/모호 | 대기 + 보고 → 타입 먼저 확정 |
| CONTENT.md 누락/오류 발견 | 보고 (작업 계속하지 말 것) |
| 다른 agent의 출력에 의존하는데 미완료 | STATUS.md에 `blocked-by: <agent>` 표시 |

---

## 학습 목적 — DevFlow Harness 이전(transfer) 의도

본 구조의 패턴은 추후 본인의 **DevFlow Harness** 프로젝트(Jira API + GitHub API + K8s + Web UI + OPA)에 그대로 적용 가능하도록 설계됨.

DevFlow Harness 적용 시 각 agent의 작업량이 본질적으로 큼 (포트폴리오에선 일부 agent가 idle).
포트폴리오에서 협업 흐름/충돌 패턴/머지 과정을 학습한 후, 진짜 멀티 도메인 프로젝트로 이전.
