import type { Skill, SkillCategory } from "@/types";

// Source: CONTENT.md §Tech Stack. 4개 그룹만 — 인프라 → 운영 → 언어 → 협업 도구.
// iconSlug → components/ui/Icon.tsx (devicon 브랜드 SVG).

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: "infra", label: "Server / Cloud" },
  { id: "operations", label: "Operations" },
  { id: "languages", label: "Languages" },
  { id: "tools", label: "Tools" },
];

export const SKILLS: Skill[] = [
  // Server / Cloud
  { name: "Linux", category: "infra", iconSlug: "linux" },
  { name: "Windows Server", category: "infra", iconSlug: "windows-server" },
  { name: "Docker", category: "infra", iconSlug: "docker" },
  { name: "Kubernetes", category: "infra", iconSlug: "kubernetes" },
  { name: "AWS", category: "infra", iconSlug: "aws" },
  { name: "Cloudflare", category: "infra", iconSlug: "cloudflare" },

  // Operations
  { name: "Nginx", category: "operations", iconSlug: "nginx" },
  { name: "Jenkins", category: "operations", iconSlug: "jenkins" },
  { name: "Prometheus", category: "operations", iconSlug: "prometheus" },
  { name: "Grafana", category: "operations", iconSlug: "grafana" },

  // Languages
  { name: "Python", category: "languages", iconSlug: "python" },
  { name: "JavaScript", category: "languages", iconSlug: "javascript" },
  { name: "Java", category: "languages", iconSlug: "java" },

  // Tools
  { name: "Git", category: "tools", iconSlug: "git" },
  { name: "Jira", category: "tools", iconSlug: "jira" },
  { name: "Notion", category: "tools", iconSlug: "notion" },
  { name: "Slack", category: "tools", iconSlug: "slack" },
  { name: "Mattermost", category: "tools", iconSlug: "mattermost" },
  { name: "Figma", category: "tools", iconSlug: "figma" },
];
