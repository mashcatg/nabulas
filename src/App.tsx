import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGate } from "@/components/AuthGate";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import { VoiceProvider } from "@/components/voice/VoiceCallManager";

const queryClient = new QueryClient();

console.log('App.tsx: React available:', !!React);
console.log('App.tsx: QueryClient created:', !!queryClient);

const App: React.FC = () => {
  console.log('App.tsx: App component rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <VoiceProvider>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat/:conversationId" element={<Chat />} />
                    <Route path="/chat/new" element={<Navigate to="/" replace />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <AuthGate />
                </AppLayout>
              </VoiceProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
