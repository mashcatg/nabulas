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
    const WEBHOOK_SECRET = Deno.env.get("VAPI_WEBHOOK_SECRET");
    const INTERNAL_SECRET = Deno.env.get("REPORT_FUNCTION_SECRET");

    // Verify webhook secret
    const providedSecret = req.headers.get("x-webhook-secret");
    if (!WEBHOOK_SECRET || providedSecret !== WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const payload = await req.json();
    // Expected minimal payload from VAPI webhook
    const {
      event = "",
      vapi_call_id = null,
      assistant_id = null,
      duration = null,
      metadata = {},
      transcript = null,
    } = payload || {};

    const user_id = metadata?.user_id || null;

    if (!user_id) {
      console.warn("vapi-webhook: missing user_id in metadata");
    }

    // Upsert conversation by vapi_call_id if provided; otherwise insert new row
    if (vapi_call_id) {
      const { error } = await supabase
        .from("conversations")
        .upsert(
          {
            vapi_call_id,
            user_id,
            assistant_id,
            duration,
            metadata,
            transcript,
            title: "Conversation",
          },
          { onConflict: "vapi_call_id" }
        );
      if (error) throw error;
    } else if (user_id) {
      const { error } = await supabase
        .from("conversations")
        .insert({ user_id, assistant_id, duration, metadata, transcript, title: "Conversation" });
      if (error) throw error;
    }

    // Trigger report generation in the background (secured with internal secret)
    if (INTERNAL_SECRET) {
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/generate-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-internal-secret": INTERNAL_SECRET, ...corsHeaders },
          body: JSON.stringify({ vapi_call_id, transcript }),
        });
      } catch (e) {
        console.warn("generate-report invoke failed", e);
      }
    } else {
      console.warn("REPORT_FUNCTION_SECRET not set; skipping generate-report call");
    }

    return new Response(JSON.stringify({ ok: true, received: event || "event" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("vapi-webhook error", error);
    return new Response(JSON.stringify({ error: error?.message || "unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
