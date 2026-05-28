# DEPLOY_RUNBOOK.md — 홈서버 운영 가이드

본 런북은 portfolio 의 홈서버 운영 절차를 캡처한다. Phase 9 (초기 배포) ~ Phase 13 (CI/CD 자동화) 까지의 모든 시나리오 포함.

**현재 상태 (Phase 13 시점)**:

- ✅ wnsdlr.com / leejunik.com (+ www 4 도메인) 라이브
- ✅ CI/CD 자동 배포 가동 — `git push master` → GitHub Actions (`deploy.yml`) → GHCR push → Watchtower pull/recreate
- ✅ 컨테이너 healthy (Phase 10 `/api/health` 추가 이후)
- ✅ Cloudflare Tunnel → NPM → portfolio:3000 토폴로지 안정

**파일 자산**:

- `Dockerfile` — multi-stage, 295MB, non-root, Node fetch healthcheck
- `deploy/docker-compose.yml` — portfolio service + Watchtower label
- `deploy/watchtower.compose.yml` — 자동 배포 데몬 (Phase 13 신규)
- `.github/workflows/ci.yml` — typecheck/lint/build matrix (PR + master)
- `.github/workflows/deploy.yml` — GHCR build & push (master 만, Phase 13 신규)
- `deploy/nginx-proxy-manager/notes.md` — NPM Proxy Host 설정 노트

---

## 1단계 — DNS 사전 확인 (사용자)

도메인 등록기(예: 가비아 / Namecheap) 관리 페이지에서:

```bash
# 확인 명령 (로컬 또는 외부)
dig +short wnsdlr.com
dig +short www.wnsdlr.com
dig +short leejunik.com
dig +short www.leejunik.com
```

- 4 도메인 모두 **홈서버 공인 IP**를 가리켜야 함
- TTL은 짧을수록 좋음 (300s 권장, 변경 시 빠른 전파)
- DNS 전파에 길게는 24h 소요 가능 — 배포 직전엔 미리 설정해 둘 것

---

## 2단계 — 홈서버에 시크릿 생성 + `.env` 작성

홈서버 SSH 접속 후:

```bash
# 1) 코드 위치 (master 브랜치 최신 pull 되어 있어야 함)
cd ~/homeserver/portfolio

# 2) 시크릿 2개 생성 (각각 64자 hex)
ADMIN_TOKEN=$(openssl rand -hex 32)
IP_HASH_SALT=$(openssl rand -hex 32)
echo "ADMIN_TOKEN=$ADMIN_TOKEN"
echo "IP_HASH_SALT=$IP_HASH_SALT"
# → 1Password / Bitwarden 등 시크릿 매니저에 즉시 백업

# 3) compose 가 있는 위치에 .env 작성
#    (compose 가 deploy/ 안에 있으므로 deploy/.env 가 맞음)
cd deploy
cp ../.env.example .env
# 에디터로 .env 열어서:
#   ADMIN_TOKEN=<위에서 생성한 값>
#   IP_HASH_SALT=<위에서 생성한 값>
#   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   (GA4 측정 ID, 없으면 비워둠)
#   NEXT_PUBLIC_SITE_URL=https://wnsdlr.com
#   DB_PATH=/data/guestbook.db
#   RATE_LIMIT_WINDOW_MS=300000
#   RATE_LIMIT_MAX_REQUESTS=1

chmod 600 .env   # 읽기 권한 본인만
```

**⚠️ 절대 `.env` 커밋 금지** — `.gitignore` 가 막아 두었으나 검증:

```bash
git check-ignore deploy/.env  # → deploy/.env 출력되면 OK
```

**⚠️ `IP_HASH_SALT` 한번 정하면 변경 금지** — 변경 시 기존 방명록의 IP 해시 매칭 불가.

---

## 3단계 — NPM 외부 네트워크 확인

`docker-compose.yml` 이 `npm-network` (external) 에 attach. NPM 컨테이너가 사용하는 네트워크 이름이 같아야 함.

```bash
# 현재 존재하는 docker network 목록
docker network ls

# NPM 컨테이너가 어느 네트워크에 attach 되어 있는지 확인
docker inspect <npm-container-name> --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}'
```

