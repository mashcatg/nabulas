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
    const VAPI_PRIVATE_KEY = Deno.env.get("VAPI_PRIVATE_KEY");
    if (!VAPI_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: "Missing VAPI_PRIVATE_KEY" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { vapi_call_id } = await req.json();
    if (!vapi_call_id) {
      return new Response(JSON.stringify({ error: "vapi_call_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the requester can access this conversation (owner or public)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("id")
      .eq("vapi_call_id", vapi_call_id)
      .maybeSingle();
    if (convErr || !conv) {
      return new Response(JSON.stringify({ error: "conversation not accessible" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch from VAPI once access is validated (try /calls then fallback /call)
    const tryEndpoints = [
      `https://api.vapi.ai/calls/${vapi_call_id}`,
      `https://api.vapi.ai/call/${vapi_call_id}`,
    ];

    let data: any = null;
    let lastErr: string | null = null;
    for (const url of tryEndpoints) {
      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (resp.ok) {
        data = await resp.json();
        break;
      } else {
        lastErr = await resp.text();
      }
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Failed to fetch call details", details: lastErr }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("vapi-call-details error", error);
    return new Response(JSON.stringify({ error: error?.message || "unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
