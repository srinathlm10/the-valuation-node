import { Link } from "react-router-dom";
import { Bot, ExternalLink } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Knowledge Hub", href: "/" },
    { label: "Compliance Feed", href: "/compliance" },
    { label: "Stock Archive", href: "/stocks" },
    { label: "Finance Lab", href: "/learn" },
  ],
  resources: [
    { label: "SEBI Official", href: "https://www.sebi.gov.in", external: true },
    { label: "NSE India", href: "https://www.nseindia.com", external: true },
    { label: "BSE India", href: "https://www.bseindia.com", external: true },
    { label: "RBI", href: "https://www.rbi.org.in", external: true },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-slate">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold">FinBot</span>
                <span className="text-lg font-light text-muted-foreground ml-1">India</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Decoding Indian finance through regulatory intelligence, interactive learning, and AI-powered insights.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Official Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} FinBot India. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
              <strong>Disclaimer:</strong> This platform provides educational content only and does not constitute financial advice. 
              Always consult a SEBI-registered advisor for investment decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
