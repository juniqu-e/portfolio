import type { Skill, SkillCategory } from "@/types";

// Source: CONTENT.md §Tech Stack. 카테고리 순서는 정체성 우선 (서버 → 클라우드 → 컨테이너 → 관측 → 네트워크 → 언어·도구).
// 근거 없는 기술은 적지 않는다 (볼트 03 면접 문서 §1 원칙). note = 어디서 썼는지.
// iconSlug → components/ui/Icon.tsx (devicon 브랜드 SVG 또는 Phosphor fallback).

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: "server", label: "Server / OS / Storage" },
  { id: "cloud", label: "Cloud / Edge" },
  { id: "container", label: "Container / Delivery" },
  { id: "observability", label: "Observability / Availability" },
  { id: "network", label: "Network / Security" },
  { id: "languages-tools", label: "Languages & Tools" },
];

export const SKILLS: Skill[] = [
  // Server / OS / Storage
  {
    name: "Linux",
    category: "server",
    iconSlug: "linux",
    note: "홈서버 운영 1년+ · systemd · ufw/iptables · 장애 3건 기록",
  },
  {
    name: "Ubuntu Server",
    category: "server",
    iconSlug: "ubuntu",
    note: "isc-dhcp · BIND · chrony · nginx · SSH · Samba/NFS 구성",
  },
  {
    name: "Windows Server",
    category: "server",
    iconSlug: "windows-server",
    note: "AD DS 포리스트·자식 도메인 · DNS · DHCP Relay · NTP · IIS",
  },
  {
    name: "Storage",
    category: "server",
    iconSlug: "storage",
    note: "RAID-5 · SMB+NTFS · NFS · iSCSI LUN/IQN · MinIO",
  },
  {
    name: "Bash",
    category: "server",
    iconSlug: "bash",
    note: "프로비저닝·배포·자가 복구 스크립트",
  },

  // Cloud / Edge
  {
    name: "Cloudflare",
    category: "cloud",
    iconSlug: "cloudflare",
    note: "Tunnel · DNS · 엣지 TLS · Analytics",
  },
  {
    name: "AWS",
    category: "cloud",
    iconSlug: "aws",
    note: "EKS 가이드 검수·개선 제안 · SAA 준비 중",
  },
  {
    name: "MinIO",
    category: "cloud",
    iconSlug: "minio",
    note: "S3 호환 오브젝트 스토리지 · 볼트 단일 소스",
  },

  // Container / Delivery
  {
    name: "Docker",
    category: "container",
    iconSlug: "docker",
    note: "compose · blue/green 무중단 배포 60회+",
  },
  {
    name: "Kubernetes",
    category: "container",
    iconSlug: "kubernetes",
    note: "PADING 컨테이너 실행·배포 · EKS 가이드 검수",
  },
  { name: "Helm", category: "container", iconSlug: "helm", note: "EKS 배포 가이드 검증" },
  { name: "Argo CD", category: "container", iconSlug: "argo-cd", note: "EKS GitOps 가이드 검증" },
  {
    name: "Jenkins",
    category: "container",
    iconSlug: "jenkins",
    note: "SSAFY 프로젝트 3회 CI · 홈서버 빌드",
  },
  {
    name: "GitHub Actions",
    category: "container",
    iconSlug: "github-actions",
    note: "이 사이트 CI · GHCR 빌드",
  },
  { name: "GitLab CI", category: "container", iconSlug: "gitlab", note: "EKS 배포 가이드 검증" },

  // Observability / Availability
  {
    name: "Prometheus",
    category: "observability",
    iconSlug: "prometheus",
    note: "node/blackbox exporter · 가용성 대시보드",
  },
  {
    name: "Grafana",
    category: "observability",
    iconSlug: "grafana",
    note: "가용성·CPU·요청률 대시보드",
  },
  {
    name: "Nginx",
    category: "observability",
    iconSlug: "nginx",
    note: "리버스 프록시 · 캐시 정책 · NPM",
  },
  {
    name: "HAProxy",
    category: "observability",
    iconSlug: "haproxy",
    note: "L7 로드밸런싱 · 헬스체크",
  },
  {
    name: "keepalived",
    category: "observability",
    iconSlug: "keepalived",
    note: "VRRP · VIP 인계",
  },
  {
    name: "Uptime Kuma",
    category: "observability",
    iconSlug: "uptime-kuma",
    note: "서비스·DNS 감시",
  },

  // Network / Security
  {
    name: "Cisco IOS",
    category: "network",
    iconSlug: "cisco",
    note: "VLAN · STP · OSPF · BGP · CCNA 취득",
  },
  {
    name: "Cisco ASA · VPN",
    category: "network",
    iconSlug: "asa",
    note: "ACL · NAT · IPsec/DMVPN · FTD",
  },
  {
    name: "DNS",
    category: "network",
    iconSlug: "dns",
    note: "AdGuard Home 리졸버 · 실측 기술발표 100점",
  },

  // Languages & Tools
  {
    name: "Python",
    category: "languages-tools",
    iconSlug: "python",
    note: "Flask 서비스 · 운영 도구",
  },
  { name: "Go", category: "languages-tools", iconSlug: "go", note: "Mattermost 플러그인" },
  {
    name: "TypeScript",
    category: "languages-tools",
    iconSlug: "typescript",
    note: "이 사이트 · PADING",
  },
  {
    name: "Kotlin",
    category: "languages-tools",
    iconSlug: "kotlin",
    note: "WhistleHub · Amoverse",
  },
  { name: "Git", category: "languages-tools", iconSlug: "git", note: "PR/MR 리뷰 · 워크트리" },
  { name: "GitHub", category: "languages-tools", iconSlug: "github", note: "" },
  { name: "Jira", category: "languages-tools", iconSlug: "jira", note: "Epic/Story/Sprint" },
  {
    name: "Obsidian",
    category: "languages-tools",
    iconSlug: "obsidian",
    note: "AI 지식관리 워크스테이션 · 위키 165",
  },
];
