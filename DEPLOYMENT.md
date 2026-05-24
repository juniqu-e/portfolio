# DEPLOYMENT.md — 배포 가이드

본 문서는 portfolio의 홈서버 배포 절차를 정의한다. infrastructure agent의 주요 참조 문서.

기존 홈서버 인프라(Docker Compose + Nginx Proxy Manager)에 portfolio를 통합하는 방향. 별도 reverse proxy 도입 X.

---

## 전제 (기존 홈서버 환경)

- OS: Linux (Ubuntu 추정)
- 컨테이너 런타임: Docker
- 오케스트레이션: Docker Compose
- 리버스 프록시 + HTTPS: **Nginx Proxy Manager (NPM)** — 기존에 작동 중
- HTTPS 인증서: Let's Encrypt (NPM이 자동 관리)
- DNS: wnsdlr.com / leejunik.com 둘 다 본 홈서버 IP 가리킴

---

## 배포 토폴로지

```
인터넷
  │
  ▼ :80 / :443
[NPM 컨테이너]  ← 기존
  │
  ├─ wnsdlr.com   → portfolio:3000 (예시 포트)
  └─ leejunik.com → portfolio:3000
       │
       ▼
[portfolio 컨테이너]  ← 새로 추가
  Next.js standalone 빌드
  port 3000 expose
  volume: portfolio-data:/data (SQLite)
```

---

## Docker 이미지 빌드

### Dockerfile (multi-stage)

```dockerfile
# ---- Stage 1: deps ----
FROM node:22-slim AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: builder ----
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- Stage 3: runner ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user (Debian-slim 계열: groupadd/useradd)
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

# Next.js standalone 출력 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# SQLite 디렉토리 (volume mount point)
RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs
EXPOSE 3000

# Node 22 글로벌 fetch 사용 — wget/curl 추가 설치 불필요
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
```

> **base image 선택 (Debian-slim vs Alpine)**: Alpine은 musl libc 기반이라
> Next.js / sharp / 일부 native module 호환성 이슈가 종종 보고됨. Debian-slim은
> 사이즈가 약 50MB 더 크지만(전체 ~293MB) 호환성이 검증된 길. healthcheck는
> Node.js 글로벌 fetch로 처리하여 wget/curl 추가 설치 불필요.

### 사전 요구: `next.config.ts`

```ts
const nextConfig = {
  output: "standalone", // Docker 배포 위해 필수
  // ... 기타
};
```

### 사전 요구: `/api/health` 엔드포인트

```ts
// app/api/health/route.ts
export async function GET() {
  return new Response("ok", { status: 200 });
}
```

---

## Docker Compose 통합

### `deploy/docker-compose.yml` (별도 파일)

`.env.example` 의 변수명(`ADMIN_TOKEN`, `IP_HASH_SALT` 등)을 그대로 사용하여 `env_file`로 일괄 주입한다. `PORTFOLIO_*` prefix 패턴은 폐기 — single-app 환경에서 불필요한 충돌 방지 레이어였음.

```yaml
# compose 프로젝트 이름 고정 — 디렉토리명에 의존하지 않게 함
name: portfolio

services:
  portfolio:
    image: ghcr.io/juniqu-e/portfolio:${PORTFOLIO_IMAGE_TAG:-latest}
    container_name: portfolio
    restart: unless-stopped

    # 모든 시크릿/설정은 같은 디렉토리의 `.env` 에서 주입 (이 파일에 평문 X)
    env_file:
      - .env

    # .env 와 무관하게 항상 고정되어야 하는 런타임 변수
    environment:
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0

    volumes:
      - portfolio-data:/data # DB_PATH=/data/guestbook.db 와 매칭

    expose:
      - "3000" # 외부 직접 노출 X. NPM 만 내부 네트워크로 접근.

    networks:
      - npm-network

    # 로그 회전 (호스트 디스크 보호)
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"

    # 컨테이너 리소스 가드
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 128M

volumes:
  portfolio-data:
    name: portfolio-data
    driver: local

networks:
  npm-network:
    external: true # NPM 이 사용하는 기존 네트워크
```

**환경변수 패턴**:

