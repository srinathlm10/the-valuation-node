import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import type { RouteRecord } from "vite-react-ssg";
import { RESEARCH_ARTICLES } from "@/data/research.generated";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ContentManager from "./components/admin/ContentManager";
import EmbeddingManager from "./components/admin/EmbeddingManager";
import AdminDashboard from "./components/admin/AdminDashboard";
import CommentsManager from "./components/admin/CommentsManager";

// Auth pages (no Layout wrapper, they render standalone)
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Main pages
const Index = lazy(() => import("./pages/Index"));
const Research = lazy(() => import("./pages/Research"));
// ResearchArticle and FoundationsLeaf load via route-level lazy in the routes below.

// Learn section
const LearnIndex = lazy(() => import("./pages/LearnIndex"));
const Foundations = lazy(() => import("./pages/Foundations"));
const LearnByDoing = lazy(() => import("./pages/LearnByDoing"));
const LearnByDoingModule = lazy(() => import("./pages/LearnByDoingModule"));
const Glossary = lazy(() => import("./pages/Glossary"));
const GlossaryEntry = lazy(() => import("./pages/GlossaryEntry"));

// Legacy learn routes (kept for backward-compat; redirected below)
const ArticleView = lazy(() => import("./pages/ArticleView"));

// Tools
const Tools = lazy(() => import("./pages/Tools"));
// ToolPage loads via route-level lazy in the routes below.
const DcfSensitivityPage = lazy(() => import("./pages/DcfSensitivityPage"));
const BuildADcfPage = lazy(() => import("./pages/BuildADcfPage"));
const ReadIncomeStatementPage = lazy(() => import("./pages/ReadIncomeStatementPage"));
const ComputeRatiosPage = lazy(() => import("./pages/ComputeRatiosPage"));
const CompareCompaniesPage = lazy(() => import("./pages/CompareCompaniesPage"));
const SpotRedFlagsPage = lazy(() => import("./pages/SpotRedFlagsPage"));

// Markets
const Markets = lazy(() => import("./pages/Markets"));
const MarketsNifty50 = lazy(() => import("./pages/MarketsNifty50"));
const MarketsCompliance = lazy(() => import("./pages/MarketsCompliance"));

// About
const About = lazy(() => import("./pages/About"));
const AboutAuthor = lazy(() => import("./pages/AboutAuthor"));
const AboutSite = lazy(() => import("./pages/AboutSite"));
const AboutMethodology = lazy(() => import("./pages/AboutMethodology"));

// Authenticated
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

