import { Link } from "react-router-dom";

const navLinks = [
  { label: "Research", href: "/research" },
  { label: "Learn", href: "/learn" },
  { label: "Tools", href: "/tools" },
  { label: "Markets", href: "/markets" },
  { label: "About", href: "/about" },
];

const externalLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gajji-srinath/" },
  { label: "X (Twitter)", href: "https://x.com" }, // TODO: Replace with actual X handle
  { label: "GitHub", href: "https://github.com" }, // TODO: Replace with actual GitHub URL
  { label: "Email", href: "mailto:srinathguna12@gmail.com" },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: Wordmark */}
          <div>
            <Link to="/" className="font-bold text-foreground text-base tracking-tight">
              The Valuation Node
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Indian markets research and learning
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              © 2026 Srinath Gajji
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: External links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Connect
            </h3>
            <ul className="space-y-2.5">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            This is not investment advice. Any opinions are personal. No paid promotions.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/disclaimer" className="hover:text-foreground transition-colors">
              Disclaimer
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
