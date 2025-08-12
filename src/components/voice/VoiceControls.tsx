import { Button } from "@/components/ui/button";
import { Mic, MicOff, Captions, Phone, PhoneOff } from "lucide-react";
import { useState } from "react";

type VoiceControlsProps = {
  layout?: "fixed" | "center";
};

export default function VoiceControls({ layout = "fixed" }: VoiceControlsProps) {
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [active, setActive] = useState(false);

  const containerCls =
    layout === "fixed"
      ? "fixed inset-x-0 bottom-24 md:bottom-10 mx-auto flex items-center justify-center gap-6 w-full max-w-lg"
      : "relative mx-auto flex items-center justify-center gap-6";

  return (
    <div className={containerCls}>
      <Button
        variant="pill"
        size="icon"
        onClick={() => setMuted((m) => !m)}
        aria-pressed={muted}
        aria-label={muted ? "Unmute microphone" : "Mute microphone"}
        className="hover-scale"
      >
        {muted ? <MicOff /> : <Mic />}
      </Button>
      <Button
        variant="hero"
        size="round"
        onClick={() => setActive((a) => !a)}
        className={`${active ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"} ring-2 ring-ring shadow-md`}
        aria-pressed={active}
        aria-label={active ? "End call" : "Start call"}
      >
        {active ? <PhoneOff /> : <Phone />}
      </Button>
      <Button
        variant="pill"
        size="icon"
        onClick={() => setCaptions((c) => !c)}
        aria-pressed={captions}
        aria-label={captions ? "Hide captions" : "Show captions"}
        className="hover-scale"
      >
        <Captions />
      </Button>
    </div>
  );
}
