import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Optional DeepSeek support (stub friendly)
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    const { conversation_id = null, vapi_call_id = null, transcript = null } = await req.json();

    // Very simple summary/report stub; replace with real LLM call later
    let summary = "";
    let patient_report: Record<string, unknown> = {};

    const transcriptText = typeof transcript === "string" ? transcript : JSON.stringify(transcript || {});

    if (DEEPSEEK_API_KEY) {
      try {
        // Placeholder OpenAI-compatible request shape (adjust to DeepSeek API if needed)
        const resp = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "You are a medical scribe. Output concise JSON only." },
              { role: "user", content: `Create a short summary and a structured patient report JSON for this transcript: ${transcriptText}` },
            ],
            temperature: 0.2,
          }),
        });
        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content || "";
        summary = content.slice(0, 600);
        patient_report = { raw: content };
      } catch (e) {
        console.warn("DeepSeek call failed, using stub", e);
        summary = "Auto-generated summary pending.";
        patient_report = { title: "Patient Report", symptoms: [], ai_recommendations: [] };
      }
    } else {
      summary = "Auto-generated summary pending.";
      patient_report = { title: "Patient Report", symptoms: [], ai_recommendations: [] };
    }

    // Update conversation by id or by call id
    if (conversation_id) {
      const { error } = await supabase
        .from("conversations")
        .update({ summary, patient_report })
        .eq("id", conversation_id);
      if (error) throw error;
    } else if (vapi_call_id) {
      const { error } = await supabase
        .from("conversations")
        .update({ summary, patient_report })
        .eq("vapi_call_id", vapi_call_id);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("generate-report error", error);
    return new Response(JSON.stringify({ error: error?.message || "unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
