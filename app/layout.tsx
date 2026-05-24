import type { Metadata, Viewport } from "next";
import { jetBrainsMono, pretendard, schibstedGrotesk } from "./fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wnsdlr.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "이준익 / Lee Junik — DevOps / Platform Engineer",
    template: "%s · 이준익 (Lee Junik)",
  },
  description:
    "Try the code, Catch the people, Finally make it reliable. 이준익의 DevOps / Platform Engineer 포트폴리오.",
  keywords: [
    "이준익",
    "Lee Junik",
    "DevOps",
    "Platform Engineer",
    "Kubernetes",
    "Internal Developer Platform",
    "SSAFY",
    "Portfolio",
  ],
  authors: [{ name: "이준익 (Lee Junik)", url: siteUrl }],
  creator: "이준익 (Lee Junik)",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "wnsdlr.com",
    title: "이준익 / Lee Junik — DevOps / Platform Engineer",
    description: "Try the code, Catch the people, Finally make it reliable.",
  },
  twitter: {
    card: "summary_large_image",
    title: "이준익 / Lee Junik",
    description: "Try the code, Catch the people, Finally make it reliable.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={cn(pretendard.variable, schibstedGrotesk.variable, jetBrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded focus-visible:bg-ink focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-page"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
