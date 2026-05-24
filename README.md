# Portfolio · wnsdlr.com / leejunik.com

이준익 (Lee Junik) — DevOps / Platform Engineer 지향 — 의 개인 포트폴리오 사이트.

> **try: 코드로 도전하고, catch: 사람과 소통하며, finally: 신뢰할 수 있는 서비스를 만듭니다.**

홈서버에서 호스팅되며, Claude Code + bkit + 자체 멀티 에이전트 인프라 기반 AI-native 개발 워크플로우로 구축한다.

---

## Stack

- **Next.js** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** (DESIGN.md 토큰)
- **Pretendard** (한글 본문) + **Schibsted Grotesk** (영문 디스플레이) + **JetBrains Mono** (코드)
- **Phosphor Icons** (정적) + **Lordicon** (애니메이션)
- **Framer Motion** (인터랙션)
- **SQLite** (방명록 저장)
- **Docker Compose + Nginx Proxy Manager** (배포)

---

## Documents

본 프로젝트는 코드보다 문서를 먼저 정의한다. 모든 구현 결정은 아래 문서를 참조한다.

| 문서 | 내용 |
|---|---|
| [DESIGN.md](./DESIGN.md) | 디자인 시스템 — 컬러/타이포/모션/안티패턴 |
| [CONTENT.md](./CONTENT.md) | 포트폴리오 콘텐츠 원본 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 기술 아키텍처 |
| [SPEC.md](./SPEC.md) | 기능 명세 + 수락 기준 |
| [API.md](./API.md) | API 명세 (방명록, OG, sitemap) |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 배포 가이드 (Docker + NPM) |
| [AGENTS.md](./AGENTS.md) | 멀티에이전트 협업 헌장 |
| [STATUS.md](./STATUS.md) | 실시간 에이전트 상태 보드 |
| [CLAUDE.md](./CLAUDE.md) | Claude Code용 프로젝트 컨텍스트 |
| [ROADMAP.md](./ROADMAP.md) | 구현 단계 및 진행 상황 |

---

## 🤖 멀티 에이전트 워크플로우

이 프로젝트는 **6개 agent + 8개 커스텀 슬래시 명령**으로 운영된다. 단일 인스턴스에서도 사용 가능하지만, 여러 tmux 윈도우/워크트리에서 멀티 인스턴스로 협업 가능.

### Agent 역할 (`.claude/agents/`)

| Agent | 별칭 | 책임 | 모델 |
|---|---|---|---|
| **head** | lead, pm | 작업 계획, 위임, 머지, 타입 정의 | opus |
| **frontend** | fe, front | UI 컴포넌트, 페이지, 디자인 토큰 | sonnet |
| **backend** | be, back | API route, 서버 로직, DB | sonnet |
| **infrastructure** | infra, ops, devops | Docker, CI/CD, 배포 | sonnet |
| **reviewer** | review, qa | 6-게이트 검사, PASS/FAIL 보고 | opus |
| **documenter** | docs, doc | ROADMAP/CHANGELOG/CONTENT 갱신 | haiku |

### 커스텀 슬래시 명령 (`.claude/skills/`)

| 명령 | 용도 | 누가 사용 |
|---|---|---|
| `/start <role>` | agent 부트스트랩 (관련 문서 자동 로드) | 모든 인스턴스 첫 명령 |
| `/develop <feature>` | feature 작업 (역할별 다르게 동작) | 작업 진행 시 |
| `/review <feature>` | 6-게이트 검사 | reviewer 전용 |
| `/end [<state>]` | 작업 마무리 + STATUS.md 갱신 + 인계 안내 | 작업 종료 시 |
| `/status [<agent>]` | STATUS.md 빠른 조회 | 누구든 어디서든 |
| `/serve [<port>]` | Next.js dev 서버 실행 | frontend / 운영 |
| `/logs [<target>]` | 로그 조회 (dev / docker / npm) | 누구든 |
| `/build [--docker]` | 프로덕션 빌드 | infrastructure / frontend |

---

## 🚀 워크플로우 셋업 — 한 번만

