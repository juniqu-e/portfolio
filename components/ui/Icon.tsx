import type { ComponentType, SVGAttributes } from "react";
import {
  Anchor,
  AndroidLogo,
  ArrowsClockwise,
  Atom,
  ChatsCircle,
  Cloud,
  Code,
  Coffee,
  Cube,
  FigmaLogo,
  FileCode,
  GitBranch,
  GithubLogo,
  GitlabLogo,
  Globe,
  Kanban,
  Leaf,
  LinuxLogo,
  ShieldCheck,
  SlackLogo,
  Stack,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";

type PhosphorWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

type PhosphorIconProps = SVGAttributes<SVGElement> & {
  size?: number | string;
  weight?: PhosphorWeight;
  mirrored?: boolean;
};

type PhosphorIcon = ComponentType<PhosphorIconProps>;

// Phosphor에 공식 브랜드 마크가 있는 경우 그대로 사용한다.
// 그 외에는 의미상 가장 가까운 generic icon으로 대체한다 (Phase 8 follow-up: simple-icons 또는 public/icons/ 로 정식 SVG 교체).
const REGISTRY: Record<string, PhosphorIcon> = {
  // DevOps / Platform
  linux: LinuxLogo,
  docker: Cube, // brand SVG follow-up
  kubernetes: Cube, // brand SVG follow-up
  nginx: Globe, // generic web server proxy
  jenkins: Wrench, // generic build/automation
  "github-actions": GithubLogo,
  helm: Anchor, // helm = ship's wheel → anchor (closest)
  "argo-cd": ArrowsClockwise, // GitOps continuous reconciliation
  opa: ShieldCheck, // policy/security

  // Cloud / Infrastructure
  aws: Cloud, // brand SVG follow-up
  terraform: Stack, // infra as layered stack

  // Languages
  python: FileCode,
  typescript: FileCode,
  javascript: FileCode,
  java: Coffee, // java = coffee pun

  // Frontend / Mobile
  react: Atom, // React logo is atomic
  vue: FileCode,
  android: AndroidLogo,

  // Backend
  django: FileCode,
  spring: Leaf, // Spring brand color/leaf motif

  // Tools & Collaboration
  git: GitBranch,
  github: GithubLogo,
  gitlab: GitlabLogo,
  figma: FigmaLogo,
  jira: Kanban,
  mattermost: ChatsCircle, // no official mattermost icon
  slack: SlackLogo,
};

const FALLBACK: PhosphorIcon = Code;

export type IconProps = {
  slug?: string;
  size?: number;
  weight?: PhosphorWeight;
  className?: string;
  ariaHidden?: boolean;
  ariaLabel?: string;
};

export function Icon({
  slug,
  size = 24,
  weight = "regular",
  className,
  ariaHidden = true,
  ariaLabel,
}: IconProps) {
  const Component = (slug && REGISTRY[slug]) || FALLBACK;
  return (
    <Component
      size={size}
      weight={weight}
      className={className}
      aria-hidden={ariaHidden ? true : undefined}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    />
  );
}
