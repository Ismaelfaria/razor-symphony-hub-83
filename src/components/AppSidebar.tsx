import { useState } from "react";
import { LayoutDashboard, Users, Scissors, Calendar, Menu, UserCheck, BarChart3, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Base items for all users
const baseItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clientes", url: "/clients", icon: Users },
  { title: "Serviços", url: "/services", icon: Scissors },
  { title: "Agendamentos", url: "/appointments", icon: Calendar },
];

// Admin only items
const adminItems = [
  { title: "Funcionários", url: "/employees", icon: UserCheck },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-violet" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-primary-foreground transition-all duration-200";

  const items = isAdmin ? [...baseItems, ...adminItems] : baseItems;

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-gradient-sidebar backdrop-blur-sm transition-all duration-300"
      collapsible="icon"
      side="left"
    >
      <SidebarContent className="p-4">
        <div className="mb-8">
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-sidebar-accent/30 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-violet">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  BarberShop
                </h1>
                <p className="text-xs text-sidebar-foreground/60 font-medium">
                  {isAdmin ? "Painel Admin" : "Portal Funcionário"}
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-violet">
                <Scissors className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {/* Base items for all users */}
              {baseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Admin only items with visual separation */}
              {isAdmin && (
                <>
                  <div className="py-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-admin-accent/30 to-transparent"></div>
                    {!isCollapsed && (
                      <div className="flex items-center gap-2 mt-3 px-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-admin"></div>
                        <span className="text-xs font-semibold text-admin-accent uppercase tracking-wider">
                          Administração
                        </span>
                      </div>
                    )}
                  </div>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-12">
                        <NavLink 
                          to={item.url} 
                          end 
                          className={({ isActive }) => `${
                            isActive 
                              ? "bg-gradient-admin text-admin-accent-foreground font-medium shadow-admin" 
                              : "hover:bg-admin-accent/10 text-sidebar-foreground hover:text-admin-accent border border-admin-accent/20 hover:border-admin-accent/40"
                          } flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group`}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                          {!isCollapsed && <span className="font-medium">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}