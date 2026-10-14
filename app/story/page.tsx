import type { Metadata, Viewport } from "next";
import { StoryPage } from "@/components/story/StoryPage";

// 실험용 별도 페이지 — 제출한 메인(/)은 그대로 두고 여기서 컨셉을 시험한다.
export const metadata: Metadata = {
  title: "Story",
  description:
    "이준익의 두 문장 — 기술의 가치는 사람이 할 수 있는 일을 넓히는 데 있다 · 미래를 바꾸려면, 변화의 대가도 선택해야 한다 — 와 커리어 로그.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0D0B",
};

export default function Page() {
  return <StoryPage />;
}
