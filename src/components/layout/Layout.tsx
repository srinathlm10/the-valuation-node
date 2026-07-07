import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Site-wide SEO defaults. Any page can override these via its own <Helmet>
          (react-helmet-async dedupes by property/name, innermost wins). */}
      <Helmet>
        <meta property="og:site_name" content="The Valuation Node" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content="https://valuationnode.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="The Valuation Node: Indian Market Research and Learning" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://valuationnode.com/og-image.png" />
      </Helmet>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
