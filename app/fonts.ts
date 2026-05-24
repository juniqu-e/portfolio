import localFont from "next/font/local";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";

export const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

export const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});
