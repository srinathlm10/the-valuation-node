import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Learn = lazy(() => import("./pages/Learn"));
const Compliance = lazy(() => import("./pages/Compliance"));
const Stocks = lazy(() => import("./pages/Stocks"));
const Calculators = lazy(() => import("./pages/Calculators"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Community = lazy(() => import("./pages/Community"));
import PostDetail from "./pages/PostDetail";
import { AdminRoute } from "./components/auth/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ContentManager from "./components/admin/ContentManager";
import EmbeddingManager from "./components/admin/EmbeddingManager";
const Settings = lazy(() => import("./pages/Settings"));
const Migration = lazy(() => import("./pages/Migration"));
const ArticleView = lazy(() => import("./pages/ArticleView"));
const FundamentalAnalysis = lazy(() => import("./pages/FundamentalAnalysis"));
const TechnicalAnalysis = lazy(() => import("./pages/TechnicalAnalysis"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Simple loading spinner component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen text-primary">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:slug" element={<ArticleView />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/post/:id" element={<PostDetail />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Navigate to="/admin/content" replace />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="embeddings" element={<EmbeddingManager />} />
              <Route path="users" element={<div className="text-slate-400 p-8">User Management Coming Soon</div>} />
              <Route path="settings" element={<div className="text-slate-400 p-8">Admin Settings Coming Soon</div>} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
