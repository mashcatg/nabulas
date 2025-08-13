import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { AuthGate } from "@/components/AuthGate";

export function LoginButton() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => setShowAuth(true)}
        className="hover:opacity-90 transition-opacity duration-200"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
      {showAuth && <AuthGate isOpen={showAuth} onOpenChange={setShowAuth} />}
    </>
  );
}