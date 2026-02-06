import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert messages to Gemini format
    // Gemini expects 'user' and 'model' roles. 'system' is separate or part of the first prompt.
    // We'll prepend systemPrompt to the first message or use it as instruction if supported.
    // For simple chat, prepending is safe.

    const history = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Add system prompt to the beginning if it exists, or handling via generation config if possible.
    // A simple way is to add it as a user message at the start, or modify the first user message.
    // However, google-generative-ai handles this. Let's just use the history for chat.model.
    // Actually, `systemInstruction` is supported in newer models but let's stick to simple prompting for compatibility or prepend.

    // Better approach: Prepend system prompt to the chat history as the context.
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nStrictly follow the above instructions.` }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am FinBot, ready to help with Indian financial markets and regulations." }],
        },
        ...history.slice(0, -1) // All except the last new message
      ],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ message: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
