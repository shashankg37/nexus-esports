import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Player Portal
import PlayerLogin from "./pages/player/Login";
import PlayerDashboard from "./pages/player/Dashboard";

// Admin Portal
import AdminLogin from "./pages/admin/Login";
import AdminPanel from "./pages/admin/Panel";

// Referee Portal
import RefereeLogin from "./pages/referee/Login";
import RefereeControl from "./pages/referee/Control";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Player Portal */}
          <Route path="/player/login" element={<PlayerLogin />} />
          <Route path="/player/dashboard" element={<PlayerDashboard />} />
          
          {/* Admin Portal */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          
          {/* Referee Portal */}
          <Route path="/referee/login" element={<RefereeLogin />} />
          <Route path="/referee/control" element={<RefereeControl />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
