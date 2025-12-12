import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// ...existing code...
import { ThemeProvider } from "./components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        {/* Next.js handles routing via the /pages or /app directory. Render children/components directly. */}
        <Index />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
