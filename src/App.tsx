import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import EmployeePortal from "./pages/EmployeePortal";
import PublicBooking from "./pages/PublicBooking";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientLocation from "./pages/client/ClientLocation";
import ClientProfessionals from "./pages/client/ClientProfessionals";
import ClientServices from "./pages/client/ClientServices";
import ClientBooking from "./pages/client/ClientBooking";
import ClientLoyalty from "./pages/client/ClientLoyalty";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/booking" element={<PublicBooking />} />
            <Route path="/portal" element={<EmployeePortal />} />
            
            {/* Client Routes */}
            <Route path="/client" element={
              <ProtectedRoute clientOnly>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/client/location" element={
              <ProtectedRoute clientOnly>
                <ClientLocation />
              </ProtectedRoute>
            } />
            <Route path="/client/professionals" element={
              <ProtectedRoute clientOnly>
                <ClientProfessionals />
              </ProtectedRoute>
            } />
            <Route path="/client/services" element={
              <ProtectedRoute clientOnly>
                <ClientServices />
              </ProtectedRoute>
            } />
            <Route path="/client/loyalty" element={
              <ProtectedRoute clientOnly>
                <ClientLoyalty />
              </ProtectedRoute>
            } />
            <Route path="/client/booking" element={
              <ProtectedRoute clientOnly>
                <ClientBooking />
              </ProtectedRoute>
            } />
            
            {/* Admin/Employee Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <AppLayout>
                  <Clients />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/services" element={
              <ProtectedRoute>
                <AppLayout>
                  <Services />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <AppLayout>
                  <Appointments />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute adminOnly>
                <AppLayout>
                  <Employees />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute adminOnly>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute adminOnly>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