// Hidden (still routable, not in public nav)
const Community = lazy(() => import("./pages/Community"));
import PostDetail from "./pages/PostDetail";
const Migration = lazy(() => import("./pages/Migration"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen text-primary">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

// Root layout: app-wide providers wrap an <Outlet/>. vite-react-ssg supplies the
// router AND the HelmetProvider (so <Helmet> tags are collected during SSG), do
// not add another HelmetProvider here. The Suspense boundary lets lazy route
// Components resolve during both client render and static prerender.
function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// react-router data routes (RouteObject[] + vite-react-ssg extras). Only
// /research/:slug declares getStaticPaths, so it is the one dynamic route that
// gets prerendered per-article; every concrete path is prerendered by default
// (filtered in vite.config.ts via ssgOptions.includedRoutes).
export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Home
      { index: true, Component: Index },

      // Research
      { path: "research", Component: Research },
      {
        path: "research/:slug",
        // Route-level lazy (not React.lazy): required for dynamic routes that
        // prerender many paths; vite-react-ssg's asset collector cannot handle
        // an already-initialised React.lazy component.
        lazy: async () => ({ Component: (await import("./pages/ResearchArticle")).default }),
        // Prerender an article only if it has a real publish date AND is not
        // hidden at build time. Drafts (no date) and hidden articles produce no
        // static HTML, so nothing leaks; they still resolve client-side and show
        // "temporarily unavailable" when the visibility flag is set. Mirrors the
        // sitemap's build-time logic; fails open if the DB can't be reached.
        getStaticPaths: async () => {
          const dated = RESEARCH_ARTICLES.filter((a) => a.publishedAt);
          try {
            const { supabase } = await import("@/integrations/supabase/client");
            const { data, error } = await supabase.from("hidden_articles" as never).select("slug");
            if (error) throw error;
            const hidden = new Set((data ?? []).map((r: { slug: string }) => r.slug));
            return dated.filter((a) => !hidden.has(a.slug)).map((a) => `research/${a.slug}`);
          } catch {
            return dated.map((a) => `research/${a.slug}`);
          }
        },
      },

      // Learn
      { path: "learn", Component: LearnIndex },
      { path: "learn/foundations", Component: Foundations },
      { path: "learn/foundations/:section", Component: Foundations },
      {
        path: "learn/foundations/:section/:topic",
        // Route-level lazy for the same reason as research/:slug above.
        lazy: async () => ({ Component: (await import("./pages/FoundationsLeaf")).default }),
        // Prerender every published Foundations topic so the full content and
        // meta tags are in the static HTML for crawlers. Dynamic import keeps
        // the Foundations chunk lazy on the client (this only runs at build).
        getStaticPaths: async () => {
          const { FOUNDATIONS_TREE } = await import("./pages/Foundations");
          return FOUNDATIONS_TREE.flatMap((section) =>
            section.topics
              .filter((t) => t.published)
              .map((t) => `learn/foundations/${section.section}/${t.slug}`)
          );
        },
      },
      { path: "learn/by-doing", Component: LearnByDoing },
      { path: "learn/by-doing/build-a-dcf", Component: BuildADcfPage },
      { path: "learn/by-doing/read-an-income-statement", Component: ReadIncomeStatementPage },
      { path: "learn/by-doing/compute-ratios", Component: ComputeRatiosPage },
      { path: "learn/by-doing/compare-two-companies", Component: CompareCompaniesPage },
      { path: "learn/by-doing/spot-the-red-flags", Component: SpotRedFlagsPage },
      { path: "learn/by-doing/:slug", Component: LearnByDoingModule },
      { path: "learn/glossary", Component: Glossary },
      { path: "learn/glossary/:termSlug", Component: GlossaryEntry },

      // Legacy learn redirects
      { path: "learn/wiki", element: <Navigate to="/learn/glossary" replace /> },
      { path: "learn/basics", element: <Navigate to="/learn/foundations" replace /> },
      { path: "learn/fundamental-analysis", element: <Navigate to="/learn/foundations/valuation" replace /> },
      { path: "learn/technical-analysis", element: <Navigate to="/learn/foundations/markets-and-instruments/technical-analysis-primer" replace /> },
      { path: "learn/:slug", Component: ArticleView },

      // Tools
      { path: "tools", Component: Tools },
      { path: "tools/dcf-sensitivity", Component: DcfSensitivityPage },
      {
        path: "tools/:slug",
        // Route-level lazy (same collectAssets constraint as research/foundations)
        // + prerender all 8 calculator pages with their meta and calculator UI.
        lazy: async () => ({ Component: (await import("./pages/ToolPage")).default }),
        getStaticPaths: () => [
          "tools/sip",
          "tools/future-value",
          "tools/present-value",
          "tools/cagr",
          "tools/compound-interest",
          "tools/rule-of-72",
          "tools/emi",
          "tools/inflation-adjusted-returns",
        ],
      },
      { path: "calculators", element: <Navigate to="/tools" replace /> },

      // Markets
      { path: "markets", Component: Markets },
      { path: "markets/nifty50", Component: MarketsNifty50 },
      { path: "markets/compliance", Component: MarketsCompliance },
      { path: "stocks", element: <Navigate to="/markets/nifty50" replace /> },
      { path: "compliance", element: <Navigate to="/markets/compliance" replace /> },

      // About
      { path: "about", Component: About },
      { path: "about/author", Component: AboutAuthor },
      { path: "about/site", Component: AboutSite },
      { path: "about/methodology", Component: AboutMethodology },

      // Auth
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "admin-login", Component: AdminLogin },
      { path: "auth/callback", Component: AuthCallback },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },

      // Authenticated
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },

      // Admin
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "content", element: <ContentManager /> },
          { path: "embeddings", element: <EmbeddingManager /> },
          { path: "comments", element: <CommentsManager /> },
        ],
      },

      // Hidden routes (not in public nav)
      { path: "community", Component: Community },
      { path: "community/post/:id", element: <PostDetail /> },
      { path: "migration", Component: Migration },

      { path: "*", Component: NotFound },
    ],
  },
];
