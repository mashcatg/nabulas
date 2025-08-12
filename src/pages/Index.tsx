import VoiceControls from "@/components/voice/VoiceControls";

const Index = () => {
  return (
    <main className="relative min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Nabulas Healthcare Voice Assistant</h1>
      <p className="text-muted-foreground max-w-2xl mb-10">
        Start secure, real-time conversations with an AI healthcare assistant. Sign in to begin.
      </p>
      <div className="relative">
        <div className="h-28 w-28 rounded-full" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }} />
      </div>
      <VoiceControls />
    </main>
  );
};

export default Index;

