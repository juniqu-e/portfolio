---
name: logs
description: "Tail logs from dev server, Docker container, or specific service. Auto-detects what's running. Usage: /logs or /logs <target> where target is dev | docker | nginx | portfolio. Triggers: /logs, view logs, tail logs, check logs."
---

# /logs — 로그 조회

본 skill은 현재 실행 중인 서비스의 로그를 보여준다.

## 입력

- `/logs` — 자동 감지 (dev 서버 또는 docker)
- `/logs dev` — 개발 서버 로그
- `/logs docker [service]` — Docker 컨테이너 로그
- `/logs portfolio` — portfolio 컨테이너 로그 (배포 후)
- `/logs nginx` 또는 `/logs npm` — NPM 컨테이너 로그
- `/logs --tail 50` — 마지막 50줄만
- `/logs --since 10m` — 10분 전부터

## 자동 감지 로직

1. **dev 서버 실행 중?** (`/serve`로 띄운 백그라운드 프로세스 존재) → dev 로그
2. **Docker 컨테이너 실행 중?** (`docker ps` 확인) → 컨테이너 선택지 제시 또는 portfolio 자동 선택
3. **둘 다 없음** → 안내:
   ```
   ⚠️ 실행 중인 서비스 없음.
   /serve 로 dev 서버 띄우거나, deploy 후 /logs portfolio 사용
   ```

## 동작

### dev 서버 로그
백그라운드 bash_id 있으면 `BashOutput`으로 최근 출력 가져오기.
또는 `Monitor` 툴로 실시간 스트림.

### Docker 컨테이너 로그
```bash
docker compose logs -f --tail=${TAIL:-100} ${SERVICE:-portfolio}
```

또는 docker compose 없으면:
```bash
docker logs -f --tail=${TAIL:-100} ${CONTAINER}
```

`run_in_background: true` + `Monitor` 패턴.

### Nginx Proxy Manager
```bash
docker compose logs -f --tail=${TAIL:-100} npm-app   # NPM 컨테이너 이름은 환경마다 다름
```

## 필터링

자주 쓸 패턴:

| 필터 | 명령 |
|---|---|
| 에러만 | `docker compose logs portfolio 2>&1 \| grep -E "error\|Error\|ERROR"` |
| 404/500 | `docker compose logs portfolio \| grep -E " 4\\d\\d \| 5\\d\\d "` |
| 방명록 활동 | `docker compose logs portfolio \| grep "/api/guestbook"` |

사용자가 필터 명시 안 했어도, 처음 보는 거면 에러 우선 표시 제안.

## 출력 형식

타임스탬프 + 레벨 + 메시지로 정리:
```
📋 portfolio 로그 (마지막 30줄)

2026-05-24T22:30:01 [info]  ready in 1.2s on :3000
2026-05-24T22:30:15 [info]  GET / 200 in 42ms
2026-05-24T22:31:02 [warn]  /api/guestbook rate-limited 192.168.1.10
2026-05-24T22:31:30 [info]  POST /api/guestbook 201 in 89ms

▶ 실시간 스트림 중... (멈추려면 인터럽트)
```

## 절대 금지

- 시크릿/환경변수 출력 (NEXT_PUBLIC_ 아닌 것은 로그에서 마스킹)
- 사용자 정보 (IP raw 등) 그대로 노출 — 가능한 한 익명화
- 무한 스트림 (사용자 명시 확인 후만)
