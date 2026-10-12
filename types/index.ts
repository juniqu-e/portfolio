// Phase 4 contract types. After Phase 4, this file is locked except for head approval.
// 모든 agent가 동일 타입을 따른다 (AGENTS.md §4).

export type ProjectGroup = "in-operation" | "infra-lab" | "developer-tools" | "mobile";

export type ProjectAward = {
  rank: 1 | 2 | 3;
  competition: string;
};

export type ProjectMetric = { value: string; label: string };

export type Project = {
  slug: string;
  group: ProjectGroup;
  title: string;
  tagline: string;
  description: string;
  period?: string;
  role?: string;
  metrics?: ProjectMetric[];
  repoUrl?: string;
  thumbnail?: string;
  stack: string[];
  award?: ProjectAward;
  responsibilities?: { area: string; detail: string }[];
};

export type SkillCategory =
  | "server"
  | "cloud"
  | "container"
  | "observability"
  | "network"
  | "languages-tools";

export type Skill = {
  name: string;
  category: SkillCategory;
  iconSlug?: string;
  /** 한 줄 근거 — 어디서 썼는지 (title 속성으로 노출) */
  note?: string;
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
  /** 기관·기간 등 보조 정보 */
  detail?: string;
  /** 상태 배지 문구 override (없으면 kind/status로 계산) */
  statusLabel?: string;
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

export type GuestbookStatus = "pending" | "approved" | "deleted";

export type GuestbookAdminEntry = GuestbookEntry & {
  status: GuestbookStatus;
  ipHash: string;
  updatedAt: string;
};

export type GuestbookAdminListResponse = {
  items: GuestbookAdminEntry[];
  nextCursor: number | null;
  counts: { pending: number; approved: number; deleted: number };
};

export type ParaSegment = { text: string; emphasis?: boolean };
export type Paragraph = ParaSegment[];

export type IdentityRow = { label: string; value: string };

export type ProfileNumber = { value: string; label: string; sub?: string };

export type Profile = {
  aboutBody: Paragraph[];
  identitySummary: IdentityRow[];
  /** 운영 기록 — 숫자로 보는 현재 */
  numbers: ProfileNumber[];
};
