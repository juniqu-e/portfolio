import type { ComponentType, SVGAttributes } from "react";
import {
  ArrowsSplit,
  Code,
  Cube,
  Globe,
  HardDrives,
  Heartbeat,
  Notebook,
  Pulse,
  ShieldCheck,
  TreeStructure,
} from "@phosphor-icons/react/dist/ssr";

// Brand icons (devicon @latest via jsdelivr, downloaded to /public/icons/).
// 직접 `<img>` 렌더링 — 정적 SVG라 next/image 최적화 효과 미미하고 RSC 단순함이 더 큼.
// devicon에 없는 것(HAProxy·keepalived·Uptime Kuma·MinIO·Cisco·Storage·DNS·Obsidian)은 Phosphor로 fallback.
const BRAND_ICONS = new Set<string>([
  "linux",
  "docker",
  "kubernetes",
  "nginx",
  "jenkins",
  "github-actions",
  "helm",
  "argo-cd",
  "aws",
  "cloudflare",
  "ubuntu",
  "windows-server",
  "bash",
  "prometheus",
  "grafana",
  "go",
  "kotlin",
  "python",
  "typescript",
  "javascript",
  "java",
  "react",
  "vue",
  "android",
  "django",
  "spring",
  "git",
  "github",
  "gitlab",
  "figma",
  "jira",
  "mattermost",
  "slack",
]);

type PhosphorWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

type PhosphorIconProps = SVGAttributes<SVGElement> & {
  size?: number | string;
  weight?: PhosphorWeight;
};

type PhosphorIcon = ComponentType<PhosphorIconProps>;

const PHOSPHOR_FALLBACK_BY_SLUG: Record<string, PhosphorIcon> = {
  storage: HardDrives,
  minio: Cube,
  haproxy: ArrowsSplit,
  keepalived: Pulse,
  "uptime-kuma": Heartbeat,
  cisco: TreeStructure,
  asa: ShieldCheck,
  dns: Globe,
  obsidian: Notebook,
};

const DEFAULT_PHOSPHOR: PhosphorIcon = Code;

export type IconProps = {
  slug?: string;
  size?: number;
  weight?: PhosphorWeight;
  className?: string;
  ariaLabel?: string;
};

export function Icon({ slug, size = 32, weight = "regular", className, ariaLabel }: IconProps) {
  if (slug && BRAND_ICONS.has(slug)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/icons/${slug}.svg`}
        alt={ariaLabel ?? ""}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  const Phosphor = (slug && PHOSPHOR_FALLBACK_BY_SLUG[slug]) || DEFAULT_PHOSPHOR;
  return (
    <Phosphor
      size={size}
      weight={weight}
      className={className}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    />
  );
}
