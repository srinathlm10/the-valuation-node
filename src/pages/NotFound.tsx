import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export default function NotFound() {
  return (
    <Layout>
      <Helmet>
        <title>Page not found — The Valuation Node</title>
      </Helmet>

      <div className="container max-w-xl py-24 text-center space-y-6">
        <p className="text-6xl font-bold text-muted-foreground/30">404</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>

        <div className="max-w-sm mx-auto">
          <GlobalSearch />
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground underline">Home</Link>
          <Link to="/research" className="text-muted-foreground hover:text-foreground underline">Research</Link>
          <Link to="/learn" className="text-muted-foreground hover:text-foreground underline">Learn</Link>
          <Link to="/tools" className="text-muted-foreground hover:text-foreground underline">Tools</Link>
          <Link to="/markets" className="text-muted-foreground hover:text-foreground underline">Markets</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground underline">About</Link>
        </div>
      </div>
    </Layout>
  );
}
