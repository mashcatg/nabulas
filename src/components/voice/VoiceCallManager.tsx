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
  const captionsRef = useRef<boolean>(true);

  // Keep captionsRef in sync
  useEffect(() => {
    captionsRef.current = captions;
  }, [captions]);

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

  // Lazy init Vapi only when available via edge function providing publishable key
  const ensureVapi = async () => {
    if (vapiRef.current) return vapiRef.current;
    try {
      const { data, error } = await supabase.functions.invoke("vapi-config");
      if (error || !data?.publicKey) {
        console.warn("VAPI config not available", error);
        return null; // run in stub mode without SDK
      }
      // Store assistant id for later
      (callIdRef as any).assistantId = data.assistantId;
      vapiRef.current = new Vapi(data.publicKey);
      return vapiRef.current;
    } catch (e) {
      console.warn("VAPI init failed, running in stub mode", e);
      return null;
    }
  };

  const startCall = async () => {
    // Resolve user with fallback to avoid race conditions
    const { data: userData } = await supabase.auth.getUser();
    const authUser = user ?? userData?.user ?? null;
    if (!authUser) {
      toast({ title: "Sign in required", description: "Please sign in to start a call." });
      return;
    }

    setTranscript([]);
    setDuration(0);

    // Try to init Vapi (optional). If unavailable, we still run UI and create a placeholder row on end.
    const vapi = await ensureVapi();
    if (vapi) {
      try {
        // Use assistantId provided by config
        const assistantId = (callIdRef as any).assistantId;
        const call = await vapi.start({ assistantId, metadata: { user_id: authUser.id } });
        callIdRef.current = call?.id ?? null;

        vapi.on("speech", (ev: any) => {
          if (!ev?.text) return;
          if (!captionsRef.current) return; // Respect captions toggle
          setTranscript((prev) => [...prev, { t: Date.now(), text: ev.text }]);
        });

        setActive(true);
      } catch (err: any) {
        console.error("VAPI start error", err);
        toast({ title: "Call failed", description: err?.message ?? "Could not start the call" });
        return;
      }
    } else {
      // Stub transcript simulation (minimal)
      setActive(true);
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

    // Persist a conversation row with metadata and trigger analysis
    if (user) {
      const assistantId = (callIdRef as any).assistantId ?? null;
      const { data, error } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, duration, vapi_call_id: callId ?? null, title: "Conversation", assistant_id: assistantId, transcript })
        .select("id")
        .maybeSingle();
      if (error) {
        console.error(error);
        toast({ title: "Save failed", description: "Could not save conversation." });
      } else if (data?.id) {
        // Fire-and-forget generate-report
        try {
          await supabase.functions.invoke("generate-report", {
            body: { conversation_id: data.id, vapi_call_id: callId ?? null, transcript },
          });
        } catch (e) {
          console.warn("generate-report invoke failed", e);
        }
        toast({ title: "Conversation saved", description: "Analysis will be ready shortly in Chat." });
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
      toggleMute: () => {
        setMuted((m) => {
          const next = !m;
          try {
            const vapi = vapiRef.current;
            if (vapi?.setMuted) vapi.setMuted(next);
            else if (next) vapi?.mute?.();
            else vapi?.unmute?.();
          } catch (e) {
            console.warn("VAPI mute toggle failed", e);
          }
          return next;
        });
      },
      toggleCaptions: () => {
        setCaptions((c) => {
          const next = !c;
          captionsRef.current = next;
          return next;
        });
      },
    }),
    [active, muted, captions, duration, transcript]
  );

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (ctx) return ctx;

  console.warn("useVoice was called outside of VoiceProvider. Returning a no-op stub to prevent crashes.");

  // Safe no-op stub: prevents runtime crashes if provider hasn't mounted yet (e.g., during HMR)
  return {
    active: false,
    muted: false,
    captions: true,
    duration: 0,
    transcript: [],
    startCall: async () => console.warn("[useVoice stub] startCall() called without provider."),
    endCall: async () => console.warn("[useVoice stub] endCall() called without provider."),
    toggleMute: () => console.warn("[useVoice stub] toggleMute() called without provider."),
    toggleCaptions: () => console.warn("[useVoice stub] toggleCaptions() called without provider."),
  } as VoiceContextValue;
}
