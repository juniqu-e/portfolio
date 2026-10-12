import type { Profile } from "@/types";

// Source: CONTENT.md §About Me + §정체성 요약 표 + §운영 기록. 텍스트 1글자도 수정 X.
// Bold 강조는 CONTENT.md의 `**...**` 표기를 ParaSegment.emphasis=true로 보존한다.

export const PROFILE: Profile = {
  aboutBody: [
    [
      { text: "집에서도 Linux 서버를 직접 구축하고 운영할 만큼 " },
      { text: "인프라를 재밌어 하는 사람", emphasis: true },
      { text: "입니다. 궁금하면 직접 해 보고, 측정하고, 기록합니다." },
    ],
    [
      { text: "리눅스 서버 한 대에 " },
      { text: "Docker 컨테이너 25개", emphasis: true },
      {
        text: "와 직접 만든 서비스·오픈소스 10개 이상을 올려 1년 넘게 운영하고 있습니다. 포트포워딩 없이 Cloudflare Tunnel로 도메인 20여 개를 공개하고, 전 도메인이 내려간 장애의 원인을 iptables 규칙 누락으로 밝혀 2분 주기 자가 복구 타이머로 재발을 막았습니다.",
      },
    ],
    [
      {
        text: "서비스는 코드가 아니라 배포·캐시·방화벽·갱신 정책처럼 코드 바깥에서 깨진다는 것을 운영하면서 배웠습니다. 그래서 문제가 생기면 추측하지 않고 ",
      },
      { text: "앱 → 컨테이너 → 호스트 → 네트워크 순으로 측정", emphasis: true },
      {
        text: "해 원인을 좁히고, 증상·원인·조치·재발 방지를 기록으로 남깁니다. 지금은 한국전파진흥협회 클라우드 보안 전문가 과정에서 네트워크·보안·Windows/Linux 서버·스토리지·AWS를 실장비로 다루고 있습니다.",
      },
    ],
  ],
  identitySummary: [
    { label: "Role", value: "인프라 엔지니어 (서버 · 클라우드) 지향" },
    {
      label: "Focus",
      value:
        "Linux · Windows Server 운영, 스토리지, 컨테이너 배포, 모니터링·가용성, Cloudflare · AWS",
    },
    {
      label: "Current",
      value: "RAPA 클라우드 보안 전문가 양성과정 (2026.07 ~ 2026.12 수료 예정)",
    },
    {
      label: "Certification",
      value: "정보처리기사 (2026.09) · CCNA 200-301 (2026.10) · AWS SAA · RHCSA 준비 중",
    },
    {
      label: "Motto",
      value: "Try the code, Catch the people, Finally make it reliable.",
    },
  ],
  numbers: [
    { value: "25", label: "컨테이너", sub: "리눅스 서버 1대 · 1년+" },
    { value: "20+", label: "공개 도메인", sub: "포트포워딩 0 · Cloudflare Tunnel" },
    { value: "61,328", label: "문제 풀이", sub: "ccna.wnsdlr.com · 사용자 22명" },
    { value: "0.02%", label: "5xx 비율", sub: "요청 21만 건 중" },
    { value: "60+", label: "무중단 배포", sub: "blue/green · 12일" },
    { value: "1,000+", label: "확인 문항", sub: "강의노트 50+ · 개념 위키 165" },
  ],
};
