import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Home, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useConversations } from "@/hooks/useConversations";

export function AppSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { conversations, isLoading } = useConversations();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="font-semibold tracking-tight">Nabulas</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1">
              <NavLink to="/" end className={({ isActive }) => `flex items-center gap-2 px-2 py-2 rounded-md ${isActive ? "bg-muted bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}>
                <Home className="h-4 w-4" />
                <span>Home</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-2 px-2 py-2 rounded-md ${isActive ? "bg-muted bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}>
                <User className="h-4 w-4" />
                <span>Profile</span>
              </NavLink>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button
              variant="pill"
              className="w-full b justify-start"
              // onClick={async () => {
              //   if (!user) {
              //     toast({ title: "Sign in required", description: "Please sign in to create a conversation." });
              //     return;
              //   }
              //   const { data, error } = await supabase
              //     .from("conversations")
              //     .insert({ user_id: user.id, title: "New Conversation" })
              //     .select("id")
              //     .maybeSingle();
              //   if (error || !data?.id) {
              //     console.error(error);
              //     toast({ title: "Failed to create", description: "Could not create conversation." });
              //     return;
              //   }
              //   navigate(`/chat/${data.id}`);
              // }}
              onClick={() => navigate("/")}
            >
              <PlusCircle /> New Conversation
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
              {!user && (
                <div className="text-sm text-muted-foreground px-2 py-3 rounded-md border border-dashed">
                  Sign in to view your conversations.
                </div>
              )}
              {user && isLoading && (
                <div className="text-sm text-muted-foreground px-2 py-3 rounded-md border border-dashed">
                  Loading conversations...
                </div>
              )}
              {user && !isLoading && conversations.length === 0 && (
                <div className="text-sm text-muted-foreground px-2 py-3 rounded-md border border-dashed">
                  No conversations yet.
                </div>
              )}
              {conversations.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-2 py-0 rounded-md hover:bg-accent">
                  <button className="text-left truncate flex-1" onClick={() => navigate(`/chat/${c.id}`)}>
                    {c.title || `Conversation ${c.id.slice(0, 6)}`}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-md">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50">
                      <DropdownMenuItem onClick={() => navigate(`/chat/${c.id}`)}>View</DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {
                        await supabase.from("conversations").update({ is_public: true }).eq("id", c.id);
                        navigator.clipboard.writeText(`${window.location.origin}/chat/${c.id}`);
                        toast({ description: "Share Link Copied" });
                      }}>Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 bg-red-50 hover:bg-red-150" onClick={async () => {
                        await supabase.from("conversations").delete().eq("id", c.id);
                        toast({ title: "Deleted", description: "Conversation removed." });
                      }}>Delete</DropdownMenuItem>
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
