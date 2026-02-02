import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Learn from "./pages/Learn";
import Compliance from "./pages/Compliance";
import Stocks from "./pages/Stocks";
import Calculators from "./pages/Calculators";
import Dashboard from "./pages/Dashboard";
import FundamentalAnalysis from "./pages/FundamentalAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:termId" element={<Learn />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/compliance/:circularId" element={<Compliance />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stocks/:stockId" element={<Stocks />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calculators/:calculatorId" element={<Calculators />} />
          <Route path="/learn/fundamental-analysis" element={<FundamentalAnalysis />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
