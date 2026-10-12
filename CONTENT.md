# Portfolio Content

본 문서는 wnsdlr.com 포트폴리오에 들어갈 콘텐츠 원본이다. 실제 컴포넌트는 이 콘텐츠를 참조하여 빌드한다.

**2026-10-12 전면 개편 — 인프라 엔지니어(서버·클라우드) 포지셔닝.** 소스: Obsidian 볼트 `30-Output/취업 - 인프라 SI/` (이력서·포트폴리오 마스터, 자기소개서 §0 데이터 팩트, 03 면접 기술 스택 표) + `20-Wiki/Projects/` (홈서버 인프라, CCNA 문제은행, AI 지식관리 워크스테이션, 홈 인프라 구성). 원칙: **측정한 숫자만 쓴다 · 근거 없는 기술은 적지 않는다 · 구축/설계/예정을 구분한다 · 가상화는 수업 전이라 싣지 않는다.**

---

## Identity (Hero)

```
이준익 / Lee Junik
Infrastructure Engineer · 서버 · 클라우드
인프라가 재밌어서 집에서도 서버를 돌립니다.
궁금하면 해 보고, 재 보고, 적어 둡니다.
```

### Tagline (signature, repeated as motto)

> **try: 코드로 도전하고, catch: 사람과 소통하며, finally: 신뢰할 수 있는 서비스를 만듭니다.**
>
> Try the code, Catch the people, Finally make it reliable.

### Visual signature (must appear prominently)

```ts
try {
  code();
} catch (people) {
  communicate();
  growTogether();
} finally {
  shipReliableService();
}
```

> ⚠️ **DESIGN.md 가드레일**: 이 코드 블록은 본인 정체성의 핵심. Hero에 시각적 앵커로 배치. JetBrains Mono 폰트, syntax highlighting 적용. 단순 텍스트로 흘리지 말 것.

---

## Contact

- **Email**: zz262zzx@gmail.com
- **GitHub**: github.com/juniqu-e
- **Velog**: velog.io/@juniqu_e
- **Home Server**: wnsdlr.com (이 사이트)

---

## About Me

집에서도 Linux 서버를 직접 구축하고 운영할 만큼 **인프라를 재밌어 하는 사람**입니다. 궁금하면 직접 해 보고, 측정하고, 기록합니다.

리눅스 서버 한 대에 **Docker 컨테이너 25개**와 직접 만든 서비스·오픈소스 10개 이상을 올려 1년 넘게 운영하고 있습니다. 포트포워딩 없이 Cloudflare Tunnel로 도메인 20여 개를 공개하고, 전 도메인이 내려간 장애의 원인을 iptables 규칙 누락으로 밝혀 2분 주기 자가 복구 타이머로 재발을 막았습니다.

서비스는 코드가 아니라 배포·캐시·방화벽·갱신 정책처럼 코드 바깥에서 깨진다는 것을 운영하면서 배웠습니다. 그래서 문제가 생기면 추측하지 않고 **앱 → 컨테이너 → 호스트 → 네트워크 순으로 측정**해 원인을 좁히고, 증상·원인·조치·재발 방지를 기록으로 남깁니다. 지금은 한국전파진흥협회 클라우드 보안 전문가 과정에서 네트워크·보안·Windows/Linux 서버·스토리지·AWS를 실장비로 다루고 있습니다.

### 운영 기록 (숫자로 보는 현재)

| 값 | 라벨 | 보조 |
|---|---|---|
| 25 | 컨테이너 | 리눅스 서버 1대 · 1년+ |
| 20+ | 공개 도메인 | 포트포워딩 0 · Cloudflare Tunnel |
| 61,328 | 문제 풀이 | ccna.wnsdlr.com · 사용자 22명 |
| 0.02% | 5xx 비율 | 요청 21만 건 중 |
| 60+ | 무중단 배포 | blue/green · 12일 |
| 1,000+ | 확인 문항 | 강의노트 50+ · 개념 위키 165 |

