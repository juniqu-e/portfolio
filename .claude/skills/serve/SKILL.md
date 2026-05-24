---
name: serve
description: "Start the Next.js dev server (pnpm dev) and stream logs. Optionally pass port. Auto-detects whether to use background mode. Usage: /serve or /serve <port>. Triggers: /serve, start server, dev server, run dev."
---

# /serve — 개발 서버 실행

본 skill은 portfolio 의 Next.js 개발 서버를 띄우고 로그를 보여준다.

## 사전 검증

1. `package.json` 존재 확인 (Next.js 프로젝트 초기화 완료)
2. `node_modules/` 존재 확인 — 없으면 먼저 `pnpm install` 실행 권고
3. 이미 3000 포트가 사용 중인지 확인 (`lsof -i:3000` 또는 동일)

## 입력

- `/serve` — 기본 포트 3000
- `/serve 3001` — 명시 포트
- `/serve --turbo` — Turbopack 사용 (`pnpm dev --turbo`)

## 동작

### 1. 사전 체크
```bash
[ -f package.json ] && cat package.json | grep -q '"dev"' || \
  echo "❌ package.json 또는 dev 스크립트 없음. Phase 4 (Next.js 초기화)부터 진행 필요"

[ -d node_modules ] || pnpm install
```

### 2. 포트 충돌 검사
```bash
lsof -i:${PORT:-3000} 2>/dev/null && \
  echo "⚠️ 포트 ${PORT:-3000} 사용 중. 다른 포트 사용 또는 기존 프로세스 종료" && exit 1
```

### 3. 서버 실행 (백그라운드)

`run_in_background: true` 로 Bash 실행:
```bash
PORT=${PORT:-3000} pnpm dev
```

또는 turbopack:
```bash
PORT=${PORT:-3000} pnpm dev --turbo
```

bash_id 기록.

### 4. 부팅 대기

`Monitor` 툴로 stdout 스트림 감시. "Ready in", "Local:", "started server" 같은 패턴 감지될 때까지.

타임아웃: 60초.

### 5. 사용자에게 보고

```
✅ Dev server 실행 중
   URL: http://localhost:${PORT}
   bash_id: <id> (로그 보려면 /logs)
   
빠른 검증:
   curl -s http://localhost:${PORT}/api/health || echo "health endpoint 없음"
```

### 6. 종료 안내

```
종료하려면 다른 명령어에서: kill <bash_id>
또는 Ctrl+C
```

## 사용 예시

frontend 또는 orchestrator 윈도우에서:
```
/serve
# 또는
/serve 3001
```

## 절대 금지

- production 빌드 실행 (그건 `/build` 사용)
- 같은 포트로 중복 실행
- 사용자 확인 없이 기존 프로세스 kill
- 종료할 때 docker container 같이 멈추기 (분리된 영역)
