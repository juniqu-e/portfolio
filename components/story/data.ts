// /story 전용 데이터. 날짜·수치는 content/*.ts 와 같은 출처(CONTENT.md)에서 가져온다.

export const CAREER_START = "2024-07-01T09:00:00+09:00";

export type Chapter = {
  date: string; // YYYY.MM
  tag: "OK" | "RUN" | "INFO";
  title: string;
  body: string;
};

export const CHAPTERS: Chapter[] = [
  {
    date: "2024.07",
    tag: "INFO",
    title: "SSAFY 12기 입과",
    body: "비전공으로 개발을 처음 배우기 시작. 1,600시간 과정.",
  },
  {
    date: "2025.01",
    tag: "OK",
    title: "PADING",
    body: "컨테이너 위에서 코드가 실행·배포되는 경로를 Kubernetes로 구현. 반 2등.",
  },
  {
    date: "2025.06",
    tag: "OK",
    title: "SSAFY 수료 → 실습코치",
    body: "13·14기 교육생의 개발환경·CI/CD·배포 문제를 1년간 함께 풀었다.",
  },
  {
    date: "2025.10",
    tag: "RUN",
    title: "홈서버 가동",
    body: "리눅스 서버 1대 · 컨테이너 25개 · 인바운드 포트 0으로 도메인 20여 개 공개.",
  },
  {
    date: "2026.07",
    tag: "INFO",
    title: "RAPA 클라우드 보안 과정",
    body: "네트워크 · 보안 · Windows/Linux Server · AWS를 실장비로 다루는 1,000시간.",
  },
  {
    date: "2026.09",
    tag: "OK",
    title: "정보처리기사 · ccna.wnsdlr.com",
    body: "직접 운영하는 문제은행에 실사용자 22명, 5xx 0.02%.",
  },
  {
    date: "2026.10",
    tag: "OK",
    title: "CCNA · 인프라 엔지니어로",
    body: "개발자에서 서버·클라우드를 다루는 인프라 엔지니어로 방향을 정했다.",
  },
  {
    date: "2026.11",
    tag: "RUN",
    title: "VMware VCP",
    body: "다음 목표. 준비 중.",
  },
];

export const BOOT_LOG = [
  "Mounting /home/junik/career ...",
  "Started network-online.target",
  "Started cloudflared.service — tunnel up",
  "Reached target infra-engineer.target",
];

export const MARQUEE = "THANK YOU FOR VISITING · SEE YOU IN PRODUCTION · ";
