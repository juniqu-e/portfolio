import type { Project } from "@/types";
import { PROJECTS } from "@/content/projects";

// /story 전용 데이터. 날짜·수치는 content/*.ts 와 같은 출처(CONTENT.md)에서 가져온다.
// 타임라인 11장 (2026-10-14 확정): SSAFY 입과 → PADING → WhistleHub → À moi → 실습코치
// → 홈서버 → RAPA 입과 → AI 지식관리 워크스테이션 → 정보처리기사 → CCNA · 문제은행 → VMware VCP 합격 → AWS SAA 준비.
// 프로젝트 카드는 content/projects.ts 의 항목을 slug 로 끌어와 상세에 그대로 쓴다.

export const CAREER_START = "2024-07-01T09:00:00+09:00";

export type ChapterTag = "OK" | "RUN" | "INFO";

export type ChapterItem = { area: string; detail: string };
export type ChapterLink = { label: string; href: string; external?: boolean };
export type ServiceEntry = {
  name: string;
  role: string;
  /** 공개 주소 — 외부에 열어 둔 서비스만. 관리 도구는 적지 않는다 */
  host?: string;
  mine?: boolean;
};
export type ServiceGroup = { title: string; items: ServiceEntry[] };

export type ChapterDetail = {
  period?: string;
  role?: string;
  award?: string;
  /** 본문 문단 */
  summary?: string[];
  /** 무엇을 했나 — 표 */
  items?: ChapterItem[];
  itemsTitle?: string;
  metrics?: { value: string; label: string }[];
  stack?: string[];
  links?: ChapterLink[];
  /** 홈서버 전용 — 실행 중 서비스 */
  services?: { asOf: string; running: number; groups: ServiceGroup[] };
};

export type Chapter = {
  id: string;
  date: string; // YYYY.MM
  tag: ChapterTag;
  title: string;
  body: string;
  /** 카드 제목 아래에 보이는 주소 */
  url?: string;
  /** content/projects.ts 의 slug — 있으면 상세의 기본값으로 쓴다 */
  projectSlug?: string;
  /** slug 로 가져온 값 위에 덮어쓰는 항목 */
  detail?: ChapterDetail;
};

const bySlug = (slug: string): Project => {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) throw new Error(`story: unknown project slug ${slug}`);
  return p;
};

/** 프로젝트 + 덮어쓰기를 합쳐 모달이 쓰는 최종 상세로 만든다 */
export function resolveDetail(c: Chapter): ChapterDetail {
  if (!c.projectSlug) return c.detail ?? {};
  const p = bySlug(c.projectSlug);
  const base: ChapterDetail = {
    period: p.period,
    role: p.role,
    award: p.award ? `${p.award.competition} · ${p.award.rank}등` : undefined,
    summary: p.description.split("\n\n"),
    items: p.responsibilities,
    itemsTitle: "what i did",
    metrics: p.metrics,
    stack: p.stack,
    links: p.repoUrl
      ? [{ label: p.repoUrl, href: `https://${p.repoUrl}`, external: true }]
      : undefined,
  };
  return { ...base, ...c.detail };
}

