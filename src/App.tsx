import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Planejamento from "./pages/Planejamento";
import CadastroEci from "./pages/CadastroEci";
import Areas from "./pages/Areas";
import Inspecoes from "./pages/Inspecoes";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
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
          <Route path="/dashboard" element={<Index />} />
          <Route path="/planejamento" element={<Planejamento />} />
          <Route path="/cadastro-eci" element={<CadastroEci />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/inspecoes" element={<Inspecoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/usuarios" element={<Usuarios />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
