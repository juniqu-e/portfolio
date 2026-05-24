---
name: develop
description: "Implement a feature based on the current agent's role. Usage: /develop <feature>. Each agent interprets the feature according to their role spec. Frontend implements components, backend implements API, infra builds deploy artifacts, reviewer runs gates, documenter updates docs. Must be invoked AFTER /start. Triggers: /develop, develop feature, work on, implement."
---

# /develop — Feature 작업

본 skill은 현재 agent의 역할에 맞춰 feature를 진행한다. **반드시 `/start <role>` 이후에 사용**.

## 입력

`/develop <feature>` 형식. feature는 SPEC.md / API.md / DEPLOYMENT.md 에 정의된 항목 또는 자유 텍스트.

예시:
- `/develop hero` — Hero 섹션
- `/develop guestbook` — 방명록 (frontend 또는 backend가 각자 해석)
- `/develop og-image-api` — OG image API endpoint
- `/develop docker-build` — Dockerfile 작성
- `/develop hero --branch feat/hero` — 명시적 브랜치

## 사전 검증

1. **자기 role 확인** — `/start` 안 했으면 거부:
   ```
   ⚠️ 먼저 /start <role> 로 부트스트랩하세요.
   ```
2. **STATUS.md 확인** — 같은 feature를 다른 agent가 작업 중이면 충돌 경고
3. **feature 매핑 확인** — SPEC.md / API.md / DEPLOYMENT.md 에 정의가 있는지 확인. 없으면 사용자에게 질문.

## Role별 동작

### head
1. SPEC.md / API.md / DEPLOYMENT.md 에서 feature 정의 확인
2. 어떤 agent들이 협업해야 하는지 식별 (예: guestbook = frontend + backend)
3. 작업 단위를 분해하여 STATUS.md에 등록
4. 각 agent에게 사용자가 무엇을 지시해야 할지 출력:
   ```
   📋 <feature> 계획:
   - frontend 윈도우에서: /develop guestbook-ui
   - backend 윈도우에서: /develop guestbook-api
   - reviewer 호출 시점: 양쪽 ready-for-review 동시 도달 후
   ```

### frontend
1. SPEC.md 에서 해당 섹션의 AC 확인
2. DESIGN.md 가드레일 + 안티패턴 12개 재확인 (실제 코드에 반영 전)
3. CONTENT.md 에서 콘텐츠 가져오기
4. 작업 시작 전 STATUS.md 자기 줄을 `in_progress, <files>, <eta>` 로 갱신
5. 컴포넌트 작성 (한 파일 한 컴포넌트, 100줄 가이드)
6. 작업 중 다른 agent의 권한 파일을 만져야 하면 즉시 중단 + 사용자 보고
7. `pnpm typecheck` + `pnpm lint` 통과 확인
8. 완료 시 STATUS.md `ready-for-review` 표시
9. 사용자에게 다음 단계 안내: "reviewer 윈도우에서 `/review <feature>`"

### backend
1. API.md 에서 endpoint 명세 확인
2. ARCHITECTURE.md 보안 규칙 + 데이터 흐름 확인
3. STATUS.md 갱신 → 구현 → 검증 → `ready-for-review`
4. 보안 체크리스트 자체 확인 (honeypot, rate-limit, validation 등)
5. 사용자에게 다음 단계 안내

### infra
1. DEPLOYMENT.md 에서 해당 영역 확인
2. STATUS.md 갱신 → 구현 → 로컬 검증 → `ready-for-review`
3. Docker 작업 시 빌드 검증 (`docker build` 또는 `docker compose config`)
4. 사용자에게 다음 단계 안내

### reviewer
**`/develop` 대신 `/review` 사용을 권장**. `/develop`로 들어오면 안내:
```
ℹ️ reviewer는 /review <feature> 명령을 사용하세요.
```

### docs
1. CONTENT.md / ROADMAP.md / CHANGELOG.md 등에서 갱신 대상 식별
2. STATUS.md 갱신 → 문서 업데이트 → `done`
3. 코드 파일 절대 수정 X

## 출력 형식

간결:
```
🛠 frontend: components/sections/Hero.tsx 구현 중
  - SPEC.md §1 AC 1~5 적용
  - DESIGN.md try/catch/finally 시그니처 포함
  - typecheck ✓ lint ✓

📋 STATUS.md 업데이트: ready-for-review
다음: reviewer 윈도우에서 `/review hero`
```

## 절대 금지

- 자기 권한 외 파일 수정
- DESIGN.md 안티패턴 위반 (12개)
- STATUS.md 갱신 없이 작업 시작/완료
- 사용자 확인 없이 머지 (frontend/backend/infra는 머지 권한 없음)
- 모호한 feature에 임의 가정으로 진행
