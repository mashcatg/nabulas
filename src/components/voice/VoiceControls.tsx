import { Button } from "@/components/ui/button";
import { Mic, MicOff, Captions, CaptionsOff, Phone, PhoneOff } from "lucide-react";
import { useVoice } from "./VoiceCallManager";

type VoiceControlsProps = {
  layout?: "fixed" | "center";
};

export default function VoiceControls({ layout = "fixed" }: VoiceControlsProps) {
  const { active, muted, captions, toggleMute, toggleCaptions, startCall, endCall } = useVoice();

  const containerCls =
    layout === "fixed"
      ? "fixed inset-x-0 bottom-6 md:bottom-8 mx-auto flex items-center justify-center gap-8 w-full max-w-lg px-4"
      : "relative mx-auto flex items-center justify-center gap-8";

  return (
    <div className={containerCls}>
      <Button
        variant="pill"
        size="icon"
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label={muted ? "Unmute microphone" : "Mute microphone"}
      >
        {muted ? <MicOff /> : <Mic />}
      </Button>
      <Button
        variant={"default"}
        size="round"
        onClick={active ? endCall : startCall}
        className="ring-2 ring-ring shadow-md"
        aria-pressed={active}
        aria-label={active ? "End call" : "Start call"}
      >
        {active ? <PhoneOff /> : <Phone />}
      </Button>
      <Button
        variant="pill"
        size="icon"
        onClick={toggleCaptions}
        aria-pressed={captions}
        aria-label={captions ? "Hide captions" : "Show captions"}
      >
        {captions ? <CaptionsOff /> : <Captions />}
      </Button>
    </div>
  );
}