### 정체성 요약 표

| 구분 | 내용 |
|---|---|
| Role | 인프라 엔지니어 (서버 · 클라우드) 지향 |
| Focus | Linux · Windows Server 운영, 스토리지, 컨테이너 배포, 모니터링·가용성, Cloudflare · AWS |
| Current | RAPA 클라우드 보안 전문가 양성과정 (2026.07 ~ 2026.12 수료 예정) |
| Certification | 정보처리기사 (2026.09) · CCNA 200-301 (2026.10) · AWS SAA · RHCSA 준비 중 |
| Motto | Try the code, Catch the people, Finally make it reliable. |

---

## Tech Stack

DESIGN.md의 큰 아이콘 그리드 패턴 적용. 카테고리 순서 = 정체성 우선 (서버 → 클라우드 → 컨테이너 → 관측 → 네트워크 → 언어·도구). 각 항목의 `note`(어디서 썼는지)는 `content/skills.ts`가 정본.

| 카테고리 | 항목 |
|---|---|
| Server / OS / Storage | Linux · Ubuntu Server · Windows Server · Storage (RAID·SMB·NFS·iSCSI) · Bash |
| Cloud / Edge | Cloudflare · AWS · MinIO |
| Container / Delivery | Docker · Kubernetes · Helm · Argo CD · Jenkins · GitHub Actions · GitLab CI |
| Observability / Availability | Prometheus · Grafana · Nginx · HAProxy · keepalived · Uptime Kuma |
| Network / Security | Cisco IOS · Cisco ASA · VPN · DNS |
| Languages & Tools | Python · Go · TypeScript · Kotlin · Git · GitHub · Jira · Obsidian |

> 뺀 것: Terraform · OPA/Conftest · Ansible (근거 프로젝트 없음) · VMware/vSphere (가상화 구간 수업 전) · Django · Spring · Vue · Figma · Slack (인프라 포지셔닝과 무관).
> ⚠️ **DESIGN.md 가드레일**: 진행도 바(%) 절대 금지. 각 항목은 devicon 브랜드 SVG 또는 Phosphor 아이콘.

---

## Experience

### SSAFY 13기 · 14기 실습코치 — 교육생 개발·인프라 기술지원

**기간**: 2025.06 ~ 2026.06 (두 기수 연속 계약)

SSAFY 12기 수료 후 두 기수를 연속으로 지원했습니다. 교육생 팀 프로젝트의 개발환경·CI/CD·배포 문제를 함께 풀고, 교육용 Kubernetes(EKS) 가이드를 직접 따라 하며 검증해 운영 관점의 개선안을 제출했습니다. 전국 교육생 대상 기술 세션을 두 차례 진행했고, 삼성전자 AI 전문가 과정 교안 13개 차시를 제작했습니다.

| 영역 | 설명 |
|---|---|
| K8s 가이드 검수 | EKS · GitLab CI · Argo CD · Helm · Ingress · 인증서 기반 배포 가이드를 끝까지 따라 하며 검증. 클러스터 앱 서버 신청 절차 개선, 빌드 캐싱 도입 등 운영 개선안 제안자로 등재 |
| 프로젝트 기술지원 | 13·14기 팀 프로젝트의 개발환경·CI/CD·배포 문제 지원, 유저 테스트 리포트 작성, 버그·개선 사항 등록 |
| 기술 세션 발표 | 전국 교육생 대상 2회 — 「모바일 개발 프로세스」(2025.09), 「Samsung Health Data SDK」(2026.04) |
| 교안 제작 | 삼성전자 AI 전문가 과정 13개 차시 — LangChain · 자연어처리 · 이미지 파운데이션 모델 · Agent |
| 생산성 도구 개발 | Mattermost 예약 메시지 플러그인에 GUI·파일 첨부 기능 추가 (Go · TypeScript), 매뉴얼 v1/v2 작성 |

---

## Featured Projects

