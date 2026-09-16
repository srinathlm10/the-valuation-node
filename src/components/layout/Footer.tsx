import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { SECTIONS } from "@/lib/taxonomy";
import { landingHasContent } from "@/lib/contentIndex";
import { paths } from "@/lib/routes";
import { ComingSoonTag } from "@/components/content/ComingSoonTag";

/**
 * Footer: a full site map by section (empty sub-sections marked "coming soon"),
 * About and legal links, contact, social, the newsletter, and the site tour
 * link. Navy like the nav, per the prototype palette.
 */

const ABOUT = SECTIONS.find((s) => s.id === "about")!;
const CONTENT_SECTIONS = SECTIONS.filter((s) => s.inNav && s.id !== "about");

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gajji-srinath/", icon: Linkedin },
  { label: "Email", href: "mailto:srinath@valuationnode.com", icon: Mail },
];

function SitemapColumn({ title, href, links }: { title: string; href: string; links: { label: string; href: string; soon?: boolean }[] }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[1px] text-white">
        <Link to={href} className="hover:text-brand-green">{title}</Link>
      </h2>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link to={l.href} className="text-sm text-[#d1d5db] transition-colors hover:text-white">
              {l.label}
              {l.soon && <ComingSoonTag className="text-[#d1d5db]/70" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-navy text-[#d1d5db]">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Site map by section */}
          {CONTENT_SECTIONS.map((s) => (
            <SitemapColumn
              key={s.id}
              title={s.label}
              href={s.path}
              links={s.subsections.map((x) => ({
                label: x.label,
                href: `${s.path}/${x.id}`,
                soon: s.id !== "vault" && !landingHasContent(s.id, x.id),
              }))}
            />
          ))}
          <SitemapColumn
            title={ABOUT.label}
            href={ABOUT.path}
            links={[
              ...ABOUT.subsections.map((x) => ({ label: x.label, href: `${ABOUT.path}/${x.id}` })),
              { label: "Terms of Use", href: paths.aboutPage("terms") },
              { label: "Archive", href: paths.archive() },
              { label: "Topics", href: paths.tags() },
            ]}
          />

          {/* Brand, social, newsletter */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-circle.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" aria-hidden="true" />
              <img src="/logo-wordmark-dark.png" alt="The Valuation Node" width={147} height={22} className="h-[22px] w-auto" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed">Independent research and learning on Indian markets.</p>
            <ul className="mt-4 flex gap-3">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-brand-green hover:text-white"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="footer-newsletter mt-6" id="footer-newsletter">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[1px] text-white">Weekly Briefing</h2>
              <NewsletterSignup variant="sidebar" source="footer" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <p>© 2026 Gajji Srinath. Not investment advice. Opinions are personal. No paid promotions.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to={paths.aboutPage("disclaimer")} className="transition-colors hover:text-white">Disclaimer</Link>
            <Link to={paths.aboutPage("privacy")} className="transition-colors hover:text-white">Privacy</Link>
            <Link to={paths.aboutPage("terms")} className="transition-colors hover:text-white">Terms</Link>
            <Link to={paths.aboutPage("contact")} className="transition-colors hover:text-white">Contact</Link>
            <Link to="/?tour=1" id="site-tour-link" className="transition-colors hover:text-white">Take the site tour</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
