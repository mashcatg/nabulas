import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ReactNode } from "react";

import { TopBar } from "./TopBar";
import { AppSidebar } from "../navigation/AppSidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar collapsible="offcanvas" className="border-r">
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          {/* Top bar */}
          <TopBar />
          <div className="block md:flex-1 px-2 md:px-8 pt-4 pb-20 animate-fade-in">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

