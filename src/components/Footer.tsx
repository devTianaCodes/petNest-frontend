import { Link } from "react-router-dom";
import { SocialIconLink, footerSocialLinks } from "./SocialLinks";

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

export function Footer() {
  return (
    <footer className="mx-auto mt-6 w-full max-w-6xl border-t border-ink/10 px-3 pb-5 pt-6 sm:px-4 md:px-12 md:pb-8 md:pt-10">
      <div className="grid gap-6 md:grid-cols-2 md:gap-8 xl:flex xl:items-start xl:justify-between xl:gap-8">
        <section className="space-y-4 md:col-span-2 xl:w-[40%] xl:max-w-[460px]">
          <div className="space-y-2">
            <Link to="/home" className="inline-flex items-center gap-3">
              <img
                src="/logo-display.png"
                alt="PetNest logo"
                width="160"
                height="145"
                loading="lazy"
                decoding="async"
                className="h-11 w-auto object-contain"
              />
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
              {footerSocialLinks.map(({ href, label, icon: Icon }) => (
                <SocialIconLink key={label} href={href} label={`Open ${label}`} Icon={Icon} />
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
