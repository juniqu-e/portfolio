import type { Profile } from "@/types";

// Source: CONTENT.md §About Me + §정체성 요약 표. 텍스트 1글자도 수정 X.
// Bold 강조는 CONTENT.md의 `**...**` 표기를 ParaSegment.emphasis=true로 보존한다.

export const PROFILE: Profile = {
  aboutBody: [
    [
      {
        text: "반복되는 작업은 자동화하고, 팀의 흐름은 부드럽게 만들며, 마지막에는 안정적으로 운영 가능한 서비스를 남기는 개발자를 지향합니다.",
      },
    ],
    [
      { text: "현재 " },
      { text: "SSAFY 13기 · 14기 실습코치", emphasis: true },
      {
        text: "로 활동하고 있으며 교육생들이 개발 도구, 협업 프로세스, 인프라 환경을 자연스럽게 사용할 수 있도록 돕고 있습니다.",
      },
    ],
    [
      { text: "개발자가 기능 구현에 집중할 수 있는 " },
      { text: "자동화된 워크플로우", emphasis: true },
      { text: ", " },
      { text: "신뢰할 수 있는 배포 환경", emphasis: true },
      { text: ", " },
      { text: "명확한 운영 문서", emphasis: true },
      { text: "를 만드는 데 관심이 많습니다." },
    ],
  ],
  identitySummary: [
    { label: "Role", value: "DevOps / Platform Engineer 지향" },
    {
      label: "Interest",
      value: "Developer Productivity, CI/CD, Kubernetes, Internal Developer Platform",
    },
    { label: "Current", value: "SSAFY 13기 · 14기 실습코치 (2025.06 ~ 현재)" },
    { label: "Certification", value: "CKA (진행중), 정보처리기사 (취득)" },
    {
      label: "Motto",
      value: "Try the code, Catch the people, Finally make it reliable.",
    },
  ],
};