// 2026-10-14 `docker ps` 기준. 관리 도구(프록시·컨테이너 관리·CI·웹 SSH)는 이름만 적고 주소는 적지 않는다.
export const HOMESERVER_SERVICES: NonNullable<ChapterDetail["services"]> = {
  asOf: "2026-10-14",
  running: 27,
  groups: [
    {
      title: "직접 만든 것",
      items: [
        { name: "portfolio", role: "이 사이트 (Next.js)", host: "leejunik.com", mine: true },
        { name: "ccna-quiz", role: "CCNA 문제은행 · 동기 22명", host: "ccna.wnsdlr.com", mine: true },
        { name: "rapa-quiz", role: "수업 확인 문항 → 위키 역연결", host: "rapa.wnsdlr.com", mine: true },
        { name: "eip-quiz", role: "정보처리기사 문제 풀이", host: "eip.wnsdlr.com", mine: true },
        { name: "biblequiz", role: "성경 퀴즈", host: "biblequiz.wnsdlr.com", mine: true },
        {
          name: "dijkstra ×2 (+ postgres)",
          role: "개인 통합 관리 서비스 — 운영 · 개발 스택",
          host: "dijkstra315.com",
          mine: true,
        },
      ],
    },
    {
      title: "입구 · 운영",
      items: [
        { name: "cloudflared", role: "Cloudflare Tunnel — 인바운드 포트 0 (systemd)" },
        { name: "nginx-proxy-manager", role: "호스트 19개 라우팅" },
        { name: "watchtower", role: "이미지 자동 갱신 (라벨 기반, 05:00 고정)" },
        { name: "uptime-kuma", role: "서비스 · DNS 감시" },
        { name: "beszel", role: "호스트 · 컨테이너 자원 모니터" },
        { name: "portainer", role: "컨테이너 관리 UI" },
      ],
    },
    {
      title: "네트워크 · 스토리지",
      items: [
        { name: "adguardhome", role: "집 전체 DNS 리졸버 · DoH 업스트림 · 광고 차단" },
        { name: "minio", role: "S3 호환 오브젝트 스토리지 — 볼트 단일 진실 소스" },
        { name: "filebrowser", role: "강의 원본 · 파일 보관 (NAS 대용)", host: "files.wnsdlr.com" },
      ],
    },
    {
      title: "도구",
      items: [
        { name: "jenkins", role: "CI — 개인 서비스 빌드" },
        { name: "n8n", role: "워크플로 자동화" },
        { name: "hoppscotch (+ db)", role: "API 테스트" },
        { name: "termix", role: "웹 SSH 콘솔" },
      ],
    },
  ],
};

