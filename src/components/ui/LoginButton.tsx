import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { AuthGate } from "@/components/AuthGate";

export function LoginButton() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowAuth(true)}
        className="hover-scale"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
      {showAuth && <AuthGate isOpen={showAuth} onOpenChange={setShowAuth} />}
    </>
  );
}