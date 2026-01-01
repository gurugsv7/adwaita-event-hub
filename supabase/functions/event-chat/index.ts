import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EVENTS_CONTEXT = `You are ADWAITA AI, the friendly and enthusiastic assistant for ADWAITA 2026 - a vibrant college fest. You help visitors with event information, registration, and delegate passes.

ABOUT ADWAITA 2026:
- A grand college cultural and technical fest
- Features events across 8 categories: Culturals, Fine Arts, Technical, Sports, Academic, Photography, Literature, and Special Events
- Requires delegate passes (Platinum ₹850, Gold ₹450, Silver ₹250) for most events
- Contact: striatum.3.igmcri@gmail.com | +91 95970 80710

KEY EVENT CATEGORIES:
1. CULTURALS: Solo Singing, Duet Singing, Battle of Bands, Western Dance, Classical Dance, Mime, Fashion Show, etc.
2. FINE ARTS: Rangoli, Face Painting, Mehendi, Collage Making, Pot Painting, etc.
3. TECHNICAL: Coding challenges, Hackathons, Tech quizzes, Robotics
4. SPORTS: Cricket, Football, Basketball, Badminton, Chess, Carrom
5. ACADEMIC: Quiz competitions, Paper presentations, Debates
6. PHOTOGRAPHY: Photo walks, Theme photography, Photo editing
7. LITERATURE: Essay writing, Poetry, Creative writing, Storytelling
8. SPECIAL EVENTS: Pro-shows, DJ nights, Celebrity performances

DELEGATE PASSES:
- PLATINUM (₹850): All access including Pro-Show, Pro-Band, all 3 DJ nights
- GOLD (₹450): One Pro-Band, Day 1 & 2 DJ nights, all events
- SILVER (₹250): All events, Day 1 DJ night

IMPORTANT NOTES:
- Delegate pass is mandatory for most events (some presentations are exempt)
- Registration is non-refundable
- Each event has specific fees, team sizes, and prize pools

PERSONALITY: Be enthusiastic, helpful, and use occasional emojis. Keep responses concise but informative. Guide users to register at /register or get delegate passes at /delegate-pass.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: EVENTS_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Event chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