### 1) 워크트리 생성 (선택, 권장)

코드 작성 agent들이 진짜 격리된 환경에서 작업하도록:

```bash
cd /home/zz262zz/homeserver/portfolio
git worktree add ../portfolio-frontend -b feat/frontend
git worktree add ../portfolio-backend  -b feat/backend
git worktree add ../portfolio-infra    -b feat/infra
```

reviewer / head / documenter는 메인 트리 공유 (각자 다른 파일만 만짐).

### 2) tmux 윈도우 매핑

```
window 1: 헤드  → /home/zz262zz/homeserver/portfolio          (main)
window 2: 개발            → 3 panes:
  pane 0: frontend       → /home/zz262zz/homeserver/portfolio-frontend
  pane 1: backend        → /home/zz262zz/homeserver/portfolio-backend
  pane 2: infra          → /home/zz262zz/homeserver/portfolio-infra
window 3: 리뷰            → /home/zz262zz/homeserver/portfolio          (main)
window 4: 문서화          → /home/zz262zz/homeserver/portfolio          (main)
window 5: 쉘              → /home/zz262zz/homeserver/portfolio          (free)
window 6: 서버            → /home/zz262zz/homeserver/portfolio-frontend (dev server)
window 7: 로그            → /home/zz262zz/homeserver/portfolio          (docker logs 등)
```

---

## 🎬 일일 워크플로우 — 매 세션 시작 시

### 3) 각 윈도우에서 `claude` 실행 + `/start <role>`

```
[window 1 헤드]   claude → /start head
[window 2 개발 pane 0]      claude → /start frontend
[window 2 개발 pane 1]      claude → /start backend
[window 2 개발 pane 2]      claude → /start infra
[window 3 리뷰]             claude → /start reviewer
[window 4 문서화]           claude → /start docs
```

각 인스턴스가 자기 역할 문서 + 공유 문서를 로드하고 "준비 완료" 보고.

---

## 📖 실전 예시 5개

### 예시 1: Phase 4 — Next.js 초기화 (단일 agent)

```
[head]: "Phase 4 시작. frontend가 nextjs-init 수행"
[frontend]:     /develop nextjs-init
   ↓ pnpm create next-app + Tailwind config + 폰트 + Phosphor 설치
[frontend]:     /end ready-for-review
[reviewer]:     /review nextjs-init
   ↓ 6게이트 검사 → PASS
[head]: git merge --no-ff feat/frontend
[docs]:         /develop changelog-nextjs-init
   ↓ CHANGELOG.md + ROADMAP.md Phase 4 상태 갱신
[docs]:         /end
```

### 예시 2: Hero 섹션 구현 (단일 agent + 리뷰)

```
[head]: "Phase 5 Hero 구현 진행"
[frontend]:     /develop hero
   ↓ SPEC.md §1 Hero 사양 확인
   ↓ components/sections/Hero.tsx 작성 (try/catch/finally 시그니처 포함)
   ↓ /serve 로 로컬에서 시각 검증
[frontend]:     /end ready-for-review
[reviewer]:     /review hero
   ↓ Gate 1 (안티패턴): PASS
   ↓ Gate 2 (타입): PASS
   ↓ Gate 3 (접근성): FAIL — components/sections/Hero.tsx:24 alt 누락
   ↓ Gate 4~6: SKIPPED (이미 FAIL)
[frontend]:     # 수정 후
                /end ready-for-review
[reviewer]:     /review hero      # 재검사
   ↓ 6/6 PASS
[head]: git merge
[docs]:         /develop changelog-hero
```

### 예시 3: 방명록 (frontend + backend 동시 작업)

