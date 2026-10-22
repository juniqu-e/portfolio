# Portfolio Content

본 문서는 wnsdlr.com 포트폴리오에 들어갈 콘텐츠 원본이다. 실제 컴포넌트는 이 콘텐츠를 참조하여 빌드한다.

**2026-10-12 전면 개편 — 인프라 엔지니어(서버·클라우드) 포지셔닝.** 소스: Obsidian 볼트 `30-Output/취업 - 인프라 SI/` (이력서·포트폴리오 마스터, 자기소개서 §0 데이터 팩트, 03 면접 기술 스택 표) + `20-Wiki/Projects/` (홈서버 인프라, CCNA 문제은행, AI 지식관리 워크스테이션, 홈 인프라 구성). 원칙: **측정한 숫자만 쓴다 · 근거 없는 기술은 적지 않는다 · 구축/설계/예정을 구분한다 · 가상화는 수업 전이라 싣지 않는다.**

---

## Identity (Hero)

```
이준익 / Lee Junik
Infrastructure Engineer · 서버 · 클라우드
```

> **모토 확정 (2026-10-14)** — 기술: **"기술의 가치는 사람이 할 수 있는 일을 넓히는 데 있다."** · 삶: **"미래를 바꾸려면, 변화의 대가도 선택해야 한다."** 본인이 인터뷰로 만든 문장이며 누구의 인용도 아니다. **먼저 `/story`에 반영**했고(§"/story — 두 철학"), 메인(`/`) Hero 이름 아래 반영은 보류(사용자 결정). 옛 모토 "Try the code, Catch the people, Finally make it reliable."과 try/catch/finally 코드 블록은 폐기(2026-10-12). "궁금하면 해 보고, 재 보고, 적어 둡니다" 문구도 쓰지 않는다.

---

## Contact

- **Email**: zz262zzx@gmail.com
- **GitHub**: github.com/juniqu-e
- **Velog**: velog.io/@juniqu_e
- **Home Server**: wnsdlr.com (이 사이트)

---

## About — 인프라 철학만

인프라는 잘 세우는 것으로 끝나지 않는다고 생각합니다. **멈추지 않게 하는 것**이 일의 대부분이고, 멈췄다면 원인을 찾아 같은 문제가 다시 일어나지 않게 만드는 데까지가 제 몫입니다.

그래서 **추측하지 않고 측정합니다**. 느리다는 말에 서버부터 키우지 않고, 앱과 컨테이너, 호스트, 네트워크를 차례로 재서 어디가 아닌지부터 확인합니다. 숫자가 원인을 가리키기 전에는 조치하지 않습니다.

서비스는 코드보다 **코드 바깥에서 더 자주 깨집니다**. 배포 방식, 캐시, 방화벽 규칙, 자동 갱신 같은 것들입니다. 모니터가 있다고 모니터링이 되는 것이 아니고, 복제가 있다고 백업이 되는 것도 아닙니다. 서비스를 올리기 전에 감시와 복구 수단부터 갖추려고 합니다.

마지막으로 **다른 사람이 그대로 따라 할 수 있게 기록합니다**. 장애는 증상과 원인, 조치, 재발 방지 순으로 남깁니다. 혼자만 아는 운영은 그 사람이 없는 날 멈추기 때문입니다.

> 숫자 그리드·정체성 요약표는 About에서 뺐다. 숫자는 프로젝트 카드에 있다.

---

## Tech Stack

4개 그룹만. 진행도 바 금지, devicon 브랜드 SVG.

| 그룹 | 항목 |
|---|---|
| Server / Cloud | Linux · Windows Server · Docker · Kubernetes · AWS · Cloudflare |
| Operations | Nginx · Jenkins · Prometheus · Grafana |
| Languages | Python · JavaScript · Java |
| Tools | Git · Jira · Notion · Slack · Mattermost · Figma |

---

## Experience

### SSAFY 13기 · 14기 실습코치 — 교육생 개발·인프라 기술지원

**기간**: 2025.06 ~ 2026.06 (두 기수 연속 계약)

SSAFY 12기 수료 후 두 기수를 연속으로 지원했습니다. 교육생 팀 프로젝트의 개발환경·CI/CD·배포 문제를 함께 풀고, 교육용 Kubernetes(EKS) 가이드를 직접 따라 하며 검증해 운영 관점의 개선안을 제출했습니다. 전국 교육생 대상 기술 세션도 두 차례 진행했습니다.

