import { Button } from "@/components/ui/button";
import { Mic, MicOff, Captions, Phone, PhoneOff } from "lucide-react";
import { useState } from "react";

export default function VoiceControls() {
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [active, setActive] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-24 md:bottom-10 mx-auto flex items-center justify-center gap-6 w-full max-w-lg">
      <Button variant="pill" size="icon" onClick={() => setMuted((m) => !m)} aria-pressed={muted} className="hover-scale">
        {muted ? <MicOff /> : <Mic />}
      </Button>
      <Button
        variant="hero"
        size="round"
        onClick={() => setActive((a) => !a)}
        className={active ? "bg-destructive text-destructive-foreground" : ""}
        aria-pressed={active}
      >
        {active ? <PhoneOff /> : <Phone />}
      </Button>
      <Button variant="pill" size="icon" onClick={() => setCaptions((c) => !c)} aria-pressed={captions} className="hover-scale">
        <Captions />
      </Button>
    </div>
  );
}
