import type { Metadata, Viewport } from "next";
import { jetBrainsMono, pretendard, schibstedGrotesk } from "./fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wnsdlr.com";
const ICON_V = "lji2";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "이준익 / Lee Junik — Infrastructure Engineer",
    template: "%s · 이준익 (Lee Junik)",
  },
  description:
    "서버 · 클라우드 인프라 엔지니어 이준익의 포트폴리오 — 기술과 삶의 철학, 2024년부터의 타임라인, 홈서버에서 운영 중인 서비스.",
  keywords: [
    "이준익",
    "Lee Junik",
    "인프라 엔지니어",
    "Infrastructure Engineer",
    "Linux",
    "Windows Server",
    "Cloudflare Tunnel",
    "Docker",
    "Kubernetes",
    "AWS",
    "홈서버",
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
    title: "이준익 / Lee Junik — Infrastructure Engineer",
    description: "이준익의 인프라 엔지니어(서버 · 클라우드) 포트폴리오.",
  },
  twitter: {
    card: "summary_large_image",
    title: "이준익 / Lee Junik",
    description: "이준익의 인프라 엔지니어(서버 · 클라우드) 포트폴리오.",
  },
  robots: { index: true, follow: true },
  // 파일 규칙(app/icon.png) 대신 명시 + ?v= — 브라우저가 페이지별로 캐시한 옛 아이콘(/admin 등)을 버리게 한다.
  // 로고를 바꾸면 ICON_V 를 올린다.
  icons: {
    icon: [
      { url: `/favicon.ico?v=${ICON_V}`, sizes: "16x16 32x32 48x48" },
      { url: `/icon.png?v=${ICON_V}`, type: "image/png", sizes: "32x32" },
    ],
    shortcut: `/favicon.ico?v=${ICON_V}`,
    apple: { url: `/apple-icon.png?v=${ICON_V}`, sizes: "180x180" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0D0B",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "이준익",
  alternateName: "Lee Junik",
  jobTitle: "Infrastructure Engineer",
  url: siteUrl,
  email: "mailto:zz262zzx@gmail.com",
  sameAs: ["https://github.com/juniqu-e", "https://velog.io/@juniqu_e"],
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
        <script
          type="application/ld+json"
          // schema.org Person — SEO 구조화 데이터 (SPEC G3 AC6)
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