| 영역 | 설명 |
|---|---|
| K8s 가이드 검수 | EKS · GitLab CI · Argo CD · Helm · Ingress · 인증서 기반 배포 가이드를 끝까지 따라 하며 검증. 클러스터 앱 서버 신청 절차 개선, 빌드 캐싱 도입 등 운영 개선안 제안자로 등재 |
| 프로젝트 기술지원 | 13·14기 팀 프로젝트의 개발환경·CI/CD·배포 문제 지원, 유저 테스트 리포트 작성, 버그·개선 사항 등록 |
| 기술 세션 발표 | 전국 교육생 대상 2회 — 「모바일 개발 프로세스」(2025.09), 「Samsung Health Data SDK」(2026.04) |
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
| Developer Tools | PADING | K8s 기반 컨테이너 실행·서브도메인 배포 구현 · SSAFY 공통 2등 |
| Developer Tools | Mattermost 예약 메시지 플러그인 | GUI·파일 첨부 추가 (Go·TS) |
| Mobile | WhistleHub · Amoverse | SSAFY 특화 1등 · 자율 2등 (모바일 팀장·아키텍처 설계) |

> 뺀 것: DevFlow Harness (설계만 있고 구현물 없음) · AI 추론 하이브리드 인프라 (계획 단계) · 사내 네트워크 설계 (프로젝트로 수행하지 않음).

---

## Awards

| Year | 구분 | 수상 | 프로젝트 |
| :--: | --- | --- | --- |
| 2025 | SSAFY 12기 공통 프로젝트 | **2등** | PADING (페어프로그래밍 WEB IDE) |
| 2025 | SSAFY 12기 특화 프로젝트 | **1등** | WhistleHub (음악 생성 모바일 앱) |
| 2025 | SSAFY 12기 자율 프로젝트 | **2등** | Amoverse (아티스트 모바일 전시회 앱) |

---

## Education

`content/education.ts`가 정본. 과정마다 기간 · 기관 · 한 문단 · 무엇을 했는지 표.

| 기관 | 과정 | 기간 |
|---|---|---|
| 한국전파진흥협회 (RAPA) | 클라우드 보안 전문가 양성과정 · 수료 예정 | 2026.07 ~ 2026.12 — 네트워크 · 보안 · Windows Server · Linux Server · Cloud(AWS) |
| 삼성 청년 SW·AI 아카데미 (SSAFY) | 12기 Python 트랙 · 1,600시간 수료 | 2024.07 ~ 2025.06 — 웹·모바일, Jenkins · K8s CI/CD, 팀 프로젝트 3회 전부 수상·발표 |

---

## Certifications

순서 고정: 정보처리기사 → CCNA → 운전면허 → Running 1개. 준비 중인 자격증은 **Running 하나만** 둔다.

| 자격증 | 발행 | 날짜 | 상태 |
|---|---|---|---|
| 정보처리기사 | 한국산업인력공단 | 2026.09 | 취득 |
| CCNA 200-301 | Cisco | 2026.10 | 취득 |
| 자동차운전면허 2종 보통 | 부산지방경찰청 | 2021.03 | 취득 |
| VMware VCP (vSphere Foundation 9.0 Administrator, 2V0-16.25) | Broadcom | 2026.10 | 취득 — **2026-10-22 시험 합격, 인증서 발급 대기** (번호는 발급 후 기입) |
| AWS Certified Solutions Architect – Associate | Amazon Web Services | 2026.11 | Running |

---

## 메인(`/`) = 터미널 스토리 페이지 — 두 철학 (2026-10-14 15:30 `/story` → `/` 승격)

> **2026-10-14 결정**: 구 섹션형 메인을 이 페이지로 대체했다. `/story`는 `/`로 301 리다이렉트. `noindex` 해제(루트 메타데이터 적용). `components/sections/*`는 미사용(리빌드 참고용).

### 브랜드 — 로고 (2026-10-14 확정)

