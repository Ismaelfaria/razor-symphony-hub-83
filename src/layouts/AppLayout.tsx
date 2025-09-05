import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-dark">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 sm:h-16 flex items-center justify-between px-2 sm:px-6 border-b border-dark-border bg-gradient-to-r from-dark-card/80 to-dark-card/60 backdrop-blur-md shadow-dark">
            <SidebarTrigger className="p-1.5 sm:p-2 hover:bg-sidebar-accent/50 rounded-xl transition-all duration-200 hover:scale-105 lg:hidden">
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-sidebar-foreground" />
            </SidebarTrigger>
            
            <div className="flex items-center gap-1 sm:gap-4">
              <div className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-primary/10 border border-primary/20">
                <span className="text-xs sm:text-sm font-medium bg-gradient-primary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Sistema de </span>Barbearia Pro
                </span>
              </div>
              
              {user && (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-muted hover:text-foreground h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sair da Conta</span>
                  </Button>
              )}
            </div>
          </header>
          
          <main className="flex-1 p-2 sm:p-6 overflow-auto bg-gradient-to-br from-background via-dark-bg to-background">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}