- 시크릿/배포별 값(`ADMIN_TOKEN`, `IP_HASH_SALT`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_SITE_URL`, `DB_PATH`, `RATE_LIMIT_*`)은 같은 디렉토리 `.env` (gitignore) — `env_file` 로 일괄 주입.
- 컨테이너 런타임 고정값(`NODE_ENV=production`, `PORT=3000`, `HOSTNAME=0.0.0.0`)은 `environment` 에 명시 — `.env` 가 잘못되어도 보장.
- 이미지 태그는 `PORTFOLIO_IMAGE_TAG` 환경변수로 override. 기본값 `latest`, 롤백 시 git SHA 지정: `PORTFOLIO_IMAGE_TAG=<sha> docker compose up -d portfolio`.

---

## Nginx Proxy Manager 설정

UI에서 수동 입력 (코드화 안 됨). 두 도메인 각각 proxy host 등록:

### Host 1: wnsdlr.com

| 필드                  | 값                                      |
| --------------------- | --------------------------------------- |
| Domain Names          | `wnsdlr.com`, `www.wnsdlr.com`          |
| Scheme                | `http`                                  |
| Forward Hostname / IP | `portfolio`                             |
| Forward Port          | `3000`                                  |
| Cache Assets          | ✅                                      |
| Block Common Exploits | ✅                                      |
| Websockets Support    | ✅                                      |
| SSL Certificate       | Request new (Let's Encrypt, auto-renew) |
| Force SSL             | ✅                                      |
| HTTP/2 Support        | ✅                                      |
| HSTS Enabled          | ✅                                      |

### Host 2: leejunik.com

동일 설정. Domain Names 만 `leejunik.com`, `www.leejunik.com` 으로.

### SEO 처리 (둘 다 같은 사이트 가리킴 → 중복 콘텐츠 페널티 회피)

- **Canonical URL**: 한 도메인을 정식으로. 다른 쪽은 canonical link로 정식 도메인을 가리킴
- **결정**: `wnsdlr.com`을 canonical로
- Next.js `metadataBase` 또는 `alternates.canonical` 사용
- 또는 NPM에서 `leejunik.com` → `wnsdlr.com` 으로 301 redirect (가장 단순)

**권장**: NPM에서 leejunik.com 을 301 redirect로 설정 (SEO 가장 깔끔).

NPM Redirect Host 추가:
| 필드 | 값 |
|---|---|
| Domain Names | `leejunik.com`, `www.leejunik.com` |
| Scheme | `https` |
| Forward Domain | `wnsdlr.com` |
| Preserve Path | ✅ |
| HTTP Code | `301` (Permanent) |
| SSL | Let's Encrypt |

---

## CI/CD — GitHub Actions

### `.github/workflows/ci.yml` — typecheck / lint / build matrix

PR + master push 시 매트릭스로 병렬 실행. 세 task 가 모두 PASS 해야 머지 가능.

```yaml
name: ci

on:
  push:
    branches: [master]
  pull_request:

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    name: ${{ matrix.task }} (Node ${{ matrix.node-version }})
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node-version: [22]
        task: [typecheck, lint, build]

    steps:
      - uses: actions/checkout@v4

      - name: Enable corepack + pin pnpm
        run: |
          corepack enable
          corepack prepare pnpm@9.15.0 --activate

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - if: matrix.task == 'typecheck'
        run: pnpm typecheck
      - if: matrix.task == 'lint'
        run: pnpm lint
      - if: matrix.task == 'build'
        env:
          NEXT_TELEMETRY_DISABLED: "1"
        run: pnpm build
```

### `.github/workflows/deploy.yml` — **미구현 (Phase 9 후속 작업)**

현재 배포는 [`deploy/DEPLOY_RUNBOOK.md`](./deploy/DEPLOY_RUNBOOK.md) 의 수동 절차로 진행. GHCR build/push + 홈서버 SSH 자동 배포 워크플로우는 첫 배포 후 안정화되면 추가 예정.

자동화 시 예상 구조:

```yaml
name: deploy
on:
  push:
    branches: [master]
  workflow_dispatch:

jobs:
  build-push:
    runs-on: ubuntu-latest
    needs: [check] # ci.yml matrix 모두 PASS 후
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/juniqu-e/portfolio:latest
            ghcr.io/juniqu-e/portfolio:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    runs-on: ubuntu-latest
    needs: [build-push]
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ~/homeserver/portfolio/deploy
            docker compose pull portfolio
            docker compose up -d portfolio
            docker image prune -f
```

**자동화 시 필요한 GitHub Secrets**:

- `SSH_HOST` — 홈서버 주소
- `SSH_USER` — SSH 사용자
- `SSH_KEY` — private key (배포용 별도 키 생성 권장)

---

## 백업

### SQLite 백업

cron으로 매일 1회:

```bash
# /etc/cron.daily/portfolio-backup
#!/bin/sh
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR=/home/zz262zz/backups/portfolio
mkdir -p "$BACKUP_DIR"

# SQLite는 .backup 명령으로 안전한 backup (트랜잭션 중에도 가능)
docker exec portfolio sqlite3 /data/guestbook.db ".backup /data/backup-${DATE}.db"
docker cp portfolio:/data/backup-${DATE}.db "$BACKUP_DIR/"
docker exec portfolio rm /data/backup-${DATE}.db

# 30일 보관
find "$BACKUP_DIR" -name "*.db" -mtime +30 -delete
```

### 시크릿 백업

- `.env` 파일은 1Password / Bitwarden 등에 따로 보관
- `IP_HASH_SALT` 변경 금지 (변경 시 기존 rate-limit 데이터 무효화)

---

## 모니터링

### 로그

```bash
docker compose logs -f portfolio       # 실시간
docker compose logs --tail=200 portfolio
```

향후 로그 수집은 Loki + Promtail 추가 가능. 1차에는 표준 docker 로그만.

### Uptime

- 외부: UptimeRobot 또는 자체 호스팅 Uptime Kuma
- 체크 URL: `https://wnsdlr.com/api/health`
- 알림: 이메일 또는 슬랙

### 에러 트래킹

- 1차 미도입. 필요 시 Sentry (`@sentry/nextjs`)

---

## 롤백 절차

### 옵션 1: 이전 이미지 태그로 복귀

```bash
cd ~/homeserver
# docker-compose.yml에서 image 태그를 이전 SHA로 변경
docker compose up -d portfolio
```

### 옵션 2: SQLite DB 복구

```bash
# 컨테이너 정지
docker compose stop portfolio

# 백업에서 복사
cp /home/zz262zz/backups/portfolio/backup-YYYYMMDD-HHMMSS.db \
   /var/lib/docker/volumes/portfolio-data/_data/guestbook.db

# 재시작
docker compose up -d portfolio
```

---

## 최초 배포 체크리스트

infrastructure agent가 Phase 9 시작 시 확인:

```
[ ] DNS A 레코드: wnsdlr.com, leejunik.com 모두 홈서버 IP 가리킴
[ ] NPM에 두 도메인 모두 등록 + Let's Encrypt 발급
[ ] leejunik.com은 wnsdlr.com 으로 301 redirect 설정
[ ] docker-compose.yml에 portfolio service 추가
[ ] .env에 ADMIN_TOKEN, IP_HASH_SALT, GA_ID 설정 (랜덤 생성)
[ ] portfolio-data volume 생성
[ ] GitHub Secrets 설정 (SSH_HOST, SSH_USER, SSH_KEY)
[ ] GHCR repo 권한 (juniqu-e/portfolio 패키지 visibility)
[ ] 첫 빌드 + push + deploy 검증
[ ] /api/health 200 응답 확인
[ ] 두 도메인 모두 정상 접속 확인 (HTTPS)
[ ] 방명록 POST/GET 동작 확인
[ ] 백업 cron 등록 + 첫 백업 실행 확인
[ ] Uptime 모니터 등록
```

---

## 보안 강화 (배포 후)

- [ ] SSH는 키 기반만, password 인증 비활성
- [ ] Fail2ban 활성화 (SSH + NPM)
- [ ] UFW 등으로 포트 화이트리스트 (22, 80, 443만)
- [ ] Docker 데몬은 root, 컨테이너는 non-root user (Dockerfile 준수)
- [ ] 정기 보안 업데이트 (`apt update && upgrade`)
- [ ] NPM 관리자 비밀번호 충분히 강력
- [ ] GitHub PAT 만료일 설정 (현재 classic PAT 사용 중)

---

## 향후 확장

- **K8s 이전** (학습 목적): portfolio를 minikube/k3s로 옮겨 보면 DevFlow Harness 학습 도움
- **CI cache 최적화**: Buildx + remote cache
- **CDN**: Cloudflare 앞단 (선택, 비용 0)
- **편의 도구**: portainer 추가 (Docker UI)