export const CHAPTERS: Chapter[] = [
  {
    id: "ssafy",
    date: "2024.07",
    tag: "INFO",
    title: "SSAFY 12기 입과",
    body: "1,600시간 과정으로 개발을 처음 배웠습니다. 프론트엔드부터 모바일, 백엔드, CI/CD 구축을 진행했습니다.",
    detail: {
      period: "2024.07 ~ 2025.06 · 삼성 청년 SW·AI 아카데미 12기 Python 트랙",
      role: "교육생 · 팀 프로젝트 3회 모두 발표 담당",
      summary: [
        "개발을 처음 배운 곳입니다. 프론트엔드에서 시작해 모바일, 백엔드, CI/CD 구축까지 경험했습니다. 처음부터 인프라에 뜻이 있었던 것은 아닙니다.",
        "6주 단위 팀 프로젝트를 세 번 했고 세 번 모두 발표를 맡았습니다. 발표자는 자기가 만들지 않은 부분까지 설명해야 해서, 발표를 맡을 때마다 모르는 영역을 하나씩 더 공부하게 됐습니다. 그게 백엔드와 인프라를 처음 들여다본 계기입니다.",
      ],
      itemsTitle: "what i learned",
      items: [
        { area: "교육 내용", detail: "알고리즘, 웹(Django · Vue · React), 모바일(Android · Kotlin), 데이터베이스" },
        { area: "CI/CD", detail: "세 프로젝트 모두 Jenkins 파이프라인으로 배포. PADING에서 컨테이너 · Kubernetes 환경을 처음 접함" },
        { area: "협업", detail: "Git PR 리뷰 · Jira 스프린트, 세 번 모두 발표 담당" },
      ],
    },
  },
  {
    id: "pading",
    date: "2025.01",
    tag: "OK",
    title: "PADING",
    body: "프론트엔드 개발을 담당했고, 발표를 맡아 백엔드와 인프라에 대한 이해도가 생겼습니다. 컨테이너 환경과 쿠버네티스 환경을 처음 접했습니다.",
    projectSlug: "pading",
    detail: {
      role: "프론트엔드 개발 · 발표",
      summary: [
        "브라우저에서 짝을 이뤄 코딩하는 웹 IDE입니다. 저는 프론트엔드를 담당해 실시간 상태(WebSocket) 화면과 권한 관리 화면, 웹 터미널(Xterm.js) 화면을 만들었습니다. 팀의 인프라는 Jenkins와 Kubernetes였고, 사용자의 개발 환경이 컨테이너로 떠서 서브도메인으로 배포되는 구조였습니다.",
        "발표를 맡으면서 제가 만들지 않은 백엔드와 인프라까지 설명해야 했고, 그 과정에서 컨테이너와 쿠버네티스 환경을 처음 접했습니다. 이때 생긴 이해가 이후 인프라로 관심이 옮겨 가는 출발점이 됐습니다. 웹 터미널에서 Xterm.js에 명령 입력 메서드가 없어 실행 버튼이 동작하지 않자 클립보드 복사 후 paste 이벤트를 트리거해 우회했습니다.",
      ],
      itemsTitle: "what i did",
      items: [
        { area: "프론트엔드", detail: "실시간 상태 관리(WebSocket) 화면 · 권한 관리 · 역할별 네비게이션" },
        { area: "웹 터미널 화면", detail: "Xterm.js 연동, 실행 결과 표시, 입력 제약 우회(paste 이벤트)" },
        { area: "발표 · 학습", detail: "팀 전체 구조(백엔드 · Jenkins · Kubernetes) 설명을 위해 컨테이너 · K8s 환경을 처음 공부" },
      ],
      stack: ["React", "TypeScript", "Xterm.js", "WebSocket", "팀 인프라: Jenkins · Kubernetes"],
    },
  },
  {
    id: "whistlehub",
    date: "2025.03",
    tag: "OK",
    title: "WhistleHub",
    body: "모바일 개발과 발표를 맡았습니다. 그래프 DB 등 데이터베이스에 대한 이해도가 생겼습니다.",
    projectSlug: "whistlehub",
    detail: {
      summary: [
        "간단한 조작으로 음악을 만들고 편집하는 모바일 앱입니다. 인증·세션 관리, 프로필·플레이리스트, API 모듈화(인터페이스·DTO·서비스 계층 분리, 인터셉터 토큰 자동 주입)를 맡았습니다.",
        "ExoPlayer 인스턴스가 삭제되지 않아 생긴 백그라운드 재생·메모리 누수는 Application 클래스에서 싱글톤으로 전역 관리해 해결했습니다. 발표를 맡아 백엔드의 데이터 구조까지 설명하면서 그래프 DB 등 데이터베이스에 대한 이해도가 생겼고, 기획부터 배포까지 서비스가 만들어지는 전체 과정이 눈에 들어오기 시작했습니다.",
      ],
      itemsTitle: "what i did",
      items: [
        { area: "인증 · 세션", detail: "로그인 · 토큰 갱신 · 세션 유지, 인터셉터로 토큰 자동 주입" },
        { area: "API 모듈화", detail: "인터페이스 · DTO · 서비스 계층 분리로 화면과 통신 코드를 떼어 냄" },
        { area: "트러블슈팅", detail: "ExoPlayer 메모리 누수 → Application 싱글톤 전역 관리" },
        { area: "발표", detail: "데이터 구조 · 그래프 DB 포함 서비스 전체를 설명" },
      ],
    },
  },
  {
    id: "amoverse",
    date: "2025.04",
    tag: "OK",
    title: "Amoverse (À moi)",
    body: "모바일 개발자 셋 중 아키텍처 설계와 디자인 패턴을 주도했고, 온디바이스 AI 포스터 제작 기능을 맡았습니다.",
    projectSlug: "amoverse",
    detail: {
      role: "모바일 3명 중 아키텍처 설계 · 디자인 패턴 · 핵심 기능 주도 (공식 직함 없음)",
      summary: [
        "아티스트의 작품을 모바일에서 전시하고 감상하는 앱입니다. 공식 팀장은 따로 있었고 그 외에는 평등한 팀이었지만, 모바일 개발자 셋 중에서 전체 아키텍처(MVVM, GraphQL + REST, 인증·세션)와 디자인 패턴을 정하고 핵심 기능을 맡는 역할을 했습니다. 그만큼 백엔드·인프라 담당자와 자주 이야기해야 했고, 내 파트 밖의 사정을 알아야 내 일이 끝난다는 것을 배운 프로젝트입니다.",
        "AI 생성 포스터의 한글 왜곡 문제는 텍스트 없는 이미지를 생성한 뒤 객체·그리드 복잡도를 회피하는 알고리즘으로 온디바이스에서 텍스트를 배치해 해결했습니다.",
      ],
      itemsTitle: "what i did",
      items: [
        { area: "아키텍처", detail: "MVVM 계층, GraphQL + REST 병행, 인증 · 세션, 라이브러리 선정 등 프로젝트 기본 환경 설계" },
        { area: "On-device AI", detail: "포스터 생성 → 객체 · 그리드 복잡도 회피 알고리즘으로 텍스트 배치" },
        { area: "협업", detail: "백엔드 · 인프라 담당과 인터페이스 합의, 서명 캔버스 등 핵심 화면" },
      ],
    },
  },
  {
    id: "coach",
    date: "2025.06",
    tag: "OK",
    title: "SSAFY 13 · 14기 실습코치",
    body: "13·14기 교육생의 개발환경과 인프라 환경에 대해 제안하고, 기술 세션 발표도 진행했습니다. SSAFY EKS 가이드 검수와 운영 개선안 제안도 해 봤습니다.",
    detail: {
      period: "2025.06 ~ 2026.06 · 두 기수 연속",
      role: "실습코치 — 교육생 개발 · 인프라 기술지원",
      summary: [
        "수료 후 두 기수를 연속으로 지원했습니다. 교육생 팀 프로젝트의 개발환경·CI/CD·배포 문제를 함께 풀고, 컨테이너·CI/CD·웹 서버 같은 주제로 데일리 콘텐츠를 만들었습니다. 프로젝트에서 배운 것을 가장 많이 꺼내 쓴 시기입니다.",
        "교육용 Kubernetes(EKS) 가이드는 읽는 것이 아니라 처음부터 끝까지 직접 따라 하며 검수했습니다. 오탈자 교정에서 멈추지 않고 '클러스터 수준 앱이 필요한 팀은 서버 신청 단계에 미리 포함시키면 문의가 준다', '매 커밋 빌드에 캐싱을 넣으면 대기가 준다' 같은 운영 관점 개선안을 냈고 제안자로 등재됐습니다.",
      ],
      itemsTitle: "what i did",
      items: [
        { area: "K8s 가이드 검수", detail: "EKS · GitLab CI · Argo CD · Helm · Ingress · 인증서 배포 가이드 전 과정 검증, 개선안 9건 (운영 제안 2건 포함)" },
        { area: "프로젝트 기술지원", detail: "13 · 14기 팀의 개발환경 · CI/CD · 배포 문제 지원, 유저 테스트 리포트, 버그 · 개선 등록" },
        { area: "기술 세션 발표", detail: "전국 교육생 대상 2회 — 「모바일 개발 프로세스」(2025.09), 「Samsung Health Data SDK」(2026.04)" },
        { area: "생산성 도구", detail: "Mattermost 예약 메시지 플러그인에 GUI · 파일 첨부 추가 (Go · TypeScript), 매뉴얼 v1/v2" },
      ],
      stack: ["Kubernetes (EKS)", "GitLab CI", "Argo CD", "Helm", "Docker", "Nginx", "Jenkins", "Go", "TypeScript"],
    },
  },
  {
    id: "homeserver",
    date: "2025.10",
    tag: "RUN",
    title: "홈서버 가동",
    body: "제가 진행한 프로젝트를 실제로 띄워 보고 싶어서 서버 한 대를 들였습니다. 인바운드 포트 없이 도메인 20여 개를 공개했습니다.",
    projectSlug: "homeserver",
    detail: {
      metrics: [
        { value: "27", label: "컨테이너 (실행 중)" },
        { value: "20+", label: "도메인" },
        { value: "0", label: "인바운드 포트" },
        { value: "3", label: "장애 기록" },
      ],
      services: HOMESERVER_SERVICES,
    },
  },
  {
    id: "rapa",
    date: "2026.07",
    tag: "INFO",
    title: "RAPA 클라우드 보안 과정 입과",
    body: "1,000시간 가량 네트워크 · 보안 · Windows/Linux Server · AWS · 가상화 학습을 했습니다. 지금까지 개발했던 환경보다 더 로우레벨의 학습을 진행했습니다.",
    detail: {
      period: "2026.07 ~ 2026.12 · 한국전파진흥협회 클라우드 보안 전문가 양성과정",
      role: "교육생 · 매 구간 Final LAB 직접 구성",
      summary: [
        "2026년 7월에 시작한 1,000시간 과정입니다. 네트워크(Cisco 스위칭·라우팅)에서 보안(ACL · ASA · VPN · FTD), Windows Server와 Linux Server, AWS, 그리고 10월부터 vSphere 가상화까지 인프라 전 계층을 실장비로 다룹니다. 개발에 쏟은 시간을 주 무기로 쓰지 못하게 된다는 것을 알면서 고른 길입니다. 로우레벨을 이해하면 세상의 시스템이 어떻게 돌아가는지 이해하는 데 도움이 된다고 생각했습니다.",
        "매일 수업이 끝나면 강의 자료와 필기를 개념 위키로 정리하고 확인 문항 20개를 만들어 풉니다. 이 과정 중에 정보처리기사와 CCNA를 취득했습니다.",
      ],
      itemsTitle: "curriculum",
      items: [
        { area: "네트워크", detail: "Cisco 스위칭(VLAN · STP · EtherChannel · FHRP) · 라우팅(OSPF · BGP · 재분배)" },
        { area: "보안", detail: "ACL, ASA 방화벽 · NAT, IPsec · DMVPN · SSL VPN, FTD · IPS 정책" },
        { area: "Windows Server", detail: "AD 포리스트 · 자식 도메인, DNS · DHCP Relay · NTP, RAID-5 · SMB · NFS · iSCSI, IIS · FTP · 메일" },
        { area: "Linux Server", detail: "계정 · 권한, DHCP · BIND · chrony, nginx · SSH, 디스크 · 마운트, Samba · NFS" },
        { area: "가상화 · Cloud", detail: "vSphere ESXi · vCenter (진행 중) · AWS EC2 · VPC · IAM · 부하분산 · 스토리지" },
      ],
    },
  },
  {
    id: "vault",
    date: "2026.08",
    tag: "RUN",
    title: "AI 지식관리 워크스테이션 구축",
    body: "기록을 보다 효율적으로 하기 위해 만들었습니다. 정리와 조합은 AI에게 맡기고, MinIO를 단일 소스로 양방향 동기화를 했습니다.",
    projectSlug: "ai-knowledge-workstation",
    detail: {
      summary: [
        "기록을 더 효율적으로 하기 위해 만든 시스템입니다. 기록하고 정리하고 흩어진 정보를 엮는 일은 AI에게 맡기고, 저는 그날 배운 것과 겪은 문제와 떠오른 생각을 계속 넣습니다.",
        "하루 8시간 과정의 강의 자료·필기·실습 캡처가 매일 개념 단위로 정리되고, 모든 문장에 출처가 남고, 그날 배운 것으로 확인 문항 20개가 만들어집니다. MinIO 버킷을 단일 진실 소스로 두고 Obsidian(사람)과 Claude Code(AI)가 같은 볼트를 rclone bisync로 양방향 동기화하며 편집합니다. Git은 되돌리기가 아니라 텍스트 이력 백업만 맡습니다.",
        "동기화는 flock으로 동시 실행을 막고 systemd 타이머가 1시간마다 돌립니다. 규칙 문서 한 장이 AI의 동작 전체를 통제합니다. 폴더별 쓰기 권한, 이미지 명명 규칙, 출처 표기 형식을 명시하자 결과가 재현됐고, 확인 문항은 직접 만든 사이트(rapa.wnsdlr.com)에서 풀고 오답을 위키 개념과 연결합니다.",
      ],
      links: [{ label: "rapa.wnsdlr.com", href: "https://rapa.wnsdlr.com", external: true }],
    },
  },
  {
    id: "eip",
    date: "2026.09",
    tag: "OK",
    title: "정보처리기사",
    body: "정보처리기사 실기가 어려워 문제은행 사이트를 처음 만들어 봤습니다. 문제는 AI로 생성했습니다.",
    detail: {
      period: "2026.09 취득 · 한국산업인력공단",
      summary: [
        "국가기술자격 정보처리기사입니다. 실기가 어려워서 문제를 풀고 채점하고 오답을 모으는 사이트(eip.wnsdlr.com)를 처음 만들어 봤습니다. 문제는 AI로 생성한 뒤 직접 검토했습니다.",
        "틀린 문제를 유형별로 기록해 보는 방식은 CCNA 준비와 지금의 학습 시스템에 그대로 이어졌습니다.",
      ],
      links: [{ label: "eip.wnsdlr.com", href: "https://eip.wnsdlr.com", external: true }],
    },
  },
  {
    id: "ccna",
    date: "2026.10",
    tag: "OK",
    title: "CCNA · 문제은행",
    url: "ccna.wnsdlr.com",
    body: "시험 12일 전 만든 문제은행을 동기 22명이 썼습니다. 사람별 기록 · 무중단 배포 · LAB 터미널.",
    projectSlug: "ccna-quiz",
    detail: {
      period: "2026.09.22 ~ 10.03 운영 · CCNA 200-301 2026.10.02 취득",
      role: "기획 · 개발 · 배포 · 운영 전담",
    },
  },
  {
    id: "vcp",
    date: "2026.10",
    tag: "OK",
    title: "VMware VCP 합격",
    body: "가상화 수업 열흘째에 응시해 합격했습니다. 중첩 ESXi 4대 설치부터 vCenter, 가상 네트워크, 스토리지까지 실장비로 익힌 뒤였습니다.",
    detail: {
      period: "2026.10.22 합격 · VMware vSphere Foundation 9.0 Administrator (2V0-16.25) · 인증서 발급 대기",
      role: "RAPA 클라우드 보안 전문가 양성과정 가상화 구간 (2026.10.13 ~)",
      summary: [
        "RAPA 과정의 서버 가상화 구간이 10월 13일에 시작됐고, 열흘 뒤인 10월 22일에 시험을 봐서 합격했습니다. 중첩 ESXi 8.0 3대와 7.0 1대를 직접 설치하고, VCSA 설치와 VAMI 관리, vSS·vDS와 VLAN, NFS·iSCSI 데이터스토어, KVM까지 수업으로 다룬 범위를 그대로 시험 범위와 겹쳐 놓고 준비했습니다.",
        "팀 프로젝트에서 vSphere 위 VM 8대로 로드밸런서 이중화를 구성해 본 경험이 있어서, 시험 공부가 개념 암기보다 이미 만져 본 것을 정리하는 쪽에 가까웠습니다. 인증서는 VMware 쪽 발급을 기다리고 있습니다.",
      ],
      itemsTitle: "covered",
      items: [
        { area: "호스트", detail: "ESXi 설치 · DCUI · Host Client · VMFS6 · esxcli" },
        { area: "vCenter", detail: "VCSA 설치 · 라이선스 · VAMI(Time · Firewall · Syslog · Backup) · 권한" },
        { area: "네트워크 · 스토리지", detail: "vSS · vDS · VLAN · 보안 정책 · Teaming · NFS · iSCSI" },
      ],
    },
  },
  {
    id: "saa",
    date: "2026.11",
    tag: "RUN",
    title: "AWS SAA 준비",
    body: "다음 목표입니다. 직접 만든 학습 플랫폼에 문제은행을 올려 두고 준비합니다.",
    detail: {
      period: "2026.11 목표 · AWS Certified Solutions Architect – Associate",
      role: "준비 중",
      summary: [
        "퍼블릭 클라우드로 범위를 넓히는 다음 칸입니다. 홈서버에서 운영 중인 학습 플랫폼에 AWS SAA 과목을 추가해 두고, 과정의 AWS 구간(EC2 · VPC · IAM · 부하분산 · 스토리지)과 겹쳐서 준비합니다.",
        "당장의 방향은 인프라·서버·시스템 엔지니어입니다. 서버에서 클라우드로, 장기적으로는 사람들이 더 쉽게 만들고 돌릴 수 있는 바탕을 짜는 영역까지 넓히려 합니다. 아직 기본기를 쌓는 중이고, 그 순서를 건너뛰지 않는 것도 선택의 일부입니다.",
      ],
      itemsTitle: "on the way",
      items: [
        { area: "클라우드", detail: "AWS EC2 · VPC · IAM · 부하분산 · 스토리지 — SAA 준비" },
        { area: "컨테이너", detail: "홈서버에 k3s를 올려 PADING을 직접 재배포하는 것이 다음 과제" },
        { area: "리눅스", detail: "Ubuntu로 서버 서비스 재구성 중 · RHCSA 준비" },
      ],
    },
  },
];

export const BOOT_LOG = [
  "Mounting /home/junik/career ...",
  "Started network-online.target",
  "Started cloudflared.service — tunnel up",
  "Reached target infra-engineer.target",
];

export const MARQUEE = "THANK YOU FOR VISITING · SEE YOU IN PRODUCTION · ";
