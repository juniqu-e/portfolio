# Portfolio Content

본 문서는 wnsdlr.com 포트폴리오에 들어갈 콘텐츠 원본이다. 실제 컴포넌트는 이 콘텐츠를 참조하여 빌드한다.

소스: 본인 GitHub README (juniqu-e). GitHub 전용 장식(capsule-render 그라데이션, shields.io 배지, skillicons SVG)은 제외하고 구조화된 본문만 추출.

---

## Identity (Hero)

```
이준익 / Lee Junik
DevOps / Platform Engineer
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

> ⚠️ **DESIGN.md 가드레일**: 이 코드 블록은 본인 정체성의 핵심. About 섹션 또는 Hero에 시각적 앵커로 배치. JetBrains Mono 폰트, syntax highlighting 적용. 단순 텍스트로 흘리지 말 것.

---

## Contact

- **Email**: zz262zzx@gmail.com
- **GitHub**: github.com/juniqu-e
- **Velog**: velog.io/@juniqu_e
- **Home Server**: wnsdlr.com (이 사이트)

---

## About Me

반복되는 작업은 자동화하고, 팀의 흐름은 부드럽게 만들며, 마지막에는 안정적으로 운영 가능한 서비스를 남기는 개발자를 지향합니다.

현재 **SSAFY 13기 · 14기 실습코치**로 활동하고 있으며 교육생들이 개발 도구, 협업 프로세스, 인프라 환경을 자연스럽게 사용할 수 있도록 돕고 있습니다.

개발자가 기능 구현에 집중할 수 있는 **자동화된 워크플로우**, **신뢰할 수 있는 배포 환경**, **명확한 운영 문서**를 만드는 데 관심이 많습니다.

### 정체성 요약 표

| 구분 | 내용 |
|---|---|
| Role | DevOps / Platform Engineer 지향 |
| Interest | Developer Productivity, CI/CD, Kubernetes, Internal Developer Platform |
| Current | SSAFY 13기 · 14기 실습코치 (2025.06 ~ 현재) |
| Certification | CKA (진행중), 정보처리기사 (진행중) |
| Motto | Try the code, Catch the people, Finally make it reliable. |

---

## Tech Stack

DESIGN.md의 큰 아이콘 그리드 패턴 적용. 각 카테고리는 시각적으로 구분된 섹션.

### DevOps / Platform
Linux · Docker · Kubernetes · Nginx · Jenkins · GitHub Actions · Helm · Argo CD · OPA / Conftest

### Cloud / Infrastructure
AWS · Terraform

### Languages
Python · TypeScript · JavaScript · Java

### Frontend / Mobile
React · Vue · Android Studio

### Backend
Django · Spring

### Tools & Collaboration
Git · GitHub · GitLab · Figma · Jira · Mattermost · Slack

> ⚠️ **DESIGN.md 가드레일**: 진행도 바(%) 절대 금지. 각 항목은 Phosphor 또는 공식 브랜드 SVG. 호버 시 Lordicon 또는 미세 애니. 우선 노출 순서는 위 카테고리 순서 유지 (DevOps 정체성 우선).

---

## Experience

### SSAFY 13기 · 14기 실습코치
**기간**: 2025.06 ~ 현재

SSAFY 12기 수료 이후 13기와 14기 실습코치로 활동하며, 교육생들이 개발 환경과 협업 도구를 안정적으로 활용할 수 있도록 지원하고 있습니다. 특히 Git, Jira, SSAFY 인프라, 모바일 개발 프로세스처럼 프로젝트 수행 과정에서 반복적으로 마주치는 실무형 도구와 흐름을 중심으로 코치세션을 진행했습니다.

#### 주요 업무
| 영역 | 설명 |
|---|---|
| 코치세션 운영 | 개발자 도구, Git / Jira 활용법, SSAFY 인프라 사용법, 모바일 개발 프로세스 교육 |
| 생산성 도구 개발 | Mattermost 예약 메시지 플러그인 개발 참여 및 프론트엔드 구현 |
| 인프라 검증 | SSAFY Kubernetes 실습 환경의 안정성과 사용성 테스트 |
| 문서화 | 임베디드 프로젝트 오픈소스 위키 제작 및 리팩토링 |
| 교육 자료 제작 | 비전공자도 이해할 수 있는 AI 강의 교안 제작 지원 |

---

## Featured Projects

프로젝트는 4개 카테고리로 그룹화: **In Progress / In Operation / Developer Tools / Mobile**. 각 그룹은 시각적으로 구분.

DESIGN.md 가드레일: 이미지 카드 그리드 (2 col desktop / 1 col mobile). 호버 시 카드 살짝 떠오르고 액션 아이콘 등장. 상세는 모달 또는 별도 페이지.

---

### [In Progress] DevFlow Harness

**Jira 이슈 기반 DevOps Workbench / Internal Developer Platform**

> 개발자가 Jira 이슈를 기준으로 작업을 시작하면 GitHub 브랜치 생성 → PR 생성 → CI/CD 실행 → Kubernetes Preview 배포 → OPA 정책 검사 → Jira 댓글 업데이트까지 이어지는 흐름을 자동화하는 DevOps Workbench입니다.

DevFlow Harness는 개발자가 작업 시작부터 검증, 배포, 피드백까지의 과정을 하나의 일관된 흐름으로 경험할 수 있도록 설계한 프로젝트입니다. 이슈 중심의 개발 흐름을 기반으로 브랜치 생성, PR 생성, Preview Environment 구성, 정책 검사, 협업 도구 업데이트를 연결하여 **반복 작업을 줄이고 배포 신뢰성을 높이는 Internal Developer Platform**을 목표로 합니다.

| 영역 | 구현 내용 |
|---|---|
| Issue Workflow | Jira API 기반 이슈 조회 및 이슈 키 기반 GitHub 브랜치 생성 자동화 |
| Pull Request | GitHub API 기반 PR 생성 및 GitHub Actions 실행 상태 조회 |
| Preview Environment | Kubernetes Namespace 단위 Preview Environment 생성 / 삭제 흐름 설계 |
| Policy Check | OPA / Conftest 기반 image tag, resource limit, securityContext 정책 검사 |
| Feedback Loop | 정책 위반 결과와 Preview URL을 Jira 댓글로 자동 등록 |

**Stack**: Jira API · GitHub API · Kubernetes · Helm · GitHub Actions · Argo CD · OPA / Conftest

---

### [In Operation] Couple Diary

**Personal Project · 운영 중**
**Repo**: github.com/juniqu-e/couple-diary

> 단순한 웹 서비스 개발을 넘어 CI/CD, Docker, 배포 자동화, 모니터링, 장애 대응을 실습하기 위한 운영형 프로젝트입니다.

Couple Diary는 서비스를 직접 운영하며 배포와 운영의 전체 흐름을 학습하기 위한 프로젝트입니다. 프론트엔드, 백엔드, 데이터베이스를 분리한 구조를 바탕으로 Docker Compose 기반 로컬 실행 환경을 구성하고, GitHub Actions를 활용한 테스트 및 배포 자동화를 적용하고 있습니다.

| 영역 | 설명 |
|---|---|
| Architecture | Frontend / Backend / Database 분리 구조 |
| Local Environment | Docker Compose 기반 로컬 실행 환경 |
| Automation | GitHub Actions 기반 테스트 및 배포 자동화 |
| Network | Nginx Reverse Proxy 및 HTTPS 적용 예정 |
| Operation | 로그 확인, 장애 대응, 운영 문서화 |

**Stack**: Docker Compose · GitHub Actions · Nginx · EC2 · Kubernetes

---

### [Developer Tools] PADING — 페어프로그래밍 WEB IDE

**SSAFY 12기 공통 프로젝트 · 2등 수상 · Frontend Developer**
**Repo**: github.com/juniqu-e/Pading

> 브라우저 기반 개발 환경에서 사용자가 프로젝트를 실행하고 배포할 수 있도록 지원하는 개발자 워크스페이스입니다.

PADING에서는 웹 기반 IDE 환경에서 사용자가 코드 작성 이후 실행과 배포까지 자연스럽게 이어갈 수 있도록 프론트엔드 흐름을 설계했습니다. 웹 터미널 서버와 프론트엔드를 연동하고, 실행 및 배포 상태를 UI로 표현하여 협업 중인 개발자들이 현재 작업 상태를 빠르게 이해할 수 있도록 구성했습니다.

| 담당 영역 | 설명 |
|---|---|
| Web Terminal | 웹 터미널 서버와 프론트엔드를 연동하여 브라우저에서 명령 실행 결과 확인 |
| Deployment UX | 실행 / 배포 버튼 및 상태 표시 UI 설계 |
| Collaboration Flow | 코드 작성, 실행, 협업 흐름을 하나의 웹 환경으로 통합 |
| Access Control | 권한 관리 화면 및 사용자 역할별 네비게이션 구조 설계 |

**Stack**: React · WebSocket · Web Terminal · Workspace UX

---

### [Developer Tools] Mattermost 예약 메시지 플러그인

**SSAFY 실습코치 업무 중 개발 · Developer Productivity Tool**

> Mattermost 환경에서 예약 메시지 기능을 제공하는 내부 생산성 플러그인입니다.

협업 도구에서 반복적으로 필요한 메시지 예약 기능을 플러그인 형태로 구현하며, WSL 기반 개발 환경과 Make 빌드 흐름을 경험했습니다. 프론트엔드 영역을 담당하여 사용자 입력, 예약 시간 설정, 메시지 전송 UI를 구현했고, Go 기반 백엔드 플러그인 구조와 API 연동 흐름을 이해하며 협업 도구 확장 경험을 쌓았습니다.

| 담당 영역 | 설명 |
|---|---|
| Development Environment | WSL 기반 개발 환경 및 Make 빌드 흐름 구성 |
| Frontend | 사용자 입력, 예약 시간 설정, 메시지 전송 UI 구현 |
| Backend Integration | Go 기반 Mattermost 플러그인 구조 이해 및 API 연동 |
| Productivity | 협업 도구 기능 확장을 통한 내부 생산성 개선 경험 |

**Stack**: Go · React · Mattermost Plugin SDK · Make · WSL

---

### [Mobile] WhistleHub — 누구나 쉽게 음악을 만들 수 있는 모바일 앱

**SSAFY 12기 특화 프로젝트 · 1등 수상 · Mobile Developer**
**Repo**: github.com/juniqu-e/WhistleHub

> 간단한 조작으로 음악을 생성하고 편집할 수 있는 모바일 앱입니다. 사용자 플로우 설계, 화면 구현, API 연동을 담당했습니다.

**Stack**: Android · REST API · JNI · CMAKE · OBOE

---

### [Mobile] Amoverse — 아티스트를 위한 모바일 전시회 앱

**SSAFY 12기 자율 프로젝트 · 2등 수상 · Mobile / On-device AI Developer**
**Org**: github.com/Amoverse

> 아티스트의 작품을 모바일에서 전시하고 감상할 수 있는 앱입니다. 온디바이스 AI를 활용하여 사용자 경험을 개선했습니다.

**Stack**: Android · REST API · GraphQL · On-device AI

---

## Awards

| Year | 구분 | 수상 | 프로젝트 |
|:---:|---|---|---|
| 2025 | SSAFY 12기 공통 프로젝트 | **2등** | PADING (페어프로그래밍 WEB IDE) |
| 2025 | SSAFY 12기 특화 프로젝트 | **1등** | WhistleHub (음악 생성 모바일 앱) |
| 2025 | SSAFY 12기 자율 프로젝트 | **2등** | Amoverse (아티스트 모바일 전시회 앱) |

---

## Education & Certification

| 구분 | 내용 | 상태 |
|---|---|---|
| Certification | CKA (Certified Kubernetes Administrator) | 진행중 |
| Certification | 정보처리기사 | 진행중 |
| Education | SSAFY 12기 Python 트랙 | 수료 |
| Education | 정치외교학과 | 학사 |

---

## Footer Tagline

> **Try the code, Catch the people, Finally make it reliable.**
>
> Building reliable workflows for developers, teams, and services.
