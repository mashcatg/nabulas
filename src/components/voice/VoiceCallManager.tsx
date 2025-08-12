import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
// VAPI Web SDK (optional; we keep it lazy and guarded)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Vapi from "@vapi-ai/web";

export type TranscriptItem = { t: number; text: string };

type VoiceContextValue = {
  active: boolean;
  muted: boolean;
  captions: boolean;
  duration: number; // seconds
  transcript: TranscriptItem[];
  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  toggleCaptions: () => void;
};

const VoiceContext = createContext<VoiceContextValue | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);

  const timerRef = useRef<number | null>(null);
  const vapiRef = useRef<any | null>(null);
  const callIdRef = useRef<string | null>(null);

  // Simple timer
  useEffect(() => {
    if (active && timerRef.current == null) {
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    }
    if (!active && timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current != null) window.clearInterval(timerRef.current);
    };
  }, [active]);

  // Lazy init Vapi only when available (public key may be provided later)
  const ensureVapi = async () => {
    if (vapiRef.current) return vapiRef.current;
    try {
      // In a future step, fetch a publishable key from an Edge Function if needed
      const publicKey = null; // placeholder; use edge function to retrieve if required
      if (!publicKey) return null; // run in stub mode without SDK
      vapiRef.current = new Vapi(publicKey);
      return vapiRef.current;
    } catch (e) {
      console.warn("VAPI init failed, running in stub mode", e);
      return null;
    }
  };

  const startCall = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to start a call." });
      return;
    }
    setTranscript([]);
    setDuration(0);
    setActive(true);

    // Try to init Vapi (optional). If unavailable, we still run UI and create a placeholder row on end.
    const vapi = await ensureVapi();
    if (vapi) {
      try {
        // Example only: replace with real start params as needed
        const call = await vapi.start({ assistant: { name: "Assistant" }, metadata: { user_id: user.id } });
        callIdRef.current = call?.id ?? null;

        vapi.on("speech", (ev: any) => {
          if (!ev?.text) return;
          setTranscript((prev) => [...prev, { t: Date.now(), text: ev.text }]);
        });
      } catch (err: any) {
        console.error("VAPI start error", err);
        toast({ title: "Call failed", description: err?.message ?? "Could not start the call" });
      }
    } else {
      // Stub transcript simulation (minimal)
      setTimeout(() => setTranscript((p) => [...p, { t: Date.now(), text: "Call started (stub)." }]), 600);
    }
    toast({ title: "Call started", description: "You can speak now." });
  };

  const endCall = async () => {
    setActive(false);
    const callId = callIdRef.current;

    try {
      const vapi = vapiRef.current;
      if (vapi?.stop) await vapi.stop();
    } catch (e) {
      console.warn("VAPI stop failed", e);
    }

    // Persist a conversation row (minimal) so the Chat page has something to show
    if (user) {
      const { data, error } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, duration, vapi_call_id: callId ?? null, title: "Conversation" })
        .select("id")
        .maybeSingle();
      if (error) {
        console.error(error);
        toast({ title: "Save failed", description: "Could not save conversation." });
      } else if (data?.id) {
        toast({ title: "Conversation saved", description: "You can view details in the Chat page." });
      }
    }

    toast({ title: "Call ended" });
  };

  const value = useMemo(
    () => ({
      active,
      muted,
      captions,
      duration,
      transcript,
      startCall,
      endCall,
      toggleMute: () => setMuted((m) => !m),
      toggleCaptions: () => setCaptions((c) => !c),
    }),
    [active, muted, captions, duration, transcript]
  );

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used within a VoiceProvider");
  return ctx;
}
