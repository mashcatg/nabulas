import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const { user } = useAuth();

  const chats = user ? [] : [];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="font-semibold tracking-tight">Nabulas</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button variant="pill" className="w-full justify-start">
              <PlusCircle /> New Conversation
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
              {chats.length === 0 && (
                <div className="text-sm text-muted-foreground px-2 py-3 rounded-md border border-dashed">
                  {user ? "No conversations yet." : "Sign in to view your conversations."}
                </div>
              )}
              {chats.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-accent">
                  <span className="truncate">{c.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-md">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </>
  );
}
