// /story 전용 콘텐츠 — 두 철학. 출처: CONTENT.md §"/story — 두 철학" (볼트 30-Output/나의 철학 — 두 문장.md).
// 문장은 본인이 2026-10-14 인터뷰에서 확정한 것. 사이트에서는 "~라고 믿습니다 / 생각합니다" 어조로 쓴다 (2026-10-14 결정).

export const MOTTOS = {
  tech: "기술의 가치는 사람이 할 수 있는 일을 넓히는 데 있다고 믿습니다.",
  life: "미래를 바꾸려면, 변화의 대가도 함께 선택해야 한다고 믿습니다.",
} as const;

export type PhilosophyScene = { label: string; head: string; body: string };

export const PHILOSOPHY_SCENES: PhilosophyScene[] = [
  {
    label: "tech",
    head: MOTTOS.tech,
    body: "생산성은 더 많은 일을 처리하는 것이 아니라, 시도하고 실현할 수 있는 일의 범위를 넓히는 것이라고 생각합니다. 안정적인 운영과 효율적인 구성, 자동화와 측정과 기록은 이 믿음을 실천하는 수단이라고 생각합니다.",
  },
  {
    label: "life",
    head: MOTTOS.life,
    body: "원하는 변화에는 시간과 노력, 익숙함을 내려놓는 대가가 따릅니다. 그 대가를 받아들이는 것까지가 선택이라고 생각합니다. 결과가 기대와 달라도, 지금의 선택이 미래를 준비하는 방향이라면 의미가 있다고 믿습니다.",
  },
];
