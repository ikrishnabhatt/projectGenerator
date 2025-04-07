
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Templates from "./pages/Templates";
import TemplateDetail from "./pages/TemplateDetail";
import Generate from "./pages/Generate";
import Pricing from "./pages/Pricing";
import PaymentCheckout from "./pages/PaymentCheckout";
import Docs from "./pages/Docs";
import ExpertRequest from "./pages/ExpertRequest";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/templates/:id" element={<TemplateDetail />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/payment-checkout" element={<PaymentCheckout />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/create-by-experts" element={<ExpertRequest />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
