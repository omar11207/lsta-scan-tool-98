import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DiagnosticPage from "./pages/DiagnosticPage";
import ResultsPage from "./pages/ResultsPage";
import NotFoundCustom from "./pages/NotFoundCustom";
import StyleApprentissagePage from "./pages/StyleApprentissagePage";
import IntelligencesMultiplesPage from "./pages/IntelligencesMultiplesPage";
import SoutienFamilialPage from "./pages/SoutienFamilialPage";
import MotivationParticipationPage from "./pages/MotivationParticipationPage";
import GlobalResultsPage from "./pages/GlobalResultsPage";
import ResultsStyleApprentissagePage from "./pages/ResultsStyleApprentissagePage";
import ResultsIntelligencesMultiplesPage from "./pages/ResultsIntelligencesMultiplesPage";
import ResultsSoutienFamilialPage from "./pages/ResultsSoutienFamilialPage";
import ResultsMotivationParticipationPage from "./pages/ResultsMotivationParticipationPage";
import AdminConfigPage from "./pages/AdminConfigPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diagnostic/rythme" element={<DiagnosticPage />} />
          <Route path="/diagnostic/style-apprentissage" element={<StyleApprentissagePage />} />
          <Route path="/diagnostic/intelligences-multiples" element={<IntelligencesMultiplesPage />} />
          <Route path="/diagnostic/soutien-familial" element={<SoutienFamilialPage />} />
          <Route path="/diagnostic/motivation-participation" element={<MotivationParticipationPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/results/style-apprentissage" element={<ResultsStyleApprentissagePage />} />
          <Route path="/results/intelligences-multiples" element={<ResultsIntelligencesMultiplesPage />} />
          <Route path="/results/soutien-familial" element={<ResultsSoutienFamilialPage />} />
          <Route path="/results/motivation-participation" element={<ResultsMotivationParticipationPage />} />
          <Route path="/results/global" element={<GlobalResultsPage />} />
          <Route path="/admin/config" element={<AdminConfigPage />} />
          <Route path="/404" element={<NotFoundCustom />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