**케이스 A**: 이미 `npm-network` 라는 이름이 있음 → 그대로 진행
**케이스 B**: 다른 이름(예: `nginx-proxy-manager_default`) → `deploy/docker-compose.yml` 의 `networks` 섹션 `name:` 줄 주석 해제하고 실제 이름으로 지정:

```yaml
networks:
  npm-network:
    external: true
    name: nginx-proxy-manager_default # ← 실제 이름
```

**케이스 C**: 네트워크 자체가 없음 (NPM이 default bridge 만 쓰는 경우) → 새로 만들고 NPM 컨테이너를 attach:

```bash
docker network create npm-network
docker network connect npm-network <npm-container-name>
```

---

## 4단계 — GHCR 이미지 인증

CI 가 `ghcr.io/juniqu-e/portfolio` 에 이미지를 push 할 수 있어야 하고, 홈서버는 pull 할 수 있어야 함.

### 4-1. GitHub Repo Secrets (사용자가 GitHub 웹에서)

`Settings > Secrets and variables > Actions > New repository secret`:

| 이름 | 값 |
|---|---|
| `SSH_HOST` | 홈서버 공인 IP 또는 도메인 |
| `SSH_USER` | 홈서버 SSH 계정 (예: `zz262zz`) |
| `SSH_KEY` | private key 전체 (배포용 별도 키 권장 — 아래) |

배포용 SSH 키 새로 만드는 게 안전:

```bash
# 로컬에서:
ssh-keygen -t ed25519 -C "github-deploy@wnsdlr" -f ~/.ssh/portfolio-deploy
# 공개키를 홈서버 ~/.ssh/authorized_keys 에 추가
cat ~/.ssh/portfolio-deploy.pub | ssh user@homeserver 'cat >> ~/.ssh/authorized_keys'
# private key (~/.ssh/portfolio-deploy) 내용을 GitHub Secrets SSH_KEY 로
```

### 4-2. 홈서버 GHCR 로그인

GHCR 패키지가 public 이면 생략 가능. private 이면:

```bash
# 홈서버에서:
echo "<GITHUB_PAT_with_read:packages>" | docker login ghcr.io -u juniqu-e --password-stdin
```

(현재 `deploy.yml` 워크플로우는 별도 추가 안 됨 — 이번 dispatch 범위 밖. 1차 배포는 **수동 pull**로 진행해도 무관.)

---

## 5단계 — 첫 배포 (수동)

