---
name: build
description: "Run production build (pnpm build). Optionally with type check or Docker image. Reports bundle size and errors. Usage: /build or /build --docker or /build --typecheck. Triggers: /build, production build, prod build, build app."
---

# /build — 프로덕션 빌드

본 skill은 portfolio 의 프로덕션 빌드를 실행하고 결과를 보고한다.

## 입력

- `/build` — 기본: `pnpm build`
- `/build --typecheck` — typecheck + build
- `/build --docker` — Docker 이미지까지 빌드
- `/build --analyze` — bundle 분석 (Next.js Bundle Analyzer)

## 동작

### 기본 빌드
```bash
pnpm build
```

출력 파싱:
- Build 시간
- 페이지별 크기 (Static / SSR / API)
- First Load JS
- 에러 / 경고

성공 시:
```
✅ Build 완료 (3.2s)
   Routes
   ┌ ○ /                       12.3 kB  142 kB First Load
   ├ ○ /sitemap.xml             0 B     0 B
   ├ ƒ /api/guestbook           0 B     0 B
   └ ƒ /api/og                  0 B     0 B

   First Load JS shared by all   78.4 kB

📊 성능 예산 체크 (ARCHITECTURE.md):
   ✅ Initial JS bundle < 100KB gzip
   ⚠️ First Load 142kB (목표 < 100kB) — 동적 import 검토 필요
```

실패 시 에러 그대로 + 위치 강조:
```
❌ Build 실패
   app/page.tsx:12 — Type error: ...
   
다음: 해당 agent (frontend 또는 backend) 윈도우에서 수정 후 다시 /build
```

### --typecheck 옵션
```bash
pnpm typecheck && pnpm build
```

먼저 타입 검사 통과 확인.

### --docker 옵션
```bash
pnpm build && docker build -t portfolio:dev .
```

Dockerfile 없으면 안내:
```
⚠️ Dockerfile 없음. DEPLOYMENT.md 따라서 작성 또는 infra 윈도우에서:
   /develop dockerfile
```

### --analyze 옵션
사전: `@next/bundle-analyzer` 설치 필요. 없으면 안내.

```bash
ANALYZE=true pnpm build
```

브라우저에서 자동 오픈은 X (CLI 환경). 결과 위치만 보고:
```
📊 Bundle 분석 완료
   .next/analyze/client.html — 브라우저로 열어서 확인
```

## 성능 예산 검사

ARCHITECTURE.md 의 성능 예산과 비교:

| 메트릭 | 예산 | 검사 방법 |
|---|---|---|
| Initial JS (gzip) | < 100KB | build 출력의 "First Load JS shared by all" |
| 페이지 weight | < 500KB | 페이지별 First Load |

초과 시 ⚠️ 표시 + 권고.

## 절대 금지

- 캐시 임의 삭제 (필요하면 사용자 확인)
- 빌드 실패를 PASS로 표시
- prod env 변수 (`ADMIN_TOKEN` 등)가 클라이언트 번들에 포함됐는지 누락 검사
