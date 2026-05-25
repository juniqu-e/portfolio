// Phase 4 contract types. After Phase 4, this file is locked except for head approval.
// 모든 agent가 동일 타입을 따른다 (AGENTS.md §4).

export type ProjectGroup = "in-progress" | "in-operation" | "developer-tools" | "mobile";

export type ProjectAward = {
  rank: 1 | 2 | 3;
  competition: string;
};

export type Project = {
  slug: string;
  group: ProjectGroup;
  title: string;
  tagline: string;
  description: string;
  role?: string;
  repoUrl?: string;
  thumbnail?: string;
  stack: string[];
  award?: ProjectAward;
  responsibilities?: { area: string; detail: string }[];
};

export type SkillCategory =
  | "devops"
  | "cloud"
  | "languages"
  | "frontend-mobile"
  | "backend"
  | "tools";

export type Skill = {
  name: string;
  category: SkillCategory;
  iconSlug?: string;
};

export type ExperienceEntry = {
  organization: string;
  role: string;
  period: string;
  description: string;
  duties: { area: string; detail: string }[];
};

export type AwardEntry = {
  year: number;
  category: string;
  rank: 1 | 2 | 3;
  project: string;
};

export type EducationKind = "certification" | "education";
export type EducationStatus = "in-progress" | "completed";

export type EducationEntry = {
  kind: EducationKind;
  title: string;
  status: EducationStatus;
};

export type GuestbookEntry = {
  id: number;
  name: string | null;
  body: string;
  createdAt: string;
};

export type GuestbookListResponse = {
  items: GuestbookEntry[];
  nextCursor: number | null;
};

export type ParaSegment = { text: string; emphasis?: boolean };
export type Paragraph = ParaSegment[];

export type IdentityRow = { label: string; value: string };

export type Profile = {
  aboutBody: Paragraph[];
  identitySummary: IdentityRow[];
};
