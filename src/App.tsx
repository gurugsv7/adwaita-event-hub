import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import AllEventsPage from "./pages/AllEventsPage";
import RegisterPage from "./pages/RegisterPage";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import BrochureLinksPage from "./pages/BrochureLinksPage";
import DelegatePassPage from "./pages/DelegatePassPage";
import KrishhConcertPage from "./pages/KrishhConcertPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<AllEventsPage />} />
          <Route path="/events/:categoryId" element={<CategoryPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/delegate-pass" element={<DelegatePassPage />} />
          <Route path="/krishh" element={<KrishhConcertPage />} />
          <Route path="/brochure-links" element={<BrochureLinksPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Clean URLs for event registration: /:categoryId/:eventId */}
          <Route path="/:categoryId/:eventId" element={<EventRegistrationPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
