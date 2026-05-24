import type { ProjectGroup } from "@/types";

export const PROJECT_GROUPS: { id: ProjectGroup; label: string }[] = [
  { id: "in-progress", label: "In Progress" },
  { id: "in-operation", label: "In Operation" },
  { id: "developer-tools", label: "Developer Tools" },
  { id: "mobile", label: "Mobile" },
];
