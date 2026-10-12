import type { Project } from "@/types";

// Source: CONTENT.md §Featured Projects. 텍스트는 CONTENT.md 그대로.
// 원칙 (볼트 포트폴리오 마스터): 측정한 숫자만 쓴다. "구축했다"와 "설계했다"를 구분한다. 팀 성과와 내 몫을 분리한다.
// description = 본문 prose. 줄바꿈 \n\n 으로 paragraph 구분. metrics = 카드·모달에 보이는 숫자.

export const PROJECTS: Project[] = [
  // ── In Operation ───────────────────────────────────────────────────────
  {
    slug: "homeserver",
    group: "in-operation",
    title: "홈서버 인프라",
    tagline: "리눅스 서버 1대 · 컨테이너 25개 · 포트포워딩 없이 도메인 20여 개 공개",
    period: "2025.10 ~ 운영 중",
    role: "설계 · 구축 · 운영 전담",
    metrics: [
      { value: "25", label: "컨테이너" },
      { value: "20+", label: "도메인" },
      { value: "0", label: "인바운드 포트" },
      { value: "3", label: "장애 기록" },
    ],
    description:
      "집에 있는 Ubuntu 서버 한 대 위에 직접 만든 서비스와 오픈소스를 Docker로 올리고, Cloudflare Tunnel로 외부에 공개하는 개인 인프라입니다. 서버가 아웃바운드로 엣지에 붙으므로 공유기에 여는 포트가 0개이고 공인 IP가 DNS에 드러나지 않습니다.\n\nNginx Proxy Manager가 호스트별 라우팅을, AdGuard Home이 집 전체 DNS 리졸버(DoH 업스트림·광고 차단)를, MinIO가 S3 호환 오브젝트 스토리지를 맡습니다. Uptime Kuma로 서비스·DNS를 감시하고, Jenkins·Watchtower로 빌드와 갱신을 돌립니다. 이 사이트도 같은 서버에서 GitHub Actions → GHCR → Watchtower 흐름으로 배포됩니다.\n\n운영하면서 겪은 장애는 증상·원인·조치·재발 방지로 기록합니다. Docker 자동 갱신이 iptables FORWARD 규칙을 지워 전 도메인이 내려간 장애는 2분 주기 자가 복구 타이머로 재발 0건, 고아 docker-proxy의 80번 포트 점유로 전 도메인 502가 난 장애는 포트 점유 확인 절차로, 데스크톱 환경 설치 후 netplan 렌더러가 바뀌어 재부팅 시 네트워크가 죽은 장애는 렌더러 고정으로 막았습니다.",
    stack: [
      "Ubuntu 24.04",
      "Docker Compose",
      "Cloudflare Tunnel",
      "Nginx Proxy Manager",
      "AdGuard Home",
      "MinIO",
      "Uptime Kuma",
      "Jenkins",
      "systemd timer",
      "ufw / iptables",
    ],
    responsibilities: [
      {
        area: "외부 공개 구조",
        detail:
          "Cloudflare Tunnel(http2 고정, IPv4 엣지) → NPM → 컨테이너. 포트포워딩 0, 엣지 TLS 종단, 호스트 밖 평문 0",
      },
      {
        area: "내부 DNS",
        detail:
          "AdGuard Home을 LAN 리졸버로 — DoH 업스트림 2개 + ISP 자사 리졸버 bootstrap, 회선 실측으로 업스트림 순서 결정",
      },
      {
        area: "장애 대응 · 자가 복구",
        detail:
          "iptables 규칙 소실을 2분 주기 systemd 타이머가 멱등하게 복구, 고아 프로세스 포트 점유·netplan 렌더러 함정 절차화",
      },
      {
        area: "스토리지 · 동기화",
        detail:
          "MinIO 버킷을 단일 소스로 Obsidian 볼트를 rclone bisync + flock 타이머로 양방향 동기화",
      },
      {
        area: "운영 문서",
        detail:
          "포트 할당 규칙, 서비스별 README, 장애 런북(전 도메인 502 · 1033 · DNS 단절)을 저장소에 유지",
      },
    ],
  },
  {
    slug: "ccna-quiz",
    group: "in-operation",
    title: "ccna.wnsdlr.com — CCNA 문제은행",
    tagline:
      "시험 12일 전에 만든 문제 풀이 사이트를 동기 22명이 61,328번 풀었고, 배포 60회는 전부 무중단",
    period: "2026.09 ~ 운영 중",
    role: "기획 · 개발 · 배포 · 운영 전담",
    repoUrl: "ccna.wnsdlr.com",
    metrics: [
      { value: "22명", label: "실사용자" },
      { value: "61,328", label: "문제 풀이" },
      { value: "0.02%", label: "5xx (21만 요청)" },
      { value: "60+", label: "무중단 배포" },
    ],
    description:
      'CCNA 200-301 문항 616개를 풀고·채점하고·오답을 모으는 웹 서비스입니다. 혼자 쓰려고 만들었는데 동기들이 쓰기 시작해 프로필별로 기록이 분리되는 다중 사용자 서비스가 됐고, 12일 동안 하루 최대 13,889회 풀이를 홈서버 한 대(N100 4코어)에서 CPU 1~2%로 처리했습니다.\n\n배포는 새 컨테이너를 먼저 띄워 healthz를 확인한 뒤 Docker DNS 별칭을 옮기는 blue/green 방식입니다. NPM 프록시가 resolver valid=1s로 매 요청마다 별칭을 다시 해석하므로 사용자는 교체를 느끼지 못합니다. 옛 컨테이너는 별칭에서 뺀 뒤 진행 중 요청을 마저 처리하고 내려갑니다.\n\n"사이트가 느려졌다"는 신고에는 서버를 키우기 전에 앱(2~11ms) → 컨테이너(CPU 1~2%) → 호스트(load 0.3) → 네트워크(터널 왕복 250ms) 순으로 측정해, 원인이 서버가 아니라 하루 25회 배포마다 캐시가 날아가는 습관임을 찾았습니다. 정적 파일 1년 캐시와 배포 묶기로 해결했고, 브라우저 의존적인 HTML5 Drag&Drop은 Pointer Events로 재구현한 뒤 헤드리스 크롬 시나리오 9개로 배포마다 검증했습니다.',
    stack: [
      "Python Flask",
      "gunicorn",
      "SQLite WAL",
      "Vanilla JS SPA",
      "Docker",
      "Nginx Proxy Manager",
      "Cloudflare Tunnel",
      "headless Chrome CDP",
    ],
    responsibilities: [
      {
        area: "무중단 배포",
        detail:
          "blue/green 스크립트 — 새 컨테이너 healthz 통과 → 네트워크 별칭 이전 → 옛 컨테이너 drain 후 종료. 60회 이상 사용자 체감 0",
      },
      {
        area: "성능 진단",
        detail:
          "층별 측정으로 '느리다'의 원인을 배포 습관으로 특정, 캐시 정책(immutable 1년 · 데이터 5분 · 버전 API no-store) 설계",
      },
      {
        area: "운영 품질",
        detail: "덤프 정답 이의제기 전수 검증 → 22문항 정정, 패치노트 17회, 새 버전 알림 띠",
      },
      {
        area: "검증 자동화",
        detail:
          "배포 전 테스트 컨테이너에서 CDP 마우스 시나리오 9개 자동 실행 → 운영 배포 → 운영 URL 재검증",
      },
      {
        area: "데이터 파이프라인",
        detail:
          "Obsidian 볼트의 문제은행 마크다운 → 빌드 스크립트 → 읽기 전용 JSON, mtime 감지로 재시작 없이 반영",
      },
    ],
  },
  {
    slug: "ai-knowledge-workstation",
    group: "in-operation",
    title: "AI 지식관리 워크스테이션",
    tagline: "사람과 AI가 같은 Obsidian 볼트를 동시에 편집해도 깨지지 않는 기록 시스템",
    period: "2026.08 ~ 운영 중",
    role: "설계 · 구축 · 운영 전담",
    metrics: [
      { value: "50+", label: "강의노트" },
      { value: "165", label: "개념 위키" },
      { value: "1,000+", label: "확인 문항" },
      { value: "0", label: "동기화 실패" },
    ],
    description:
      "하루 8시간 과정의 강의 자료·필기·실습 캡처를 매일 개념 단위로 정리하기 위해 만든 개인 지식관리 시스템입니다. MinIO 버킷을 단일 진실 소스로 두고, Obsidian(사람)과 Claude Code(AI)가 같은 볼트를 rclone bisync로 양방향 동기화하며 편집합니다. Git은 되돌리기가 아니라 텍스트 이력 백업만 맡습니다.\n\n동기화는 flock으로 동시 실행을 막고 systemd 타이머가 1시간마다 돌립니다. 충돌 정책(newer 우선·패자 보존), 로컬 전용 파일 필터(.obsidian · .git), 중단 세션 자동 복구를 정해 두었고, 편집 중 타이머가 겹쳐 충돌 사본이 생긴 사례는 장애 기록으로 남겨 운영 규칙에 반영했습니다.\n\n규칙 문서 한 장이 AI의 동작 전체를 통제합니다. 폴더별 쓰기 권한, 이미지 명명 규칙, 출처 표기 형식을 명시하자 결과가 재현됐고, 출처 줄에서 '무엇을 정리했고 무엇을 안 했는지'를 매번 계산하므로 별도 대장이 필요 없습니다. 그날 강의로 확인 문항 20개를 만들어 직접 만든 사이트(rapa.wnsdlr.com)에서 풀고 오답을 위키 개념과 연결하는 흐름까지 이어집니다.",
    stack: [
      "Obsidian",
      "MinIO",
      "rclone bisync",
      "systemd timer",
      "flock",
      "Git",
      "Claude Code",
      "Python",
    ],
    responsibilities: [
      {
        area: "단일 진실 소스",
        detail:
          "MinIO = 현재 상태의 진실(바이너리 포함, 버저닝 7일), Git = 텍스트 이력. 역할을 갈라 충돌을 없앰",
      },
      {
        area: "동기화 운영",
        detail:
          "vault-sync 스크립트 — flock 배타 제어, 1시간 타이머, 충돌 정책, 필터, 실패 시 resync 안내 로그",
      },
      {
        area: "원본 → 정리본 파이프라인",
        detail:
          "docx·pptx·hwp에서 텍스트·이미지를 추출하고 본문 위치를 복원해 정리본에 같은 자리로 임베드",
      },
      {
        area: "규칙 문서",
        detail:
          "AI 행동 규칙 1장 — 폴더 권한 · 명명 규칙 · 출처 형식. 운영 표준·인수인계 문서와 같은 성격",
      },
      {
        area: "상시 검증",
        detail: "깨진 임베드·위키링크·충돌 사본을 스크립트로 점검 (현재 0건)",
      },
    ],
  },

  // ── Infra Build & Lab ──────────────────────────────────────────────────
  {
    slug: "ha-web-infra",
    group: "infra-lab",
    title: "웹 서비스 가용성 인프라",
    tagline:
      "같은 웹 서버를 로드밸런서 유무로만 나눠, 공격과 장애 상황에서 서비스 지속성 차이를 측정",
    period: "2026.09 · 약 3주 · 3명",
    role: "가용성 설계 · 구축 · 시연 전담",
    description:
      "VM 7대(web ×3, lb ×2, victim, attacker)와 별도 monitor로 구성한 팀 과제입니다. HAProxy를 HTTP 모드(L7)로 두어 포트는 열렸지만 앱이 죽은 상태를 헬스체크로 잡고, keepalived VRRP로 로드밸런서 2대가 VIP를 인계하게 했습니다. victim은 web과 같은 nginx·같은 설정의 단일 서버라 결과 차이가 자원이 아니라 구조에서만 나오도록 통제했습니다.\n\n부하 시험 중 웹 서버 한 대를 내리면 남은 서버가 있는데도 VIP가 간헐적으로 응답하지 않는 현상이 있었습니다. HAProxy 통계 페이지에서 부하 중 백엔드가 UP/DOWN을 반복하는 것을 확인했고, 헬스체크가 gzip 처리로 CPU를 쓰는 실제 서비스 경로(GET /)를 1초 간격 2회 실패 기준으로 보고 있어 바쁜 서버를 죽은 서버로 판정해 풀이 비는 순간 503이 난 것이 원인이었습니다. 부하와 무관한 경량 /healthz 경로를 분리하고 판정을 완화하는 조치를 정리했습니다.\n\nProvisioning은 역할별 Bash 스크립트로 멱등하게 작성했고, Prometheus·Grafana(node_exporter · blackbox_exporter)로 가용성·CPU·요청률을 실시간으로 보며 HTTP Flood·Slowloris 상황을 단일 서버와 대조 시연했습니다.",
    stack: [
      "HAProxy (L7)",
      "keepalived (VRRP)",
      "Nginx",
      "Prometheus",
      "Grafana",
      "blackbox_exporter",
      "Bash",
      "wrk · slowhttptest",
    ],
    responsibilities: [
      {
        area: "구성 설계",
        detail: "VM 7대 역할 설계, 고정 IP, 역할별 프로비저닝 스크립트(멱등 실행)",
      },
      {
        area: "로드밸런싱 · 이중화",
        detail: "HAProxy mode http + 헬스체크, keepalived MASTER/BACKUP VIP 인계",
      },
      {
        area: "관측",
        detail: "Prometheus · Grafana 스택, 가용성·CPU·요청률 대시보드",
      },
      {
        area: "트러블슈팅",
        detail: "부하 중 VIP 503 — 헬스체크 경로·판정 기준을 원인으로 특정, /healthz 분리",
      },
    ],
  },
  {
    slug: "windows-server-services",
    group: "infra-lab",
    title: "Windows Server 서비스 구축",
    tagline:
      "AD 포리스트·자식 도메인부터 DNS · DHCP Relay · NTP · RAID-5 · SMB · NFS · iSCSI까지 한 토폴로지에",
    period: "2026.09 ~ 2026.10 · RAPA 실습",
    role: "단독 구성 (Final LAB)",
    description:
      "서버 5대 토폴로지에서 Active Directory 포리스트와 자식 도메인, Site·그룹 범위·GPO를 구성하고, DNS 위임·전달자·라운드로빈, DHCP 범위 2개와 라우터 helper를 통한 Relay, NTP 계층을 올렸습니다. IIS는 Host 헤더로 한 IP에 사이트 3개를, SAN 인증서로 HTTPS를, FTP는 AD 계정별 권한을 구성했습니다.\n\n스토리지는 디스크 4장으로 RAID-5를 만들고 그 위에 부서별 SMB 공유(공유 권한 ∩ NTFS 권한), IP별 읽기·쓰기를 나눈 NFS, IQN으로 손님을 분리한 iSCSI LUN 2개를 올렸습니다. 같은 LUN을 두 서버에 동시에 붙여 파일시스템이 깨지는 것까지 직접 확인해, 블록 스토리지를 여러 서버가 공유하려면 왜 클러스터 파일시스템과 잠금 조율이 필요한지 몸으로 이해했습니다.",
    stack: [
      "Windows Server",
      "Active Directory",
      "DNS · DHCP · NTP",
      "IIS · FTP · hMailServer",
      "RAID-5",
      "SMB · NTFS",
      "NFS",
      "iSCSI",
      "PowerShell",
    ],
    responsibilities: [
      {
        area: "디렉터리",
        detail:
          "포리스트 루트 + 자식 도메인, Site 2개·서브넷, 그룹 범위 3종, GPO 드라이브 맵·보안 필터링",
      },
      {
        area: "네트워크 서비스",
        detail: "DNS 위임·조건부 전달자·MX, DHCP 범위·예약·Relay(helper), NTP 계층",
      },
      {
        area: "스토리지",
        detail:
          "RAID-5 · SMB 부서별 권한 · NFS IP별 R/W·RO · iSCSI LUN 2개 IQN 분리 · 동시 연결 손상 재현",
      },
      {
        area: "애플리케이션",
        detail: "IIS 다중 사이트(Host 헤더) · HTTPS SAN 인증서 · FTP 권한 · 도메인 간 메일",
      },
    ],
  },
  {
    slug: "linux-server-services",
    group: "infra-lab",
    title: "Linux 서버 서비스 구축",
    tagline:
      "Windows에서 올린 서비스를 Ubuntu로 다시 — DHCP · BIND · chrony · nginx · SSH · Samba · NFS",
    period: "2026.10 ~ 진행 중 · RAPA 실습",
    role: "단독 구성 · RHCSA 준비 겸",
    description:
      "같은 요구사항을 Ubuntu Server로 다시 구성하는 과정입니다. 사용자·그룹·권한(usermod -aG의 함정, /etc/shadow)과 SSH부터 시작해, isc-dhcp-server로 VLAN 2개에 주소를 배포하고, BIND9를 캐시 DNS → Master(pod71.com) → Recursive 끄기 → 조건부 포워더 순으로 바꿔 가며 역할 차이를 확인했습니다. chrony로 내부 NTP 서버를 세우고 local stratum으로 외부 단절에도 답하게 했습니다.\n\n디스크는 fdisk · mkfs · fstab으로 파티션과 마운트를, 파일 공유는 Samba 클라이언트와 NFS 서버·클라이언트를 구성했습니다. 서비스 하나를 올리는 공통 절차(apt → 설정 → 검사 → systemctl → ufw → ss → journalctl)를 몸에 익히는 것이 목표이고, mdadm·LVM·targetcli 스토리지와 rsyslog·SNMP·Zabbix 관제가 이어집니다.",
    stack: [
      "Ubuntu Server",
      "isc-dhcp-server",
      "BIND9",
      "chrony",
      "nginx · Apache",
      "OpenSSH",
      "Samba · NFS",
      "fdisk · fstab",
      "systemd · ufw",
    ],
    responsibilities: [
      { area: "계정 · 권한", detail: "사용자·그룹·sudo, 퍼미션 8진수, SSH 접근 구성" },
      {
        area: "DHCP · DNS · NTP",
        detail: "VLAN별 DHCP, BIND 캐시·Master·조건부 포워더, chrony 서버·클라이언트",
      },
      {
        area: "디스크 · 공유",
        detail: "파티션·파일시스템·fstab, Samba 클라이언트, NFS 서버·클라이언트",
      },
      {
        area: "운영 절차",
        detail: "설정 검사(named-checkconf 등) → 재시작 → 포트 확인 → 로그 확인을 루틴으로",
      },
    ],
  },
  {
    slug: "corp-network-design",
    group: "infra-lab",
    title: "사내 네트워크 설계 (80명 규모)",
    tagline:
      "요구사항과 검수 조건만 받고 정답 토폴로지 없이 직접 설계 — 설계 산출물 3종 (구축 전 단계)",
    period: "2026.07 ~ 2026.08 · 설계 완료",
    role: "설계 전담",
    description:
      "3층 경영지원·개발팀, 4층 영업팀·서버실·CCTV를 가진 가상의 중소기업 요구사항(부서별 VLAN 분리, 단일 장애 금지, 영업팀은 서버망 웹만 허용, CCTV망 접근 통제)을 받아 장비 배치·포트 연결·IP/VLAN·라우팅·접근제어를 전부 스스로 결정했습니다.\n\n물리/논리 토폴로지, IP·VLAN·포트맵, 검증 항목 25종을 설계서로 남겼습니다. 코어 L3 스위치 2대에 HSRP로 게이트웨이를 이중화하고, 경계 라우터 2대와 OSPF로 ISP에 연결하며, ACL로 부서 간 접근을 통제하는 구조입니다. 구축은 학습 우선순위 조정으로 진행하지 않았고, 설계까지가 최종 상태입니다.",
    stack: ["Cisco Packet Tracer", "VLAN · Trunk", "HSRP", "OSPF", "STP", "DHCP", "ACL"],
    responsibilities: [
      { area: "요구사항 분석", detail: "고객 요구 8개 항목을 기술 요구(VLAN·이중화·ACL)로 번역" },
      { area: "설계 산출물", detail: "물리/논리 토폴로지 · IP/VLAN/포트맵 · 검증 25종" },
      { area: "범위 결정", detail: "구축·검증은 수행하지 않음을 명시 — 설계 경험으로만 기재" },
    ],
  },

  // ── Developer Tools ────────────────────────────────────────────────────
  {
    slug: "pading",
    group: "developer-tools",
    title: "PADING",
    tagline: "페어 프로그래밍 웹 IDE — 컨테이너 위에서 코드가 실행·배포되는 경로를 구현",
    period: "2025.01 ~ 2025.02 · 6주 · 6명",
    role: "컨테이너 실행·배포 · IDE 터미널 · 발표",
    repoUrl: "github.com/juniqu-e/Pading",
    award: { rank: 2, competition: "SSAFY 12기 공통 프로젝트" },
    description:
      "브라우저 기반 개발 환경에서 사용자가 프로젝트를 실행하고 배포할 수 있도록 지원하는 개발자 워크스페이스입니다. 인프라는 Jenkins · Kubernetes였고, 개발 환경이 설치된 컨테이너를 생성·배포하고 Kubernetes로 자원을 관리하는 매니징 기능을 담당했습니다.\n\n제가 만든 IDE 터미널은 실행 버튼을 누르면 루트 스크립트가 터미널에서 돌아 서브도메인 배포까지 자동으로 이루어지는 구조입니다. Xterm.js에 명령 입력 메서드가 없어 실행 버튼이 동작하지 않자 클립보드 복사 후 paste 이벤트를 프로그램적으로 트리거해 우회했습니다. 실시간 상태(WebSocket)와 권한 관리 화면, 발표도 맡았습니다.",
    stack: ["Kubernetes", "Jenkins", "Docker", "WebSocket", "Xterm.js", "React", "TypeScript"],
    responsibilities: [
      {
        area: "컨테이너 실행·배포",
        detail: "개발환경 컨테이너 생성·배포, K8s 자원 관리, 서브도메인 자동 배포 스크립트",
      },
      {
        area: "IDE Terminal",
        detail: "웹 터미널 서버 연동, 실행 결과 표시, Xterm.js 입력 제약 우회",
      },
      { area: "협업 흐름", detail: "실시간 상태 관리(WebSocket), 권한 관리 · 역할별 네비게이션" },
    ],
  },
  {
    slug: "mattermost-scheduled-messages",
    group: "developer-tools",
    title: "Mattermost 예약 메시지 플러그인",
    tagline: "실습코치 업무 중 개발 — 예약 전송에 GUI · 파일 첨부 추가",
    period: "2025.10 ~ 2025.11",
    role: "플러그인 개발 · 매뉴얼 작성",
    description:
      "Mattermost 환경에서 예약 메시지 기능을 제공하는 내부 생산성 플러그인입니다. 기존 명령어 방식에 GUI와 파일 첨부 기능을 더했고, 사용자 매뉴얼 v1/v2를 작성해 배포했습니다.\n\nGo 기반 플러그인 서버 구조와 API 연동, React 프론트엔드, WSL 기반 개발 환경과 Make 빌드 흐름을 경험했습니다.",
    stack: ["Go", "React", "TypeScript", "Mattermost Plugin SDK", "Make", "WSL"],
    responsibilities: [
      { area: "Frontend", detail: "예약 시간 설정, 파일 첨부, 메시지 전송 GUI" },
      { area: "Backend", detail: "Go 플러그인 구조 이해 및 API 연동" },
      { area: "문서", detail: "설치·사용 매뉴얼 v1/v2, 개발환경 세팅 문서" },
    ],
  },

  // ── Mobile (SSAFY 수상작) ──────────────────────────────────────────────
  {
    slug: "whistlehub",
    group: "mobile",
    title: "WhistleHub",
    tagline: "누구나 쉽게 음악을 만들 수 있는 모바일 앱",
    period: "2025.03 ~ 2025.04 · 6주 · 6명",
    role: "Mobile Developer",
    repoUrl: "github.com/juniqu-e/WhistleHub",
    award: { rank: 1, competition: "SSAFY 12기 특화 프로젝트" },
    description:
      "간단한 조작으로 음악을 생성하고 편집할 수 있는 모바일 앱입니다. 인증·세션 관리, 프로필·플레이리스트, API 모듈화(인터페이스·DTO·서비스 계층 분리, 인터셉터 토큰 자동 주입)를 담당했습니다. ExoPlayer 인스턴스가 삭제되지 않아 생긴 백그라운드 재생·메모리 누수는 Application 클래스에서 싱글톤으로 전역 관리해 해결했습니다.",
    stack: ["Android", "Kotlin", "REST API", "JNI", "CMAKE", "OBOE", "Jenkins"],
  },
  {
    slug: "amoverse",
    group: "mobile",
    title: "Amoverse (À moi)",
    tagline: "아티스트를 위한 모바일 전시회 앱",
    period: "2025.04 ~ 2025.05 · 6주 · 6명",
    role: "모바일 팀장 · 아키텍처 설계 · On-device AI",
    repoUrl: "github.com/Amoverse",
    award: { rank: 2, competition: "SSAFY 12기 자율 프로젝트" },
    description:
      "아티스트의 작품을 모바일에서 전시하고 감상할 수 있는 앱입니다. 모바일 팀장으로 전체 아키텍처(MVVM, GraphQL + REST, 인증·세션)를 설계했고, AI 생성 포스터의 한글 왜곡 문제는 텍스트 없는 이미지를 생성한 뒤 객체·그리드 복잡도를 회피하는 알고리즘으로 온디바이스에서 텍스트를 배치해 해결했습니다.",
    stack: ["Android", "Kotlin", "MVVM", "GraphQL", "REST API", "On-device AI", "Jenkins"],
  },
];
