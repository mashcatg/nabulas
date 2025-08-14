import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all conversation summaries for the user
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('id, title, summary, patient_report, created_at, duration')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch conversations' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!conversations || conversations.length === 0) {
      return new Response(JSON.stringify({ 
        insights: {
          timeline: "No conversations available for analysis.",
          summary: "Start having conversations with your AI healthcare assistant to get personalized health insights.",
          recommendations: ["Begin your first consultation to start tracking your health journey"]
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare data for AI analysis
    const conversationData = conversations.map(conv => ({
      date: conv.created_at,
      title: conv.title,
      summary: conv.summary,
      duration: conv.duration,
      patientReport: conv.patient_report
    }));

    // Get DeepSeek API key
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!deepseekApiKey) {
      console.error('DeepSeek API key not found');
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call DeepSeek API for health analysis
    const prompt = `You are a healthcare AI analyst. Analyze the following conversation history and patient reports to provide comprehensive health insights.

Conversation History:
${JSON.stringify(conversationData, null, 2)}

Please provide a structured analysis with:
1. Timeline: A chronological overview of the patient's health journey based on conversations
2. Summary: Key health patterns, concerns, and progress identified across all conversations
3. Recommendations: Specific, actionable recommendations for the patient's continued care

Format your response as JSON with keys: timeline, summary, recommendations (array of strings).
Be professional, empathetic, and focus on actionable insights while noting this is for informational purposes only.`;

    // Validate conversation data
    const validConversations = conversationData.filter(conv => 
      conv.summary || conv.patientReport
    );

    if (validConversations.length === 0) {
      return new Response(JSON.stringify({ 
        insights: {
          timeline: "No valid conversation data available for analysis.",
          summary: "Your conversations need summaries or patient reports for meaningful analysis.",
          recommendations: ["Complete your consultations to generate insights"]
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a healthcare AI analyst providing structured health insights based on conversation history.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error('DeepSeek API error:', {
        status: deepseekResponse.status,
        statusText: deepseekResponse.statusText,
        error: errorText,
      });
      return new Response(JSON.stringify({ 
        error: 'AI analysis failed',
        details: `HTTP ${deepseekResponse.status}: ${deepseekResponse.statusText}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const deepseekData = await deepseekResponse.json();
    let insights;
    
    try {
      // Try to parse AI response as JSON
      insights = JSON.parse(deepseekData.choices[0].message.content);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      console.warn('Failed to parse AI response as JSON, using fallback');
      insights = {
        timeline: deepseekData.choices[0].message.content,
        summary: "AI analysis completed successfully.",
        recommendations: ["Continue regular consultations", "Follow up on any concerning symptoms", "Maintain healthy lifestyle habits"]
      };
    }

    // Update user profile with health insights
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        health_insights: insights,
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      console.error('Error updating profile:', updateError);
      // Still return insights even if update fails
    }

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Health analysis error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});