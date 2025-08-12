import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { AvatarWithFallback } from "../users/AvatarWithFallback";
import { useAuth } from "@/contexts/AuthContext";

export function TopBar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="hover-scale" />
          <span className="font-semibold tracking-tight">Nabulas</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <AvatarWithFallback name={user?.user_metadata?.name || user?.email || "Guest"} src={user?.user_metadata?.avatar_url} />
        </div>
      </div>
    </header>
  );
}