> 정상 운영 중인 환경이면 **이 단계는 한 번만 수행**하면 된다. 이후 변경은 [정상 흐름 — 자동 배포 (Phase 13+)](#정상-흐름--자동-배포-phase-13) 섹션을 따른다.

```bash
# 홈서버:
cd ~/homeserver/portfolio/deploy

# 5-1. 이미지 pull (CI 가 GHCR 에 push 된 후)
docker compose pull portfolio
# CI 미세팅 단계라면, 홈서버에서 직접 build 도 가능:
#   docker compose -f docker-compose.yml -f docker-compose.dev.yml build
#   (dev override 파일은 아직 없음 — 1차에는 build 명령 별도)
# 또는 단순:
#   cd ~/homeserver/portfolio && docker build -t ghcr.io/juniqu-e/portfolio:latest .

# 5-2. 컨테이너 기동
docker compose up -d portfolio

# 5-3. 상태 확인
docker compose ps
docker compose logs -f portfolio
# Ctrl+C 로 로그 빠져나오기

# 5-4. NPM 네트워크 내부 health check
docker exec <npm-container> wget -qO- http://portfolio:3000/
# → HTML 일부 출력되면 OK
```

---

## 정상 흐름 — 자동 배포 (Phase 13+)

Watchtower 부트스트랩을 1회 마치면, 이후 변경은 사용자 액션 없이 자동.

```
사용자: git push origin master
   │
   ▼
GitHub Actions (.github/workflows/deploy.yml)
   1) docker build (Buildx, gha cache, 1~2분)
   2) docker push:
       - ghcr.io/juniqu-e/portfolio:latest
       - ghcr.io/juniqu-e/portfolio:<short-sha>
   │
   ▼
GHCR 새 digest 생성 (즉시)
   │
   ▼ (최대 5분 폴링 지연)
Watchtower (홈서버 컨테이너)
   - :latest digest 변경 감지
   - docker pull ghcr.io/juniqu-e/portfolio:latest
   - portfolio 컨테이너 stop + recreate (compose 라벨 + env 유지)
   - 이전 이미지 prune (CLEANUP=true)
   │
   ▼
새 버전 라이브 (총 소요: push 후 ~5-7분)
```

**관찰**:

```bash
# GitHub Actions 진행 확인 (브라우저)
#   https://github.com/juniqu-e/portfolio/actions

# 홈서버에서 Watchtower 로그 — 폴링 + pull/recreate 이벤트
docker compose -f ~/homeserver/portfolio/deploy/watchtower.compose.yml \
  logs -f watchtower

# portfolio 컨테이너 재기동 시각 확인
docker inspect portfolio --format '{{.State.StartedAt}}'

# 현재 라이브 이미지 digest
docker inspect portfolio --format '{{.Image}}'
docker image inspect ghcr.io/juniqu-e/portfolio:latest --format '{{.RepoDigests}}'
```

**즉시 배포가 필요한 경우** (Watchtower 5분 대기 회피):

```bash
# 홈서버에서 즉시 pull/recreate
cd ~/homeserver/portfolio/deploy
docker compose pull portfolio && docker compose up -d portfolio
```

---

## Watchtower 부트스트랩 (Phase 13 — 1회만)

자동 배포를 처음 활성화할 때 사용자가 1회 수행.

```bash
# 0) 사전조건: deploy/.env 가 이미 준비되어 있어야 함 (2단계 완료 상태)
cd ~/homeserver/portfolio/deploy

# 1) 알림 사용할 경우 .env 에 추가 (선택). 안 쓰면 건너뜀.
#    shoutrrr URL: https://containrrr.dev/shoutrrr/
#    예시) Discord 웹훅:
#      WATCHTOWER_NOTIFICATION_URL=discord://<token>@<webhook_id>
#    예시) Slack:
#      WATCHTOWER_NOTIFICATION_URL=slack://<bot-name>@<webhook-token>/<channel>

# 2) Watchtower 컨테이너 기동
docker compose -f watchtower.compose.yml up -d

# 3) 정상 기동 확인 — "Starting Watchtower" + interval/label-enable 메시지
docker compose -f watchtower.compose.yml logs --tail=30 watchtower

# 4) 감시 대상 컨테이너 1개 (portfolio) 가 잡혔는지 확인
#    로그에 "Checking all containers (except explicitly disabled with label)" 또는
#    label-enable 모드: "Only checking containers which have a `..watchtower.enable` label"
#    그리고 "Found 1 enabled containers" 같은 라인.

# 5) 첫 폴링 검증 (5분 대기 또는 강제 트리거)
#    Watchtower 컨테이너 재시작하면 즉시 1회 폴링부터 다시 시작:
docker compose -f watchtower.compose.yml restart watchtower
docker compose -f watchtower.compose.yml logs -f watchtower
# → "Session done" 로그가 정상 (변경 없으면 "No updates")
```

**1회 부트스트랩 이후**: `git push master` 만으로 자동 배포 작동. 사용자 추가 액션 없음.

**중단/재개**:

```bash
# 자동 배포 일시 정지 (이미지 push 는 계속 일어나도 홈서버는 동결)
docker compose -f watchtower.compose.yml stop watchtower

# 재개
docker compose -f watchtower.compose.yml start watchtower

# 완전 제거
docker compose -f watchtower.compose.yml down
```

---

## 6단계 — NPM Proxy Host 등록

전체 절차는 [nginx-proxy-manager/notes.md](./nginx-proxy-manager/notes.md) 참조.

**요약**:

1. NPM Dashboard → **Hosts > Proxy Hosts > Add Proxy Host**
2. `wnsdlr.com` + `www.wnsdlr.com` → `http://portfolio:3000`
3. SSL 탭: **Request new SSL** + Force SSL + HSTS
4. **Hosts > Redirection Hosts**: `leejunik.com` + `www.leejunik.com` → `https://wnsdlr.com` (301, preserve path)

---

## 7단계 — 외부 검증 (C 단계)

```bash
# 7-1. 메인 도메인 200 + HTTPS
curl -I https://wnsdlr.com
# HTTP/2 200, strict-transport-security 존재

# 7-2. www subdomain
curl -I https://www.wnsdlr.com

# 7-3. leejunik 301 → wnsdlr
curl -I https://leejunik.com
# HTTP/2 301, location: https://wnsdlr.com/

# 7-4. path preserve
curl -I https://leejunik.com/projects
# location: https://wnsdlr.com/projects

# 7-5. http→https 강제
curl -I http://wnsdlr.com

# 7-6. SEO 자산
curl https://wnsdlr.com/robots.txt
curl https://wnsdlr.com/sitemap.xml
curl -I https://wnsdlr.com/opengraph-image  # image/png

# 7-7. 모바일 viewport 확인 (브라우저 또는):
curl -s https://wnsdlr.com | grep -i 'name="viewport"'
```

### Lighthouse (브라우저 또는 CLI)

Chrome DevTools > Lighthouse 또는:

```bash
# 로컬에 lighthouse 설치되어 있으면
npx lighthouse https://wnsdlr.com --view --preset=desktop
npx lighthouse https://wnsdlr.com --view --preset=mobile
```

**목표** (DESIGN/ARCH 명시):

- Performance ≥ 90 (LCP < 1.5s, INP < 200ms, CLS < 0.05)
- Accessibility ≥ 95 (WCAG 2.2 AA)
- Best Practices ≥ 95
- SEO ≥ 95 (sitemap/robots/OG/meta 모두 정합)

### SSL 등급 (외부)

[ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/analyze.html?d=wnsdlr.com) → **A+ 목표**.

NPM 의 Force SSL + HTTP/2 + HSTS + LE 자동 갱신이 활성화되어 있으면 통상 A 또는 A+.

---

## 8단계 — SNS Preview 검증

OG 이미지 노출 확인:

- **Slack**: 채널에 `https://wnsdlr.com` 붙여 보기 — 카드 미리보기 + 1200×630 PNG
- **Twitter/X**: Card Validator → [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
- **카카오톡**: 채팅창에 링크 붙여 — `Cache Clear` 는 [developers.kakao.com/tool/clear/og](https://developers.kakao.com/tool/clear/og)
- **Facebook Sharing Debugger**: [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)

---

## 9단계 — 백업 / 모니터링 (선택, Phase 9 후반)

### SQLite 백업 cron (방명록 도입 후 — Phase 6+ backend)

```bash
sudo tee /etc/cron.daily/portfolio-backup <<'EOF'
#!/bin/sh
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR=/home/zz262zz/backups/portfolio
mkdir -p "$BACKUP_DIR"
docker exec portfolio sqlite3 /data/guestbook.db ".backup /data/backup-${DATE}.db"
docker cp portfolio:/data/backup-${DATE}.db "$BACKUP_DIR/"
docker exec portfolio rm /data/backup-${DATE}.db
find "$BACKUP_DIR" -name "*.db" -mtime +30 -delete
EOF
sudo chmod +x /etc/cron.daily/portfolio-backup
```

### Uptime 모니터링

- 외부 무료: [UptimeRobot](https://uptimerobot.com) 5분 간격 GET `https://wnsdlr.com` (또는 `/api/health` 가 생기면 그쪽으로)
- 자체 호스팅: Uptime Kuma 컨테이너 — 홈서버 같은 docker-compose 에 추가 가능

---

## 롤백 절차

### 이미지 태그 되돌리기 (자동 배포 환경)

`.github/workflows/deploy.yml` 이 매 푸시마다 `:latest` + `:<short-sha>` 두 태그를 GHCR 에 보관. 롤백은 `.env` 에 SHA 박는 것으로 충분 — Watchtower 는 SHA 태그의 digest 만 추종하므로 자동 갱신이 멈춘다.

```bash
cd ~/homeserver/portfolio/deploy

# 1) 되돌릴 SHA 확인 (GHCR UI 또는 git log)
git log --oneline -10

# 2) .env 에 한 줄 추가/수정
echo "PORTFOLIO_IMAGE_TAG=<old-short-sha>" >> .env
# (이미 있다면 vi/nano 로 값 교체)

# 3) recreate
docker compose up -d portfolio
docker compose logs -f portfolio  # 정상 기동 확인

# 4) 검증 후 정상 흐름 복구 — .env 에서 해당 줄 제거하면 다시 :latest 추종
```

### 자동 배포 자체를 즉시 멈추기

배포가 진행 중인데 GHA 가 push 못 하게 막거나 (이미 push 된 상태라면) Watchtower 가 가져가지 못하게 동결:

```bash
# 옵션 A: Watchtower 정지 (이미지 push 는 계속, 홈서버만 동결)
docker compose -f ~/homeserver/portfolio/deploy/watchtower.compose.yml stop watchtower

# 옵션 B: GitHub Actions 비활성 (Repo > Actions > Disable workflows)
#         또는 deploy.yml 파일을 revert
```

### SQLite DB 복원 (방명록 도입 후)

```bash
docker compose stop portfolio
sudo cp /home/zz262zz/backups/portfolio/backup-YYYYMMDD-HHMMSS.db \
        /var/lib/docker/volumes/portfolio-data/_data/guestbook.db
sudo chown 1001:1001 /var/lib/docker/volumes/portfolio-data/_data/guestbook.db
docker compose up -d portfolio
```

---

## 트러블슈팅

| 증상 | 원인/처방 |
|---|---|
| NPM 에서 502 Bad Gateway | NPM 컨테이너와 portfolio 컨테이너가 같은 네트워크에 없음. 3단계 확인 |
| `pull access denied` (GHCR) | GHCR 패키지 visibility private + 홈서버 미로그인. 4-2 단계 |
| LE 인증서 발급 실패 | 80 포트가 외부 노출되어 있어야 HTTP-01 challenge 가능. 방화벽 확인 |
| 컨테이너 unhealthy (Phase 6 전) | `/api/health` 미구현으로 의도된 동작. 트래픽엔 영향 없음 |
| `docker compose up` 시 env not found | `.env` 파일이 `deploy/` 에 있어야 함 (compose 와 같은 위치) |
| 페이지 한글이 깨짐 | Next.js 가 next/font 로 Pretendard 로드 — 정상. 클라이언트 캐시 무효화 시도 |
| OG 이미지가 캐시된 옛 버전으로 노출 | SNS 캐시. Facebook Debugger / 카카오 OG Cache Clear 로 강제 갱신 |
| push 후 5 분 지나도 라이브 반영 안 됨 | ① GitHub Actions `deploy` 워크플로우 PASS 여부 확인 ② `docker compose -f watchtower.compose.yml logs --tail=50 watchtower` — "Found new image" 메시지 / `denied` 또는 `unauthorized` 시 GHCR private 여부 + Watchtower 인증 점검 |
| Watchtower 가 portfolio 를 안 잡음 | `docker inspect portfolio --format '{{.Config.Labels}}'` → `com.centurylinklabs.watchtower.enable:true` 확인. 누락 시 compose 재배포 (`docker compose up -d portfolio`) |
| `.env` 에 `PORTFOLIO_IMAGE_TAG=<sha>` 박혀 있어 자동 배포가 안 되는 듯 | 의도된 동작. 롤백 모드 해제하려면 .env 에서 해당 줄 삭제 후 `docker compose up -d portfolio` |
| GHCR private 으로 전환된 후 Watchtower 가 `pull access denied` | `WATCHTOWER_REPO_USER` / `WATCHTOWER_REPO_PASS` env 추가 (GitHub PAT with `read:packages`). 또는 호스트에 `docker login ghcr.io` 한 뒤 `~/.docker/config.json` 을 Watchtower 컨테이너에 마운트 |

---

## Definition of Done — Phase 9

이번 dispatch 의 검증 대상 항목 모두 통과해야 Phase 9 ✅:

- [ ] 1단계 DNS 4 도메인 모두 홈서버 IP 응답
- [ ] 2단계 `.env` 생성 + chmod 600 + git ignore 확인
- [ ] 3단계 `npm-network` 정합
- [ ] 5단계 `docker compose up -d portfolio` 정상 기동
- [ ] 6단계 NPM Proxy Host 2개 + Redirect Host 2개 등록
- [ ] 7-1\~7-7 외부 curl 검증 모두 통과
- [ ] Lighthouse Performance ≥ 90 / Accessibility ≥ 95 / SEO ≥ 95
- [ ] SSL Labs A 이상
- [ ] 8단계 OG preview 1개 이상 확인 (Slack 가장 빠름)

모두 통과 시 STATUS.md `[infrastructure]` ready-for-review → head 머지 → ROADMAP Phase 9 ✅.
