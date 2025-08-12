import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "../navigation/AppSidebar";
import { TopBar } from "./TopBar";
import { MobileBottomBar } from "./MobileBottomBar";

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
          <div className="flex-1 container pt-4 pb-20 animate-enter">
            {children}
          </div>
          {/* Mobile bottom bar */}
          <MobileBottomBar />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

