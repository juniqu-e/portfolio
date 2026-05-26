import type { Project } from "@/types";

// Source: CONTENT.md §Featured Projects. 텍스트는 CONTENT.md 그대로.
// tagline = CONTENT.md 의 가장 직접적인 one-liner (프로젝트별 변형):
//   - DevFlow / Mattermost: bold 부제목
//   - PADING / WhistleHub / Amoverse: 제목의 em-dash 뒤 부제목
//   - Couple Diary: bold 부제목 (Personal Project · 운영 중)
// description = 본문 prose (blockquote + paragraph). 줄바꿈 \n\n 으로 paragraph 구분.
// award.competition = "SSAFY 12기 X 프로젝트" (CONTENT.md Awards 표와 정합).
// role = personal role 만 (수상/대회 정보는 award로 분리).

export const PROJECTS: Project[] = [
  // ── In Progress ────────────────────────────────────────────────────────
  {
    slug: "devflow-harness",
    group: "in-progress",
    title: "DevFlow Harness",
    tagline: "Jira 이슈 기반 DevOps Workbench / Internal Developer Platform",
    description:
      "개발자가 Jira 이슈를 기준으로 작업을 시작하면 GitHub 브랜치 생성 → PR 생성 → CI/CD 실행 → Kubernetes Preview 배포 → OPA 정책 검사 → Jira 댓글 업데이트까지 이어지는 흐름을 자동화하는 DevOps Workbench입니다.\n\nDevFlow Harness는 개발자가 작업 시작부터 검증, 배포, 피드백까지의 과정을 하나의 일관된 흐름으로 경험할 수 있도록 설계한 프로젝트입니다. 이슈 중심의 개발 흐름을 기반으로 브랜치 생성, PR 생성, Preview Environment 구성, 정책 검사, 협업 도구 업데이트를 연결하여 반복 작업을 줄이고 배포 신뢰성을 높이는 Internal Developer Platform을 목표로 합니다.",
    stack: [
      "Jira API",
      "GitHub API",
      "Kubernetes",
      "Helm",
      "GitHub Actions",
      "Argo CD",
      "OPA / Conftest",
    ],
    responsibilities: [
      {
        area: "Issue Workflow",
        detail: "Jira API 기반 이슈 조회 및 이슈 키 기반 GitHub 브랜치 생성 자동화",
      },
      {
        area: "Pull Request",
        detail: "GitHub API 기반 PR 생성 및 GitHub Actions 실행 상태 조회",
      },
      {
        area: "Preview Environment",
        detail: "Kubernetes Namespace 단위 Preview Environment 생성 / 삭제 흐름 설계",
      },
      {
        area: "Policy Check",
        detail: "OPA / Conftest 기반 image tag, resource limit, securityContext 정책 검사",
      },
      {
        area: "Feedback Loop",
        detail: "정책 위반 결과와 Preview URL을 Jira 댓글로 자동 등록",
      },
    ],
  },

  // ── Developer Tools ────────────────────────────────────────────────────
  {
    slug: "pading",
    group: "developer-tools",
    title: "PADING",
    tagline: "페어프로그래밍 WEB IDE",
    description:
      "브라우저 기반 개발 환경에서 사용자가 프로젝트를 실행하고 배포할 수 있도록 지원하는 개발자 워크스페이스입니다.\n\nPADING에서는 웹 기반 IDE 환경에서 사용자가 코드 작성 이후 실행과 배포까지 자연스럽게 이어갈 수 있도록 프론트엔드 흐름을 설계했습니다. 웹 터미널 서버와 프론트엔드를 연동하고, 실행 및 배포 상태를 UI로 표현하여 협업 중인 개발자들이 현재 작업 상태를 빠르게 이해할 수 있도록 구성했습니다.",
    role: "Frontend Developer",
    repoUrl: "github.com/juniqu-e/Pading",
    award: { rank: 2, competition: "SSAFY 12기 공통 프로젝트" },
    stack: ["React", "WebSocket", "Web Terminal", "Workspace UX"],
    responsibilities: [
      {
        area: "Web Terminal",
        detail: "웹 터미널 서버와 프론트엔드를 연동하여 브라우저에서 명령 실행 결과 확인",
      },
      {
        area: "Deployment UX",
        detail: "실행 / 배포 버튼 및 상태 표시 UI 설계",
      },
      {
        area: "Collaboration Flow",
        detail: "코드 작성, 실행, 협업 흐름을 하나의 웹 환경으로 통합",
      },
      {
        area: "Access Control",
        detail: "권한 관리 화면 및 사용자 역할별 네비게이션 구조 설계",
      },
    ],
  },
  {
    slug: "mattermost-scheduled-messages",
    group: "developer-tools",
    title: "Mattermost 예약 메시지 플러그인",
    tagline: "SSAFY 실습코치 업무 중 개발 · Developer Productivity Tool",
    description:
      "Mattermost 환경에서 예약 메시지 기능을 제공하는 내부 생산성 플러그인입니다.\n\n협업 도구에서 반복적으로 필요한 메시지 예약 기능을 플러그인 형태로 구현하며, WSL 기반 개발 환경과 Make 빌드 흐름을 경험했습니다. 프론트엔드 영역을 담당하여 사용자 입력, 예약 시간 설정, 메시지 전송 UI를 구현했고, Go 기반 백엔드 플러그인 구조와 API 연동 흐름을 이해하며 협업 도구 확장 경험을 쌓았습니다.",
    stack: ["Go", "React", "Mattermost Plugin SDK", "Make", "WSL"],
    responsibilities: [
      {
        area: "Development Environment",
        detail: "WSL 기반 개발 환경 및 Make 빌드 흐름 구성",
      },
      {
        area: "Frontend",
        detail: "사용자 입력, 예약 시간 설정, 메시지 전송 UI 구현",
      },
      {
        area: "Backend Integration",
        detail: "Go 기반 Mattermost 플러그인 구조 이해 및 API 연동",
      },
      {
        area: "Productivity",
        detail: "협업 도구 기능 확장을 통한 내부 생산성 개선 경험",
      },
    ],
  },

  // ── Mobile ─────────────────────────────────────────────────────────────
  {
    slug: "whistlehub",
    group: "mobile",
    title: "WhistleHub",
    tagline: "누구나 쉽게 음악을 만들 수 있는 모바일 앱",
    description:
      "간단한 조작으로 음악을 생성하고 편집할 수 있는 모바일 앱입니다. 사용자 플로우 설계, 화면 구현, API 연동을 담당했습니다.",
    role: "Mobile Developer",
    repoUrl: "github.com/juniqu-e/WhistleHub",
    award: { rank: 1, competition: "SSAFY 12기 특화 프로젝트" },
    stack: ["Android", "REST API", "JNI", "CMAKE", "OBOE"],
  },
  {
    slug: "amoverse",
    group: "mobile",
    title: "Amoverse",
    tagline: "아티스트를 위한 모바일 전시회 앱",
    description:
      "아티스트의 작품을 모바일에서 전시하고 감상할 수 있는 앱입니다. 온디바이스 AI를 활용하여 사용자 경험을 개선했습니다.",
    role: "Mobile / On-device AI Developer",
    repoUrl: "github.com/Amoverse",
    award: { rank: 2, competition: "SSAFY 12기 자율 프로젝트" },
    stack: ["Android", "REST API", "GraphQL", "On-device AI"],
  },
];
