import { Link } from "react-router-dom";

const exploreLinks = [
  { label: "Adopt", to: "/adopt" },
  { label: "Browse", to: "/browse" },
  { label: "Post an animal", to: "/dashboard/listings/new" },
  { label: "Favorites", to: "/dashboard/favorites" }
];

const accountLinks = [
  { label: "My profile", to: "/dashboard/profile" },
  { label: "Saved searches", to: "/dashboard/searches" },
  { label: "Incoming requests", to: "/dashboard/requests/incoming" },
  { label: "Outgoing requests", to: "/dashboard/requests/outgoing" },
  { label: "Sign in / Register", to: "/auth" }
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YouTubeIcon }
];

type FooterColumnProps = {
  title: string;
  links: Array<{ label: string; to: string }>;
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-[15px] font-semibold uppercase tracking-[0.22em] text-fern/85">{title}</h2>
      <ul className="space-y-3 text-sm leading-6 text-ink/72">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="transition hover:text-fern">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

type SocialLinkProps = {
  href: string;
  label: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

function SocialLink({ href, label, Icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Open ${label}`}
      className="inline-flex h-10 w-12 items-center justify-center border border-ink/15 text-ink/70 transition hover:border-fern/45 hover:text-fern"
    >
      <Icon className="h-[27px] w-[27px]" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto mt-6 w-full max-w-6xl border-t border-ink/10 px-10 pb-6 pt-8 md:px-12 md:pb-8 md:pt-10">
      <div className="grid gap-8 md:grid-cols-2 xl:flex xl:items-start xl:justify-between xl:gap-8">
        <section className="space-y-4 md:col-span-2 xl:w-[40%] xl:max-w-[460px]">
          <div className="space-y-2">
            <Link to="/home" className="inline-flex items-center gap-3">
              <img src="/logo.png" alt="PetNest logo" className="h-11 w-auto object-contain" />
              <span className="text-2xl font-semibold tracking-tight text-ink">PetNest</span>
            </Link>
            <p className="text-[15px] font-semibold uppercase tracking-[0.22em] text-fern/85">
              <span className="block">Helping rescued pets find safe,</span>
              <span className="block">loving homes.</span>
            </p>
          </div>
          <section className="space-y-4 pt-6 md:pt-8">
            <h2 className="text-[15px] font-semibold uppercase tracking-[0.22em] text-fern/85">Follow us</h2>
            <div className="flex flex-nowrap gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <SocialLink key={label} href={href} label={label} Icon={Icon} />
              ))}
            </div>
          </section>
        </section>

        <div className="xl:w-[14%] xl:min-w-[140px]">
          <FooterColumn title="Explore" links={exploreLinks} />
        </div>

        <div className="xl:w-[14%] xl:min-w-[140px]">
          <FooterColumn title="Account" links={accountLinks} />
        </div>

        <div className="space-y-8 xl:w-[22%] xl:min-w-[240px]">
          <section className="space-y-4">
            <h2 className="text-[15px] font-semibold uppercase tracking-[0.22em] text-fern/85">Support</h2>
            <div className="space-y-3 text-sm leading-6 text-ink/72">
              <a href="mailto:support@petnest.local" className="inline-block transition hover:text-fern">
                support@petnest.local
              </a>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[15px] font-semibold uppercase tracking-[0.22em] text-fern/85">Collaborations &amp; awards</h2>
            <div className="space-y-3 text-sm leading-6 text-ink/72">
              <div className="space-y-1">
                <p className="text-[22px] leading-none text-[#d4a73c]">★★★★</p>
                <p>Best adoption platform 2025</p>
              </div>
              <a href="mailto:collab@petnest.local" className="inline-block transition hover:text-fern">
                collab@petnest.local
              </a>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-1 border-t border-ink/10 pt-4 text-[10px] uppercase tracking-[0.16em] text-ink/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 PetNest</p>
        <p>Rescue-first pet adoption platform</p>
      </div>
    </footer>
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