4개 그룹: **In Operation / Infra Build & Lab / Developer Tools / Mobile**. 본문·담당·스택·숫자는 **`content/projects.ts`가 정본**이다 (2026-10-12부터 CONTENT.md에 중복 기재하지 않는다).

| 그룹 | 프로젝트 | 한 줄 |
|---|---|---|
| In Operation | 홈서버 인프라 | 리눅스 서버 1대 · 컨테이너 25개 · 포트포워딩 없이 도메인 20여 개 공개 · 장애 3건 기록 |
| In Operation | ccna.wnsdlr.com — CCNA 문제은행 | 22명 · 61,328 풀이 · 21만 요청 5xx 0.02% · 무중단 배포 60회+ |
| In Operation | AI 지식관리 워크스테이션 | MinIO 단일 소스 + rclone bisync + systemd 타이머 · 강의노트 50+ · 개념 165 · 문항 1,000+ |
| Infra Build & Lab | 웹 서비스 가용성 인프라 | HAProxy L7 + keepalived VIP + Prometheus/Grafana · 헬스체크 원인 트러블슈팅 |
| Infra Build & Lab | Windows Server 서비스 구축 | AD 포리스트·자식 도메인 · DNS·DHCP Relay·NTP · RAID-5·SMB·NFS·iSCSI |
| Infra Build & Lab | Linux 서버 서비스 구축 (진행 중) | isc-dhcp · BIND · chrony · nginx · SSH · Samba · NFS |
| Infra Build & Lab | 사내 네트워크 설계 (80명) | 요구사항만 받아 설계 산출물 3종 — **설계까지**, 구축 안 함 |
| Developer Tools | PADING | K8s 기반 컨테이너 실행·서브도메인 배포 구현 · SSAFY 공통 2등 |
| Developer Tools | Mattermost 예약 메시지 플러그인 | GUI·파일 첨부 추가 (Go·TS) |
| Mobile | WhistleHub · Amoverse | SSAFY 특화 1등 · 자율 2등 (모바일 팀장·아키텍처 설계) |

> 뺀 것: DevFlow Harness (설계만 있고 구현물 없음) · AI 추론 하이브리드 인프라 (계획 단계).

---

## Awards

| Year | 구분 | 수상 | 프로젝트 |
| :--: | --- | --- | --- |
| 2025 | SSAFY 12기 공통 프로젝트 | **2등** | PADING (페어프로그래밍 WEB IDE) |
| 2025 | SSAFY 12기 특화 프로젝트 | **1등** | WhistleHub (음악 생성 모바일 앱) |
| 2025 | SSAFY 12기 자율 프로젝트 | **2등** | Amoverse (아티스트 모바일 전시회 앱) |

---

## Education & Certification

| 구분 | 내용 | 보조 | 상태 |
|---|---|---|---|
| Certification | CCNA 200-301 | Cisco · 2026.10 | 취득 |
| Certification | 정보처리기사 | 한국산업인력공단 · 2026.09 | 취득 |
| Certification | AWS Certified Solutions Architect – Associate | 2026.11 응시 예정 | 준비 중 |
| Certification | RHCSA (EX200) | Red Hat · 리눅스 서버 구간 이후 응시 | 준비 중 |
| Education | 클라우드 보안 전문가 양성과정 | 한국전파진흥협회(RAPA) · 2026.07 ~ 2026.12 | 수료 예정 |
| Education | SSAFY 12기 Python 트랙 | 2024.07 ~ 2025.06 · 팀 프로젝트 3회 전부 수상 | 수료 |
| Education | 부경대학교 정치외교학과 | 2020.08 졸업 | 학사 |

> CKA는 2027년 이후 계획이라 싣지 않는다. 없는 것을 있다고 쓰지 않는다.

---

## Footer Tagline

> **Try the code, Catch the people, Finally make it reliable.**
>
> 궁금하면 해 보고, 재 보고, 적어 둡니다.
