# Nginx Proxy Manager — 설정 노트

본 디렉토리는 **코드 산출물이 아닌 참고 문서**다. NPM은 GUI 입력 기반이라 IaC 되지 않으므로, 본 문서로 설정 절차를 캡처해 둔다.

배포 시점: Phase 9. infrastructure agent + 사용자가 NPM UI에 직접 입력.

원본 정의: [DEPLOYMENT.md § Nginx Proxy Manager 설정](../../DEPLOYMENT.md#nginx-proxy-manager-설정) — 본 노트는 운영 체크리스트 위주.

---

## 사전 조건

- [ ] DNS A 레코드: `wnsdlr.com`, `www.wnsdlr.com`, `leejunik.com`, `www.leejunik.com` 모두 홈서버 공인 IP를 가리킴
- [ ] DNS 전파 확인: `dig +short wnsdlr.com` 결과가 본인 IP
- [ ] NPM 컨테이너 가동 중, 80/443 포트 호스트 바인딩 정상
- [ ] portfolio 컨테이너가 `npm-network` 에 attach 되어 NPM에서 `portfolio:3000` 으로 접근 가능
  ```bash
  docker exec <npm-container> wget -qO- http://portfolio:3000/api/health
  # → "ok"
  ```

---

## Host 1: `wnsdlr.com` (메인, canonical)

NPM UI → **Hosts > Proxy Hosts > Add Proxy Host**

### Details 탭

| 필드                  | 값                                   |
| --------------------- | ------------------------------------ |
| Domain Names          | `wnsdlr.com`, `www.wnsdlr.com`       |
| Scheme                | `http`                               |
| Forward Hostname / IP | `portfolio` (compose service name)   |
| Forward Port          | `3000`                               |
| Cache Assets          | ✅                                   |
| Block Common Exploits | ✅                                   |
| Websockets Support    | ✅ (Next.js HMR/Server Actions 대비) |
| Access List           | Publicly Accessible                  |

### SSL 탭

| 필드              | 값                                                |
| ----------------- | ------------------------------------------------- |
| SSL Certificate   | **Request a new SSL Certificate** (Let's Encrypt) |
| Force SSL         | ✅                                                |
| HTTP/2 Support    | ✅                                                |
| HSTS Enabled      | ✅                                                |
| HSTS Subdomains   | ✅ (www.wnsdlr.com 도 포함되므로)                 |
| Email             | 본인 이메일 (Let's Encrypt 알림용)                |
| I Agree to LE ToS | ✅                                                |

### Advanced 탭 (선택)

필요 시 보안 헤더 추가:

```nginx
# 보안 헤더 강화 (Next.js Middleware 가 처리하지 않는 케이스용)
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# 정적 자산 캐싱 (Next.js /_next/static 은 immutable hash 라 길게)
location /_next/static/ {
    proxy_pass http://portfolio:3000;
    proxy_cache_valid 200 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

---

## Host 2: `leejunik.com` (301 redirect → wnsdlr.com)

**SEO 정합성**: 두 도메인이 같은 사이트를 가리키면 중복 콘텐츠 패널티. canonical 한 곳(`wnsdlr.com`)으로 영구 리다이렉트하는 것이 가장 깔끔.

NPM UI → **Hosts > Redirection Hosts > Add Redirection Host**

| 필드           | 값                                      |
| -------------- | --------------------------------------- |
| Domain Names   | `leejunik.com`, `www.leejunik.com`      |
| Scheme         | `https`                                 |
| Forward Domain | `wnsdlr.com`                            |
| Forward Scheme | `https`                                 |
| Preserve Path  | ✅ (요청한 path 그대로 wnsdlr.com 으로) |
| HTTP Code      | `301 Moved Permanently`                 |

### SSL 탭

`wnsdlr.com` 과 동일 — Let's Encrypt 신규 발급 (`leejunik.com`, `www.leejunik.com` 둘 다 SAN).

---

## 검증 절차

배포 후 다음 항목 통과 확인:

```bash
# 1. wnsdlr.com 정상 (200 + HTTPS)
curl -I https://wnsdlr.com
# HTTP/2 200, strict-transport-security 헤더 존재

# 2. www → apex 정상 처리 (NPM은 둘 다 같은 host로 묶여 동작)
curl -I https://www.wnsdlr.com

# 3. leejunik.com → wnsdlr.com 301
curl -I https://leejunik.com
# HTTP/2 301, location: https://wnsdlr.com/

# 4. path preserve 확인
curl -I https://leejunik.com/guestbook
# location: https://wnsdlr.com/guestbook

# 5. http → https 강제
curl -I http://wnsdlr.com
# HTTP/1.1 301 → https://wnsdlr.com

# 6. 헬스체크 (NPM 통과 후 컨테이너까지)
curl https://wnsdlr.com/api/health
# ok

# 7. SSL 등급 (외부)
# https://www.ssllabs.com/ssltest/analyze.html?d=wnsdlr.com → A+ 목표
```

---

## 운영 메모

- **Let's Encrypt 갱신**: NPM이 자동 (60일 주기). NPM Dashboard > SSL Certificates 에서 만료일 모니터링.
- **NPM 자체 백업**: NPM 데이터(`/data/letsencrypt`, `/data/nginx`) 도 호스트 백업 대상에 포함시킬 것.
- **로그 조회**: NPM Dashboard > Logs 에서 호스트별 access/error log 실시간 확인 가능.
- **변경 적용**: UI Save 시 NPM이 nginx reload — 무중단. 다만 SSL 발급 첫 회는 HTTP-01 challenge 위해 80 포트 외부 노출이 반드시 필요.

---

## 향후 옵션

- Cloudflare 앞단에 두면: NPM SSL은 Origin Certificate 모드로 전환 가능 (Let's Encrypt 생략)
- Fail2ban + NPM 연동: 무차별 시도 차단 — `/data/logs` 의 access.log 파싱
- 별도 staging 호스트: `staging.wnsdlr.com` → portfolio:3001 (다른 태그 이미지 띄울 때)
