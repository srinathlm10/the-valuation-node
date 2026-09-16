import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SiteTour } from "@/components/tour/SiteTour";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import type { RouteRecord } from "vite-react-ssg";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { LegacyRedirect } from "./components/routing/LegacyRedirect";
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
const SectionLanding = lazy(() => import("./pages/SectionLanding"));

// The Vault
const LearnIndex = lazy(() => import("./pages/LearnIndex"));
const Foundations = lazy(() => import("./pages/Foundations"));
const Glossary = lazy(() => import("./pages/Glossary"));
// GlossaryEntry, RatioAnalysisEntry, GuideRouter, InteractiveRouter load via route-level lazy below.
const RatioAnalysis = lazy(() => import("./pages/RatioAnalysis"));
const TagsIndex = lazy(() => import("./pages/TagPages").then((m) => ({ default: m.TagsIndex })));
const ArchiveIndex = lazy(() => import("./pages/ArchivePage").then((m) => ({ default: m.ArchiveIndex })));


// Tools
const Tools = lazy(() => import("./pages/Tools"));
// ToolPage loads via route-level lazy in the routes below.

// Markets
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
          <ScrollToTop />
          <SiteTour />
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

// react-router data routes (RouteObject[] + vite-react-ssg extras).
// Public content routes follow RESTRUCTURE-PLAN.md. Every dynamic public route
// declares getStaticPaths from src/lib/siteRoutes.ts so the prerender and the
// sitemap agree. Legacy paths are mounted on <LegacyRedirect/> (client) and
// 301-redirected in public/_redirects (server); they are excluded from the
// prerender in vite.config.ts.
// Route-level lazy for the section landings (they take a prop, so wrap once).
const sectionLandingLazy = (section: "news" | "esg") => async () => {
  const M = (await import("./pages/SectionLanding")).default;
  const Component = () => <M section={section} />;
  return { Component };
};

