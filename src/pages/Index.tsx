import VoiceControls from "@/components/voice/VoiceControls";
import { useVoice } from "@/components/voice/VoiceCallManager";
import { ShiningText } from "@/components/ui/shining-text";
const Index = () => {
  const { duration, transcript, captions, connecting, connectingMessage } = useVoice();
  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(duration % 60).padStart(2, "0");
  const lastLine = transcript.length ? transcript[transcript.length - 1].text : "";

  return (
    
    <main className="relative flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 animate-fade-in">
  Nabulas{" "}
  <span className="bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
  Healthcare
</span>
{" "}
  Voice Assistant
</h1>
      <p className="text-sm text-muted-foreground max-w-4xl mb-10 animate-fade-in">
        Start secure, real-timeconsultations with an AI healthcare assistant. Feel like your personal doctor.
      </p>
      <div className="relative flex flex-col items-center gap-3">
        <div className="text-sm text-muted-foreground">{mm}:{ss}</div>
        <div className="h-28 w-28 rounded-full" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }} />
        {connecting ? (
          <div className="text-xs text-muted-foreground max-w-md px-3 py-2 rounded-md border animate-fade-in">
            <ShiningText text={connectingMessage} />
          </div>
        ) : (
          captions && lastLine && (
            <div className="text-xs text-muted-foreground max-w-md px-3 py-2 rounded-md border animate-fade-in">
              <ShiningText text={lastLine} />
            </div>
          )
        )}

      </div>
      <div className="mt-8">
        <VoiceControls layout="center" />
      </div>
    </main>
  );
};

export default Index;
