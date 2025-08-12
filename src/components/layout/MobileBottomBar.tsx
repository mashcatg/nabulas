import { Home, User as UserIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

export function MobileBottomBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-screen-md grid grid-cols-2 h-14">
        <NavLink to="/" end className={({ isActive }) => `flex items-center justify-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          <Home className="h-5 w-5" />
          <span className="sr-only md:not-sr-only md:inline">Home</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex items-center justify-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          <UserIcon className="h-5 w-5" />
          <span className="sr-only md:not-sr-only md:inline">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