const staticPathsFor = async (prefix: string, depth?: number) => {
  const { siteRoutes } = await import("@/lib/siteRoutes");
  return siteRoutes()
    .map((r) => r.path)
    .filter((p) => p.startsWith(prefix + "/"))
    .filter((p) => (depth ? p.split("/").length - 1 === depth : true))
    .map((p) => p.slice(1));
};

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Home
      { index: true, Component: Index },

      // ── News & Trends ─────────────────────────────────────────────────
      { path: "news", element: <SectionLanding section="news" /> },
      { path: "news/indian-economy/nifty-50", Component: MarketsNifty50 },
      { path: "news/policy-regulation/compliance-calendar", Component: MarketsCompliance },
      {
        path: "news/:sub",
        lazy: sectionLandingLazy("news"),
        getStaticPaths: () => staticPathsFor("/news", 2),
      },

      // ── Insights & Analysis ───────────────────────────────────────────
      { path: "analysis", Component: Research },
      {
        path: "analysis/:sub",
        lazy: async () => ({ Component: (await import("./pages/Research")).default }),
        getStaticPaths: () => staticPathsFor("/analysis", 2),
      },
      {
        path: "analysis/:sub/:slug",
        lazy: async () => ({ Component: (await import("./pages/ResearchArticle")).default }),
        // Published articles only (drafts never prerender); hidden_articles is
        // honoured at build time and fails open if the DB is unreachable.
        getStaticPaths: async () => {
          const all = await staticPathsFor("/analysis", 3);
          try {
            const { supabase } = await import("@/integrations/supabase/client");
            const { data, error } = await supabase.from("hidden_articles" as never).select("slug");
            if (error) throw error;
            const hidden = new Set((data ?? []).map((r: { slug: string }) => r.slug));
            return all.filter((p) => !hidden.has(p.split("/").pop() ?? ""));
          } catch {
            return all;
          }
        },
      },

      // ── ESG & Sustainability ──────────────────────────────────────────
      { path: "esg", element: <SectionLanding section="esg" /> },
      {
        path: "esg/:sub",
        lazy: sectionLandingLazy("esg"),
        getStaticPaths: () => staticPathsFor("/esg", 2),
      },

      // ── The Vault ─────────────────────────────────────────────────────
      { path: "vault", Component: LearnIndex },
      { path: "vault/glossary", Component: Glossary },
      {
        path: "vault/glossary/:termSlug",
        lazy: async () => ({ Component: (await import("./pages/GlossaryEntry")).default }),
        getStaticPaths: () => staticPathsFor("/vault/glossary", 3),
      },
      { path: "vault/formulas", Component: RatioAnalysis },
      {
        path: "vault/formulas/:slug",
        lazy: async () => ({ Component: (await import("./pages/RatioAnalysisEntry")).default }),
        getStaticPaths: () => staticPathsFor("/vault/formulas", 3),
      },
      { path: "vault/guides", Component: Foundations },
      {
        path: "vault/guides/:slug",
        // Tracks, the two restored courses, and the 51 topic guides share this namespace.
        lazy: async () => ({ Component: (await import("./pages/GuideRouter")).default }),
        getStaticPaths: () => staticPathsFor("/vault/guides", 3),
      },
      { path: "vault/interactive", Component: Tools },
      {
        path: "vault/interactive/:slug",
        lazy: async () => ({ Component: (await import("./pages/InteractiveRouter")).default }),
        getStaticPaths: () => staticPathsFor("/vault/interactive", 3),
      },

      // ── Search and Start here ─────────────────────────────────────────
      { path: "search", lazy: async () => ({ Component: (await import("./pages/SearchPage")).default }) },
      { path: "start-here", lazy: async () => ({ Component: (await import("./pages/StartHere")).default }) },

      // ── Topics (tags) ─────────────────────────────────────────────────
      { path: "tags", Component: TagsIndex },
      {
        path: "tags/:tag",
        lazy: async () => ({ Component: (await import("./pages/TagPages")).TagPage }),
        getStaticPaths: () => staticPathsFor("/tags", 2),
      },

      // ── About ─────────────────────────────────────────────────────────
      { path: "about", Component: About },
      { path: "about/author", Component: AboutAuthor },
      { path: "about/site", Component: AboutSite },
      { path: "about/philosophy", Component: AboutMethodology },
      {
        path: "about/:page",
        lazy: async () => ({ Component: (await import("./pages/AboutLegal")).default }),
        getStaticPaths: () => ["about/contact", "about/privacy", "about/disclaimer", "about/terms"],
      },

      // ── Archive (legacy personal-finance articles; noindex) ───────────
      { path: "archive", Component: ArchiveIndex },
      {
        path: "archive/:slug",
        lazy: async () => ({ Component: (await import("./pages/ArchivePage")).ArchiveArticle }),
        getStaticPaths: () => staticPathsFor("/archive", 2),
      },

      // ── Legacy paths: client-side redirects (server 301s in _redirects) ──
      { path: "research", element: <LegacyRedirect /> },
      { path: "research/:slug", element: <LegacyRedirect /> },
      { path: "learn", element: <LegacyRedirect /> },
      { path: "learn/*", element: <LegacyRedirect /> },
      { path: "tools", element: <LegacyRedirect /> },
      { path: "tools/:slug", element: <LegacyRedirect /> },
      { path: "markets", element: <LegacyRedirect /> },
      { path: "markets/*", element: <LegacyRedirect /> },
      { path: "calculators", element: <LegacyRedirect /> },
      { path: "stocks", element: <LegacyRedirect /> },
      { path: "compliance", element: <LegacyRedirect /> },
      { path: "about/methodology", element: <LegacyRedirect /> },
      { path: "privacy", element: <LegacyRedirect /> },
      { path: "disclaimer", element: <LegacyRedirect /> },
      { path: "terms", element: <LegacyRedirect /> },

      // ── Auth ──────────────────────────────────────────────────────────
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "admin-login", Component: AdminLogin },
      { path: "auth/callback", Component: AuthCallback },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },

      // ── Authenticated ─────────────────────────────────────────────────
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

      // ── Admin ─────────────────────────────────────────────────────────
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

      // ── Hidden routes (not in public nav) ─────────────────────────────
      { path: "community", Component: Community },
      { path: "community/post/:id", element: <PostDetail /> },
      // Data migration tool: admin only (audit item 8.11).
      {
        path: "migration",
        element: (
          <AdminRoute>
            <Migration />
          </AdminRoute>
        ),
      },

      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
];
