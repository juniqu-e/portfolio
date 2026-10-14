import type Lenis from "lenis";

// StoryPage 가 만든 Lenis 인스턴스를 터미널 `cd` 가 쓸 수 있게 공유한다.
export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}
