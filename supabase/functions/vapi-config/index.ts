export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // verify_jwt = true in config ensures only authenticated requests reach here
    const publicKey = Deno.env.get("VAPI_PUBLIC_KEY") || "";
    const assistantId = Deno.env.get("ASSISTANT_ID") || "";

    if (!publicKey || !assistantId) {
      return new Response(
        JSON.stringify({ error: "Missing VAPI configuration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ publicKey, assistantId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("vapi-config error", e);
    return new Response(
      JSON.stringify({ error: "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
