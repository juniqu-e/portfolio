// Source: CONTENT.md §Contact. 1글자 일치.

export type ContactLink = {
  id: "email" | "github" | "velog";
  label: string;
  display: string;
  href: string;
  external: boolean;
};

export const CONTACT_LINKS: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    display: "zz262zzx@gmail.com",
    href: "mailto:zz262zzx@gmail.com",
    external: false,
  },
  {
    id: "github",
    label: "GitHub",
    display: "github.com/juniqu-e",
    href: "https://github.com/juniqu-e",
    external: true,
  },
  {
    id: "velog",
    label: "Velog",
    display: "velog.io/@juniqu_e",
    href: "https://velog.io/@juniqu_e",
    external: true,
  },
];
