import { BookOpen, Envelope, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { CONTACT_LINKS, type ContactLink } from "@/content/contact";

const ICON_BY_ID: Record<
  ContactLink["id"],
  (props: { size?: number; weight?: "regular"; "aria-hidden"?: boolean }) => React.JSX.Element
> = {
  email: (p) => <Envelope {...p} />,
  github: (p) => <GithubLogo {...p} />,
  velog: (p) => <BookOpen {...p} />,
};

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-prose px-6 py-16 sm:py-24"
    >
      <h2
        id="contact-heading"
        className="font-display text-4xl font-semibold tracking-display text-ink sm:text-5xl"
      >
        Get in touch.
      </h2>

      <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        {CONTACT_LINKS.map((link) => {
          const IconComponent = ICON_BY_ID[link.id];
          return (
            <li key={link.id}>
              <a
                href={link.href}
                aria-label={link.label}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group inline-flex min-h-9 items-center gap-2.5 rounded-lg border border-line bg-page px-4 py-2 text-sm text-muted transition-[border-color,color,background-color] duration-200 ease-out hover:border-line-strong hover:bg-panel hover:text-accent-blue"
              >
                <IconComponent size={18} weight="regular" aria-hidden />
                <span className="font-mono text-xs sm:text-sm">{link.display}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
