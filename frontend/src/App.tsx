import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import QueryWorkspace from "./pages/QueryWorkspace";
import Datasets from "./pages/Datasets";
import Reports from "./pages/Reports";
import SystemLogs from "./pages/SystemLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen w-full radial-vignette">
          <AppSidebar />
          <main className="flex-1 px-8 lg:px-12 py-8 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/query" element={<QueryWorkspace />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/logs" element={<SystemLogs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