정식 로고는 사용자가 준 **블랙레터 LJI 모노그램** 원본(`public/brand/logo.png`, 투명 배경). 회녹 획 + 가운데 초록 J. 임의로 다시 그리지 않는다. 쓰는 자리: 탭 아이콘(`app/icon.png`·`favicon.ico` — **전체 로고**를 여백 3%로 축소. 크롭은 2026-10-14 사용자가 "잘려 보인다"고 되돌림), Apple 아이콘(`app/apple-icon.png`, 전체 로고), OG 카드 우측, 상단 크롬 프롬프트 앞(18px 마크), credits(로고 + 이름).

`content/story.ts`가 정본. 원본은 Obsidian 볼트 `30-Output/나의 철학 — 두 문장.md` (상세: `엔지니어 정체성 — 철학과 성장 이야기.md` · `삶의 철학 — 변화의 대가와 미래의 선택.md`). 문장은 본인이 2026-10-14 인터뷰에서 확정한 것 — **임의로 고치지 않는다.**

### 구성 (`/story`)

부팅 → INFRA 히어로 + **떠 있는 터미널 창**(어디서든 z-50, 머리띠 드래그로 이동, 접으면 프롬프트 알약, 백틱 ` 로 토글, Esc 로 접기 · **처음엔 접힘**(히어로의 프롬프트 힌트 + 알약 3회 강조) · 같은 탭에선 마지막 상태 · 명령(배너는 name · role 두 줄, `ls`의 philosophy/ = "기술과 삶의 철학", certifications/ = "자격증", `cat README.md` = GitHub 프로필을 새 탭으로): `help` `ls` `cd <섹션>` `cat README.md|philosophy.md` `pwd` `whoami` `uptime` `clear`, Tab 자동완성·↑↓ 이력, `cd story` 등은 Lenis 스크롤로 이동) → `cat ~/philosophy.md` **2장면**(tech · life) → journalctl 타임라인 **11장**(카드 클릭 → 상세 모달) → certifications(운전면허 제외, 최신 위) → stack(`skills.ts` 4그룹) → guestbook → contact → credits(전광판 — JS 프레임 구동 60px/s, OS 동작 줄이기와 무관, "served from GMKtec G3 · Intel N100 홈서버 · Cloudflare" · "deployed by GitHub Actions → GHCR"). 좌상단 프롬프트 `junik@homeserver:~/whoami$`. `noindex` 유지.

> 2026-10-14 2차 개편: 03 link 장면·`story.md` 절 삭제, 모토는 **"~라고 믿습니다 / 생각합니다" 어조**로(단정형 금지), 카드 문구도 합니다체. "now"·"running" 섹션 삭제, 방명록 추가, 연락처 마지막.

### 타임라인 12장 (`components/story/data.ts` — 2026-10-14 확정 순서 + RAPA 추가 + 2026-10-22 VCP 합격·SAA 카드)

| # | 날짜 | 카드 | 상세의 출처 |
|---|---|---|---|
| 1 | 2024.07 | SSAFY 12기 입과 | 교육 내용 · CI/CD · 협업 (education.ts와 같은 사실, "비전공" 표현 없음) |
| 2 | 2025.01 | PADING | `pading` + **덮어쓰기 — 프론트엔드 담당 · 발표로 백엔드·인프라 이해 · 컨테이너·K8s 환경을 처음 접함** (2026-10-14 사용자 정정: "쿠버네티스를 구현한 것이 아니라 프론트엔드 담당". `projects.ts`·메인 페이지·볼트 이력서의 "컨테이너 실행·서브도메인 배포 구현" 문구는 리빌드 때 함께 고친다) |
| 3 | 2025.03 | WhistleHub | `whistlehub` + 담당 표 덮어쓰기 |
| 4 | 2025.04 | Amoverse (À moi) | `amoverse` + 역할 덮어쓰기 — **"모바일 3명 중 아키텍처 설계·디자인 패턴·핵심 기능 주도 (공식 직함 없음)"** (2026-10-14 사용자 확인. `projects.ts`의 "모바일 팀장"은 메인 리빌드 때 함께 고친다) |
| 5 | 2025.06 | SSAFY 수료 → 실습코치 | experience.ts와 같은 사실 + EKS 개선안 9건 |
| 6 | 2025.10 | 홈서버 가동 | `homeserver` + **실행 중 서비스 목록** (`HOMESERVER_SERVICES`, 2026-10-14 `docker ps` 27개 기준). 관리 도구(프록시·Portainer·Jenkins·웹 SSH 등)는 **이름만, 주소 없음** |
| 6.5 | 2026.07 | RAPA 클라우드 보안 과정 입과 | education.ts RAPA 항목과 같은 사실 + "개발 시간을 내려놓고 고른 길" |
| 7 | 2026.08 | AI 지식관리 워크스테이션 구축 | `ai-knowledge-workstation` + "기록이 귀찮아서 만든 시스템" 서술 |
| 8 | 2026.09 | 정보처리기사 | "실기가 어려워 문제은행 사이트를 처음 만들었고 문제는 AI로 생성" — **낙방 횟수·점수는 적지 않는다** |
| 9 | 2026.10 | CCNA · 문제은행 (카드 아래 `ccna.wnsdlr.com`) | `ccna-quiz` 그대로 + 취득일 10/02 |
| 10 | 2026.10 | VMware VCP 합격 | 2026-10-22 합격(2V0-16.25) · 수업 범위(중첩 ESXi · VCSA · vSS/vDS · NFS/iSCSI · KVM)와 겹쳐 준비 · **점수는 적지 않는다** · 인증서 발급 대기 (2026-10-22 갱신) |
| 11 | 2026.11 | AWS SAA 준비 | 다음 목표 · 학습 플랫폼에 SAA 과목 · 과정 AWS 구간과 겹쳐 준비 · 서버 → 클라우드 방향 문단은 여기로 이동 (2026-10-22) |

> 서비스 목록은 정적 스냅샷이다. 컨테이너가 바뀌면 `HOMESERVER_SERVICES.asOf`와 목록을 같이 고친다. 방명록은 메인과 같은 `/api/guestbook`을 쓰고 `GuestbookForm`·`GuestbookList`의 `tone="term"`으로만 다르다.

### philosophy.md — 3장면

| # | label | 큰 문장 | 본문 |
|---|---|---|---|
| 01 | tech | 기술의 가치는 사람이 할 수 있는 일을 넓히는 데 있다고 믿습니다. | 생산성 = 시도·실현할 수 있는 일의 범위라고 생각. 안정 운영·효율·자동화·측정·기록은 이 믿음을 실천하는 수단이라고 생각 |
| 02 | life | 미래를 바꾸려면, 변화의 대가도 함께 선택해야 한다고 믿습니다. | 변화의 대가(시간·노력·익숙함)를 받아들이는 것까지가 선택이라고 생각. 결과가 달라도 미래를 준비하는 선택이면 의미가 있다고 믿음 |

> 원문(볼트)의 모토는 "…있다." / "…해야 한다." 단정형이지만 **사이트에서는 믿습니다체**로 쓴다 (2026-10-14 사용자 지시: 읽는 사람이 불편하지 않게). 03 link 장면은 삭제.

### ~~story.md — 3절~~ (2026-10-14 삭제 — 타임라인이 대신한다)

1. **변화에는 대가가 있다는 것을 먼저 배웠다** — 고3의 첫 변화(등급 숫자 없음) → 법률사무소·마트·공장에서 남은 것(돈과 노력의 무게, 감수할 힘듦의 기준 = 방향과 배움) → 개발 시간을 내려놓고 인프라를 택한 이유와 "현재의 선택이 미래를 준비하면 의미가 있다"
2. **기술이 무엇을 위한 것인지는 운영하면서 알았다** — 홈서버 → 자동화·솔루션에서 재미 → 문제은행(사람별 기록·무중단 배포, "사람들의 편리함과 나의 편리함") → 생산성의 정의
3. **두 문장이 만나는 자리** — 서버 → 클라우드 → 플랫폼, 기본기 순서를 건너뛰지 않음 → 선택의 질문 3개

### 쓰지 않는 것 (정체성 문서 기준)

비전공·늦은 출발 서사 · 점수·등수 자랑 · "한 번 각성한 사람" 서사 · 고통 미화·영웅 서사 · 작품(『강철의 연금술사』) 인물 대응 · 플랫폼 엔지니어 단정 · 시장 전망 단정 · 고등학교 등급 숫자. 타임라인 카드 문구도 같은 기준으로 고쳤다 ("비전공으로" · "반 2등" 삭제).
