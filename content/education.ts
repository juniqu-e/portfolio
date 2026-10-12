import type { EducationEntry } from "@/types";

// Source: CONTENT.md §Education & Certification. 1글자 일치.
// 예정·준비 중인 것은 statusLabel로 그대로 표기한다 — 없는 것을 있다고 쓰지 않는다.

export const EDUCATION: EducationEntry[] = [
  {
    kind: "certification",
    title: "CCNA 200-301",
    status: "completed",
    detail: "Cisco · 2026.10",
  },
  {
    kind: "certification",
    title: "정보처리기사",
    status: "completed",
    detail: "한국산업인력공단 · 2026.09",
  },
  {
    kind: "certification",
    title: "AWS Certified Solutions Architect – Associate",
    status: "in-progress",
    detail: "2026.11 응시 예정",
    statusLabel: "준비 중",
  },
  {
    kind: "certification",
    title: "RHCSA (EX200)",
    status: "in-progress",
    detail: "Red Hat · 리눅스 서버 구간 이후 응시",
    statusLabel: "준비 중",
  },
  {
    kind: "education",
    title: "클라우드 보안 전문가 양성과정",
    status: "in-progress",
    detail:
      "한국전파진흥협회(RAPA) · 2026.07 ~ 2026.12 · 네트워크 · 보안 · Windows/Linux 서버 · AWS 실장비 실습",
    statusLabel: "수료 예정",
  },
  {
    kind: "education",
    title: "SSAFY 12기 Python 트랙",
    status: "completed",
    detail: "삼성 청년 SW·AI 아카데미 · 2024.07 ~ 2025.06 · 팀 프로젝트 3회 전부 수상",
    statusLabel: "수료",
  },
  {
    kind: "education",
    title: "부경대학교 정치외교학과",
    status: "completed",
    detail: "2020.08 졸업",
    statusLabel: "학사",
  },
];
