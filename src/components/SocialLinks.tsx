export type SocialLinkItem = {
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

type SocialIconLinkProps = {
  href: string;
  label: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export const footerSocialLinks: SocialLinkItem[] = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YouTubeIcon }
];

export function SocialIconLink({ href, label, Icon }: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex h-10 w-12 items-center justify-center border border-ink/15 text-ink/70 transition hover:border-fern/45 hover:text-fern"
    >
      <Icon className="h-[27px] w-[27px]" />
    </a>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.3 21v-7.3h2.5l.37-2.84H13.3V9.02c0-.82.23-1.37 1.4-1.37h1.5V5.1c-.26-.04-1.17-.1-2.22-.1-2.2 0-3.7 1.34-3.7 3.8v2.03H7.8v2.84h2.48V21h3.02Z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 4H21l-4.58 5.24L21.8 20h-4.22l-3.31-4.33L10.5 20H8.39l4.9-5.62L8.2 4h4.33l2.96 3.93L18.9 4Zm-.73 14.76h1.17L11.9 5.17h-1.26Z" />
    </svg>
  );
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.3 7.2a2.75 2.75 0 0 0-1.94-1.95C17.65 4.8 12 4.8 12 4.8s-5.65 0-7.36.45A2.75 2.75 0 0 0 2.7 7.2 28.5 28.5 0 0 0 2.25 12c0 1.62.15 3.22.45 4.8a2.75 2.75 0 0 0 1.94 1.95c1.71.45 7.36.45 7.36.45s5.65 0 7.36-.45a2.75 2.75 0 0 0 1.94-1.95c.3-1.58.45-3.18.45-4.8 0-1.62-.15-3.22-.45-4.8ZM10.2 15.45V8.55L15.9 12l-5.7 3.45Z" />
    </svg>
  );
}
