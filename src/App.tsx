import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ContentManager from "./components/admin/ContentManager";
import EmbeddingManager from "./components/admin/EmbeddingManager";
import AdminDashboard from "./components/admin/AdminDashboard";
import CommentsManager from "./components/admin/CommentsManager";

// Auth pages (no Layout wrapper — they render standalone)
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Main pages
const Index = lazy(() => import("./pages/Index"));
const Research = lazy(() => import("./pages/Research"));
const ResearchArticle = lazy(() => import("./pages/ResearchArticle"));

// Learn section
const LearnIndex = lazy(() => import("./pages/LearnIndex"));
const Foundations = lazy(() => import("./pages/Foundations"));
const FoundationsLeaf = lazy(() => import("./pages/FoundationsLeaf"));
const LearnByDoing = lazy(() => import("./pages/LearnByDoing"));
const LearnByDoingModule = lazy(() => import("./pages/LearnByDoingModule"));
const Glossary = lazy(() => import("./pages/Glossary"));
const GlossaryEntry = lazy(() => import("./pages/GlossaryEntry"));

// Legacy learn routes (kept for backward-compat; redirected below)
const ArticleView = lazy(() => import("./pages/ArticleView"));

// Tools
const Tools = lazy(() => import("./pages/Tools"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
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

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Home */}
                <Route path="/" element={<Index />} />

                {/* Research */}
                <Route path="/research" element={<Research />} />
                <Route path="/research/:slug" element={<ResearchArticle />} />

                {/* Learn */}
                <Route path="/learn" element={<LearnIndex />} />
                <Route path="/learn/foundations" element={<Foundations />} />
                <Route path="/learn/foundations/:section" element={<Foundations />} />
                <Route path="/learn/foundations/:section/:topic" element={<FoundationsLeaf />} />
                <Route path="/learn/by-doing" element={<LearnByDoing />} />
                <Route path="/learn/by-doing/build-a-dcf" element={<BuildADcfPage />} />
                <Route path="/learn/by-doing/read-an-income-statement" element={<ReadIncomeStatementPage />} />
                <Route path="/learn/by-doing/compute-ratios" element={<ComputeRatiosPage />} />
                <Route path="/learn/by-doing/compare-two-companies" element={<CompareCompaniesPage />} />
                <Route path="/learn/by-doing/spot-the-red-flags" element={<SpotRedFlagsPage />} />
                <Route path="/learn/by-doing/:slug" element={<LearnByDoingModule />} />
                <Route path="/learn/glossary" element={<Glossary />} />
                <Route path="/learn/glossary/:termSlug" element={<GlossaryEntry />} />

                {/* Legacy learn routes — redirect to new structure */}
                <Route path="/learn/wiki" element={<Navigate to="/learn/glossary" replace />} />
                <Route path="/learn/basics" element={<Navigate to="/learn/foundations" replace />} />
                <Route path="/learn/fundamental-analysis" element={<Navigate to="/learn/foundations/valuation" replace />} />
                <Route path="/learn/technical-analysis" element={<Navigate to="/learn/foundations/markets-and-instruments/technical-analysis-primer" replace />} />
                <Route path="/learn/:slug" element={<ArticleView />} />

                {/* Tools */}
                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/dcf-sensitivity" element={<DcfSensitivityPage />} />
                <Route path="/tools/:slug" element={<ToolPage />} />
                {/* Legacy calculator route */}
                <Route path="/calculators" element={<Navigate to="/tools" replace />} />

                {/* Markets */}
                <Route path="/markets" element={<Markets />} />
                <Route path="/markets/nifty50" element={<MarketsNifty50 />} />
                <Route path="/markets/compliance" element={<MarketsCompliance />} />
                {/* Legacy routes */}
                <Route path="/stocks" element={<Navigate to="/markets/nifty50" replace />} />
                <Route path="/compliance" element={<Navigate to="/markets/compliance" replace />} />

                {/* About */}
                <Route path="/about" element={<About />} />
                <Route path="/about/author" element={<AboutAuthor />} />
                <Route path="/about/site" element={<AboutSite />} />
                <Route path="/about/methodology" element={<AboutMethodology />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Authenticated */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="content" element={<ContentManager />} />
                  <Route path="embeddings" element={<EmbeddingManager />} />
                  <Route path="comments" element={<CommentsManager />} />
                </Route>

                {/* Hidden routes (not in public nav) */}
                <Route path="/community" element={<Community />} />
                <Route path="/community/post/:id" element={<PostDetail />} />
                <Route path="/migration" element={<Migration />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
