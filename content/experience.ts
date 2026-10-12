import type { ExperienceEntry } from "@/types";

// Source: CONTENT.md §Experience. 1글자 일치.
// 실습코치 1년은 "교육"이 아니라 IT 유관 경력으로 쓴다. 인프라 관련 업무를 앞에 둔다.

export const EXPERIENCE: ExperienceEntry[] = [
  {
    organization: "SSAFY (삼성 청년 SW·AI 아카데미)",
    role: "13기 · 14기 실습코치 — 교육생 개발·인프라 기술지원",
    period: "2025.06 ~ 2026.06",
    description:
      "SSAFY 12기 수료 후 두 기수를 연속으로 지원했습니다. 교육생 팀 프로젝트의 개발환경·CI/CD·배포 문제를 함께 풀고, 교육용 Kubernetes(EKS) 가이드를 직접 따라 하며 검증해 운영 관점의 개선안을 제출했습니다. 전국 교육생 대상 기술 세션을 두 차례 진행했고, 삼성전자 AI 전문가 과정 교안 13개 차시를 제작했습니다.",
    duties: [
      {
        area: "K8s 가이드 검수",
        detail:
          "EKS · GitLab CI · Argo CD · Helm · Ingress · 인증서 기반 배포 가이드를 끝까지 따라 하며 검증. 클러스터 앱 서버 신청 절차 개선, 빌드 캐싱 도입 등 운영 개선안 제안자로 등재",
      },
      {
        area: "프로젝트 기술지원",
        detail:
          "13·14기 팀 프로젝트의 개발환경·CI/CD·배포 문제 지원, 유저 테스트 리포트 작성, 버그·개선 사항 등록",
      },
      {
        area: "기술 세션 발표",
        detail:
          "전국 교육생 대상 2회 — 「모바일 개발 프로세스」(2025.09), 「Samsung Health Data SDK」(2026.04)",
      },
      {
        area: "교안 제작",
        detail:
          "삼성전자 AI 전문가 과정 13개 차시 — LangChain · 자연어처리 · 이미지 파운데이션 모델 · Agent",
      },
      {
        area: "생산성 도구 개발",
        detail:
          "Mattermost 예약 메시지 플러그인에 GUI·파일 첨부 기능 추가 (Go · TypeScript), 매뉴얼 v1/v2 작성",
      },
    ],
  },
];
