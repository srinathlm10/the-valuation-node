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
const PostDetail = lazy(() => import("./pages/PostDetail"));
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:termId" element={<Learn />} />
            <Route path="/article/:id" element={<ArticleView />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/compliance/:circularId" element={<Compliance />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stocks/:stockId" element={<Stocks />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/calculators/:calculatorId" element={<Calculators />} />
            <Route path="/learn/fundamental-analysis" element={<FundamentalAnalysis />} />
            <Route path="/learn/technical-analysis" element={<TechnicalAnalysis />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:postId" element={<PostDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/migration" element={<Migration />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
