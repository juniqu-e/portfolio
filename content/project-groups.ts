import type { ProjectGroup } from "@/types";

// 순서 = 정체성 우선. 운영 중인 인프라 → 구축·실습 → 개발 도구 → 모바일(SSAFY 수상작).
export const PROJECT_GROUPS: { id: ProjectGroup; label: string }[] = [
  { id: "in-operation", label: "In Operation" },
  { id: "infra-lab", label: "Infra Build & Lab" },
  { id: "developer-tools", label: "Developer Tools" },
  { id: "mobile", label: "Mobile" },
];