```
[head]: /develop guestbook
   ↓ SPEC.md §8 + API.md §1 확인
   ↓ 계획: frontend=UI, backend=API 분담
   ↓ STATUS.md에 두 작업 등록
   ↓ 안내: "frontend에서 /develop guestbook-ui, backend에서 /develop guestbook-api"

[frontend]:     /develop guestbook-ui    # 폼 + 표시 컴포넌트
[backend]:      /develop guestbook-api   # POST/GET endpoint + 보안

  ※ 두 agent가 같은 STATUS.md 보면서 동시 진행
  ※ types/index.ts 의 GuestbookEntry 타입은 head가 사전 정의 (contract-first)

[frontend]:     /end ready-for-review
[backend]:      /end ready-for-review
[reviewer]:     /review guestbook        # 두 브랜치 합쳐서 검사
[head]: git merge feat/frontend feat/backend
```

### 예시 4: 상태 모니터링

언제든 어느 윈도우든:
```
/status

# 출력 예:
📊 STATUS — 2026-05-25 10:30

| Agent          | Status              | Files                              | Note   |
|---             |---                  |---                                 |---     |
| head   | 🟢 idle             | —                                  |        |
| frontend       | 🔵 in_progress      | components/sections/Hero.tsx       | ~30min |
| backend        | 🟢 idle             | —                                  |        |
| infrastructure | 🟢 idle             | —                                  |        |
| reviewer       | 🟢 idle             | —                                  |        |
| documenter     | 🟢 idle             | —                                  |        |

다음 액션: frontend 완료 대기 중. reviewer는 /review 준비.
```

### 예시 5: 배포 (Phase 9)

```
[head]: "Phase 9 배포 시작"
[infra]:        /develop dockerfile
   ↓ DEPLOYMENT.md 따라 Dockerfile 작성
[infra]:        /develop docker-compose-entry
   ↓ 기존 docker-compose.yml에 portfolio service 추가
[infra]:        /build --docker
   ↓ 이미지 빌드 검증
[infra]:        /develop github-actions
   ↓ .github/workflows/deploy.yml 작성
[infra]:        /end ready-for-review
[reviewer]:     /review deployment
[head]: git merge feat/infra
[infra]:        /develop npm-proxy-host
   ↓ Nginx Proxy Manager UI 안내 (수동 입력)
[infra]:        /logs portfolio          # 배포 후 검증
```

---

## 🔧 운영 명령

### dev 서버
```
/serve              # 기본 :3000
/serve 3001         # 다른 포트
/serve --turbo      # Turbopack
```

### 로그
```
/logs               # 자동 감지 (dev 또는 docker)
/logs dev           # dev 서버만
/logs docker        # docker 컨테이너
/logs portfolio     # portfolio 컨테이너 (배포 후)
/logs --tail 50     # 마지막 50줄
```

### 빌드
```
/build              # pnpm build
/build --docker     # Docker 이미지까지
/build --analyze    # 번들 분석
```

---

## 🛡️ 충돌 방지 규칙 (`AGENTS.md` 요약)

| 규칙 | 의미 |
|---|---|
| **단일 파일 소유** | 한 파일은 한 agent만 쓴다. STATUS.md에 잠금 표시 |
| **공유 문서 read-only** | 병렬 중 DESIGN/CONTENT/CLAUDE/AGENTS는 변경 금지 |
| **STATUS.md 상시 동기화** | 작업 시작/끝/블록 시 자기 줄 갱신 |
| **타입 우선** | types/index.ts 인터페이스 먼저, 그 후 구현 |
| **머지는 head만** | 다른 agent는 push만, merge X |
| **DESIGN.md 가드레일** | 안티패턴 12개 절대 위반 금지 (reviewer 강제) |

---

## 📋 Development (코드 작업 직접 — Phase 4 후)

```bash
pnpm install
pnpm dev                          # 개발 서버
pnpm build                        # 프로덕션 빌드
pnpm typecheck                    # tsc --noEmit
pnpm lint                         # ESLint
```

---

## 🌐 Hosting

홈서버에서 호스팅. 두 도메인 동시 노출:
- `wnsdlr.com` (canonical)
- `leejunik.com` → wnsdlr.com 301 redirect

배포: Docker Compose + Nginx Proxy Manager (Let's Encrypt 자동).
상세는 [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 📜 License

본 저장소의 코드는 학습/참고 목적으로 공개되어 있으나, 콘텐츠(이력/프로젝트 설명/이미지)는 본인 소유.
