import type { EducationEntry } from "@/types";

// Source: CONTENT.md §Education. 최근 과정이 위.

export const EDUCATION: EducationEntry[] = [
  {
    organization: "한국전파진흥협회 (RAPA)",
    course: "클라우드 보안 전문가 양성과정 · 수료 예정",
    period: "2026.07 ~ 2026.12",
    description:
      "네트워크부터 보안, 서버, 클라우드까지 인프라 전 계층을 실장비로 다루는 1,000시간 과정입니다. 매 구간 Final LAB을 직접 구성하고, 수업 내용은 매일 개념 위키와 확인 문항으로 정리하고 있습니다.",
    highlights: [
      {
        area: "네트워크",
        detail:
          "Cisco 스위칭(VLAN · STP · EtherChannel · FHRP)과 라우팅(OSPF · BGP · 재분배) 구성, CCNA 취득",
      },
      {
        area: "보안",
        detail: "ACL, ASA 방화벽 · NAT, IPsec · DMVPN · SSL VPN, FTD · IPS 정책",
      },
      {
        area: "Windows Server",
        detail:
          "AD 포리스트 · 자식 도메인, DNS · DHCP Relay · NTP, RAID-5 · SMB · NFS · iSCSI, IIS · FTP · 메일",
      },
      {
        area: "Linux Server",
        detail: "계정 · 권한, DHCP · BIND · chrony, nginx · SSH, 디스크 · 마운트, Samba · NFS",
      },
      { area: "Cloud", detail: "AWS EC2 · VPC · IAM · 부하분산 · 스토리지" },
    ],
  },
  {
    organization: "삼성 청년 SW·AI 아카데미 (SSAFY)",
    course: "12기 Python 트랙 · 1,600시간 수료",
    period: "2024.07 ~ 2025.06",
    description:
      "비전공으로 개발을 처음 배운 과정입니다. 6주 단위 팀 프로젝트를 세 번 했고, 세 번 모두 발표를 맡아 제가 만들지 않은 부분까지 설명할 수 있도록 시스템 전체를 공부했습니다. 세 프로젝트 모두 반 2등 이상을 수상했습니다.",
    highlights: [
      {
        area: "교육 내용",
        detail: "알고리즘, 웹(Django · Vue · React), 모바일(Android · Kotlin), 데이터베이스",
      },
      {
        area: "CI/CD",
        detail:
          "세 프로젝트 모두 Jenkins 파이프라인, PADING에서 Kubernetes 기반 컨테이너 실행 · 서브도메인 자동 배포 구현",
      },
      {
        area: "팀 프로젝트",
        detail: "PADING 2등 · WhistleHub 1등 · Amoverse 2등 (모바일 팀장 · 아키텍처 설계)",
      },
      { area: "협업", detail: "Git PR 리뷰 · Jira 스프린트 관리, 세 번 모두 발표 담당" },
    ],
  },
];
