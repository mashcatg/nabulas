import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export function AuthGate() {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!loading && !user);
  }, [user, loading]);

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
  };

  if (loading || user) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}> 
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Welcome to Nabulas</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">Sign in with Google to start secure healthcare voice sessions.</p>
            <Button variant="hero" size="lg" onClick={signInWithGoogle} className="w-full">
              <LogIn /> Continue with Google
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Nabulas</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-muted-foreground mb-4">Sign in with Google to start secure healthcare voice sessions.</p>
          <Button variant="hero" size="lg" onClick={signInWithGoogle} className="w-full">
            <LogIn /> Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
