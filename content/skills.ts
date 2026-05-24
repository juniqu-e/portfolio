import type { Skill, SkillCategory } from "@/types";

// Source: CONTENT.md §Tech Stack. 카테고리 순서는 정체성 우선 (DevOps 최상단).
// iconSlug → Phosphor 컴포넌트 (components/ui/Icon.tsx 의 REGISTRY 참조).
// 공식 브랜드 SVG (Docker/K8s/Helm/Terraform 등) 도입은 Phase 8 follow-up 예정.

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: "devops", label: "DevOps / Platform" },
  { id: "cloud", label: "Cloud / Infrastructure" },
  { id: "languages", label: "Languages" },
  { id: "frontend-mobile", label: "Frontend / Mobile" },
  { id: "backend", label: "Backend" },
  { id: "tools", label: "Tools & Collaboration" },
];

export const SKILLS: Skill[] = [
  // DevOps / Platform
  { name: "Linux", category: "devops", iconSlug: "linux" },
  { name: "Docker", category: "devops", iconSlug: "docker" },
  { name: "Kubernetes", category: "devops", iconSlug: "kubernetes" },
  { name: "Nginx", category: "devops", iconSlug: "nginx" },
  { name: "Jenkins", category: "devops", iconSlug: "jenkins" },
  { name: "GitHub Actions", category: "devops", iconSlug: "github-actions" },
  { name: "Helm", category: "devops", iconSlug: "helm" },
  { name: "Argo CD", category: "devops", iconSlug: "argo-cd" },
  { name: "OPA / Conftest", category: "devops", iconSlug: "opa" },

  // Cloud / Infrastructure
  { name: "AWS", category: "cloud", iconSlug: "aws" },
  { name: "Terraform", category: "cloud", iconSlug: "terraform" },

  // Languages
  { name: "Python", category: "languages", iconSlug: "python" },
  { name: "TypeScript", category: "languages", iconSlug: "typescript" },
  { name: "JavaScript", category: "languages", iconSlug: "javascript" },
  { name: "Java", category: "languages", iconSlug: "java" },

  // Frontend / Mobile
  { name: "React", category: "frontend-mobile", iconSlug: "react" },
  { name: "Vue", category: "frontend-mobile", iconSlug: "vue" },
  { name: "Android Studio", category: "frontend-mobile", iconSlug: "android" },

  // Backend
  { name: "Django", category: "backend", iconSlug: "django" },
  { name: "Spring", category: "backend", iconSlug: "spring" },

  // Tools & Collaboration
  { name: "Git", category: "tools", iconSlug: "git" },
  { name: "GitHub", category: "tools", iconSlug: "github" },
  { name: "GitLab", category: "tools", iconSlug: "gitlab" },
  { name: "Figma", category: "tools", iconSlug: "figma" },
  { name: "Jira", category: "tools", iconSlug: "jira" },
  { name: "Mattermost", category: "tools", iconSlug: "mattermost" },
  { name: "Slack", category: "tools", iconSlug: "slack" },
];
