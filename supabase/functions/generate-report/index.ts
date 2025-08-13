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
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const INTERNAL_SECRET = Deno.env.get("REPORT_FUNCTION_SECRET");

    const authHeader = req.headers.get("Authorization");
    const providedInternal = req.headers.get("x-internal-secret");
    const isInternal = INTERNAL_SECRET && providedInternal === INTERNAL_SECRET;

    // Build a Supabase client respecting caller privileges
    const supabase = isInternal
      ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
      : authHeader
      ? createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } })
      : null;

    if (!supabase) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    const { conversation_id = null, vapi_call_id = null, transcript = null } = await req.json();

    // Pull Vapi call details if no transcript provided
    let vapi: any = null;
    let transcriptText = typeof transcript === "string" ? transcript : "";
    try {
      const VAPI_PRIVATE_KEY = Deno.env.get("VAPI_PRIVATE_KEY");
      if (!transcriptText && vapi_call_id && VAPI_PRIVATE_KEY) {
        const tryUrls = [
          `https://api.vapi.ai/calls/${vapi_call_id}`,
          `https://api.vapi.ai/call/${vapi_call_id}`,
        ];
        for (const url of tryUrls) {
          const r = await fetch(url, { headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` } });
          if (r.ok) {
            vapi = await r.json();
            break;
          }
        }
        if (vapi) {
          transcriptText = vapi?.transcript || "";
          if (!transcriptText && Array.isArray(vapi?.messages)) {
            const parts = vapi.messages
              .filter((m: any) => m?.role && m?.message)
              .map((m: any) => `${m.role === 'bot' ? 'AI' : 'User'}: ${m.message}`);
            transcriptText = parts.join("\n");
          }
        }
      }
    } catch (e) {
      console.warn("Failed to fetch Vapi details for report", e);
    }

    // Build DeepSeek prompt and parse structured JSON
    let gen = {
      title: "Conversation",
      summary: "",
      patient_report: {
        title: "Patient Report",
        key_points: [] as string[],
        symptoms: [] as string[],
        risks: [] as string[],
        ai_recommendations: [] as string[],
        actions: [] as string[],
        follow_up_questions: [] as string[],
        confidence: 0.5,
      },
    };

    const preferVapiSummary = vapi?.analysis?.summary || vapi?.summary || "";

    if (DEEPSEEK_API_KEY && transcriptText) {
      try {
        const prompt = `You are a clinical AI scribe. From the transcript below, produce STRICT JSON with this exact shape:\n\n{\n  \"title\": string (<= 60 chars),\n  \"summary\": string (1-3 sentences),\n  \"patient_report\": {\n    \"title\": string,\n    \"key_points\": string[],\n    \"symptoms\": string[],\n    \"risks\": string[],\n    \"ai_recommendations\": string[],\n    \"actions\": string[],\n    \"follow_up_questions\": string[],\n    \"confidence\": number\n  }\n}\n\nNo prose, only JSON. Transcript:\n${transcriptText}`;

        const resp = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "Return only JSON." },
              { role: "user", content: prompt },
            ],
            temperature: 0.2,
          }),
        });
        const js = await resp.json();
        const content: string = js?.choices?.[0]?.message?.content || "";
        const jsonStr = (() => {
          try { return JSON.parse(content), content; } catch { /* not pure JSON */ }
          const start = content.indexOf("{");
          const end = content.lastIndexOf("}");
          if (start >= 0 && end > start) return content.slice(start, end + 1);
          return "";
        })();
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          gen = {
            title: parsed.title || gen.title,
            summary: parsed.summary || "",
            patient_report: { ...gen.patient_report, ...(parsed.patient_report || {}) },
          };
        }
      } catch (e) {
        console.warn("DeepSeek JSON parsing failed", e);
      }
    }

    const finalTitle = gen.title || "Conversation";
    const finalSummary = preferVapiSummary || gen.summary || "Auto-generated summary pending.";

    const update: any = { title: finalTitle, summary: finalSummary, patient_report: gen.patient_report };

    if (conversation_id) {
      const { error } = await supabase
        .from("conversations")
        .update(update)
        .eq("id", conversation_id);
      if (error) throw error;
    } else if (vapi_call_id) {
      const { error } = await supabase
        .from("conversations")
        .update(update)
        .eq("vapi_call_id", vapi_call_id);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ ok: true, update }), {
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
