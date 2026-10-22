import type { CertificationEntry } from "@/types";

// Source: CONTENT.md §Certification. 순서: 정보처리기사 → CCNA → 운전면허 → Running 1개.
// 준비 중인 자격증은 Running 하나만 둔다.

export const CERTIFICATIONS: CertificationEntry[] = [
  { title: "정보처리기사", issuer: "한국산업인력공단", date: "2026.09", status: "acquired" },
  { title: "CCNA 200-301", issuer: "Cisco", date: "2026.10", status: "acquired" },
  {
    title: "자동차운전면허 2종 보통",
    issuer: "부산지방경찰청",
    date: "2021.03",
    status: "acquired",
  },
  {
    title: "VMware VCP (vSphere Foundation 9.0 Administrator)",
    issuer: "Broadcom",
    date: "2026.10",
    status: "acquired",
  },
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "2026.11",
    status: "running",
  },
];
