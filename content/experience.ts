import type { ExperienceEntry } from "@/types";

// Source: CONTENT.md §Experience. 1글자 일치.
// 배열 기반 — 향후 entry 추가 시 그대로 .push() 가능 (SPEC §Experience AC2).

export const EXPERIENCE: ExperienceEntry[] = [
  {
    organization: "SSAFY",
    role: "SSAFY 13기 · 14기 실습코치",
    period: "2025.06 ~ 현재",
    description:
      "SSAFY 12기 수료 이후 13기와 14기 실습코치로 활동하며, 교육생들이 개발 환경과 협업 도구를 안정적으로 활용할 수 있도록 지원하고 있습니다. 특히 Git, Jira, SSAFY 인프라, 모바일 개발 프로세스처럼 프로젝트 수행 과정에서 반복적으로 마주치는 실무형 도구와 흐름을 중심으로 코치세션을 진행했습니다.",
    duties: [
      {
        area: "코치세션 운영",
        detail:
          "개발자 도구, Git / Jira 활용법, SSAFY 인프라 사용법, 모바일 개발 프로세스 교육",
      },
      {
        area: "생산성 도구 개발",
        detail: "Mattermost 예약 메시지 플러그인 개발 참여 및 프론트엔드 구현",
      },
      {
        area: "인프라 검증",
        detail: "SSAFY Kubernetes 실습 환경의 안정성과 사용성 테스트",
      },
      {
        area: "문서화",
        detail: "임베디드 프로젝트 오픈소스 위키 제작 및 리팩토링",
      },
      {
        area: "교육 자료 제작",
        detail: "비전공자도 이해할 수 있는 AI 강의 교안 제작 지원",
      },
    ],
  },
];
