# =============================================================================
# portfolio — Production Dockerfile (multi-stage)
# =============================================================================
#
# 산출물: Next.js standalone 빌드 + non-root 런타임 + node fetch healthcheck
#
# Prerequisites:
#   - next.config.ts 에 `output: 'standalone'` 설정되어 있어야 함
#   - app/api/health/route.ts 가 200 응답해야 함 (Phase 6 backend 작업)
#
# Build:
#   docker build -t portfolio:dev .
#
# Run (스탠드얼론 테스트, NPM 없이):
#   docker run --rm -p 3000:3000 -v portfolio-data:/data \
#     --env-file .env.local portfolio:dev
# =============================================================================


# ---- Stage 1: deps -----------------------------------------------------------
# 모든 의존성 (dev 포함) 설치. builder 에서만 사용되는 일회용 stage.
FROM node:22-slim AS deps
WORKDIR /app

# corepack 으로 pnpm 활성화 (package.json `packageManager` 미정 → 명시 핀)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Lockfile + manifest 만 먼저 복사 → 의존성 layer 캐싱
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# frozen-lockfile 로 재현 가능한 설치
RUN pnpm install --frozen-lockfile


# ---- Stage 2: builder --------------------------------------------------------
# 전체 소스 복사 + Next.js standalone 빌드
FROM node:22-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 텔레메트리 비활성 (빌드 시 외부 핑 차단)
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build


# ---- Stage 3: runner ---------------------------------------------------------
# 런타임에 필요한 산출물만 포함. node_modules 전체 X (standalone 이 필요한 것만 번들).
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# non-root 유저 생성 (Debian-slim 계열)
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

# Next.js standalone 출력 — server.js 와 최소 node_modules 포함
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# SQLite 영속 디렉토리 (docker-compose volume mount point)
RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs
EXPOSE 3000

# /api/health 로 헬스체크 (Phase 6 backend 에서 추가 예정).
# Node 22 글로벌 fetch 사용 — wget/curl 추가 설치 불필요.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
