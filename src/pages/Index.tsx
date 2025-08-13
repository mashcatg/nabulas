import VoiceControls from "@/components/voice/VoiceControls";
import { useVoice } from "@/components/voice/VoiceCallManager";

const Index = () => {
  const { duration, transcript, captions } = useVoice();
  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(duration % 60).padStart(2, "0");
  const lastLine = transcript.length ? transcript[transcript.length - 1].text : "";

  return (
    <main className="relative min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 animate-fade-in">Nabulas Healthcare Voice Assistant</h1>
      <p className="text-muted-foreground max-w-2xl mb-10 animate-fade-in">
        Start secure, real-time conversations with an AI healthcare assistant. Sign in to begin.
      </p>
      <div className="relative flex flex-col items-center gap-3">
        <div className="text-sm text-muted-foreground">{mm}:{ss}</div>
        <div className="h-28 w-28 rounded-full" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }} />
        {captions && lastLine && (
          <div className="text-xs text-muted-foreground max-w-md px-3 py-2 rounded-md border animate-fade-in">
            {lastLine}
          </div>
        )}
      </div>
      <VoiceControls />
    </main>
  );
};

export default Index;
