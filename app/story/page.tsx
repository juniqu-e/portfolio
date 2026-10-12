import type { Metadata, Viewport } from "next";
import { StoryPage } from "@/components/story/StoryPage";

// 실험용 별도 페이지 — 제출한 메인(/)은 그대로 두고 여기서 컨셉을 시험한다.
export const metadata: Metadata = {
  title: "Story",
  description: "이준익의 커리어를 터미널 로그처럼 따라가는 페이지.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0D0B",
};

export default function Page() {
  return <StoryPage />;
}
