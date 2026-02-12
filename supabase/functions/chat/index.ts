import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the last user message for semantic search
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // RAG: Generate embedding for user's question and search knowledge base
    let relevantContext = "";
    try {
      // Generate embedding for the question using Gemini REST API
      const geminiKey = Deno.env.get("GEMINI_API_KEY")!;
      const embeddingResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "models/gemini-embedding-001",
            content: { parts: [{ text: lastUserMessage }] },
            outputDimensionality: 768,
          }),
        }
      );
      const embeddingData = await embeddingResponse.json();
      const queryEmbedding = embeddingData.embedding.values;

      // Search knowledge base using semantic search
      const { data: searchResults, error: searchError } = await supabase
        .rpc('search_knowledge', {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: 3
        });

      if (!searchError && searchResults && searchResults.length > 0) {
        // Inject relevant articles as context
        relevantContext = `\n\n**Relevant Knowledge Base Articles:**\n\n`;
        searchResults.forEach((result: any, index: number) => {
          const contentPreview = result.content.length > 800
            ? result.content.substring(0, 800) + "..."
            : result.content;
          relevantContext += `${index + 1}. **${result.title}** (${result.content_type}, similarity: ${(result.similarity * 100).toFixed(1)}%)\n${contentPreview}\n\n`;
        });
        relevantContext += `Use the above articles from the knowledge base to provide accurate, content-based answers.\n`;
      }
    } catch (ragError) {
      console.error("RAG search error (non-fatal):", ragError);
      // Continue without RAG if it fails
    }

    // Enhanced default system prompt with Indian market expertise
    const defaultSystemPrompt = `You are FinBot, an expert financial assistant specializing in the Indian financial market.

**Core Expertise:**
- Indian Stock Markets (NSE, BSE)
- SEBI regulations and compliance
- Mutual Funds, ETFs, and investment strategies
- Tax implications (Capital gains, TDS, Income Tax)
- Portfolio analysis and risk assessment
- Financial planning for Indian investors

**Guidelines:**

1. **Regulatory Compliance:**
   - Always cite SEBI regulations when discussing compliance (e.g., "According to SEBI circular SEBI/HO/CFD/...")
   - Reference RBI guidelines for banking and monetary policy
   - Mention Income Tax Act sections when discussing taxation

2. **Indian Market Context:**
   - Use INR (₹) for all currency references
   - Provide examples using Indian stocks (Reliance, TCS, Infosys, HDFC Bank, ITC, etc.)
   - Reference Indian indices (Nifty 50, Sensex, Nifty Bank, etc.)
   - Consider Indian market hours: NSE/BSE 9:15 AM - 3:30 PM IST

3. **Tax Considerations:**
   - LTCG (Long-term Capital Gains): >1 year holding, 10% tax above ₹1 lakh for equity
   - STCG (Short-term Capital Gains): <1 year holding, 15% tax for equity
   - Section 80C: ₹1.5 lakh deduction (ELSS, PPF, EPF, NSC, etc.)
   - Section 80D: Health insurance deductions
   - TDS on dividends, interest income

4. **Investment Advice:**
   - Emphasize diversification and risk management
   - Consider investor's risk profile (conservative, moderate, aggressive)
   - Mention both fundamental and technical analysis when relevant
   - Discuss liquidity, volatility, and market cycles

5. **Communication Style:**
   - Use simple, beginner-friendly language
   - Explain financial jargon when first used
   - Provide step-by-step explanations for complex topics
   - Use markdown formatting for tables, lists, and emphasis
   - Include practical examples from the Indian market

6. **Disclaimers:**
   - Remind users that you provide educational information, not personalized investment advice
   - Encourage users to consult SEBI-registered advisors for specific recommendations
   - Mention that past performance doesn't guarantee future results

**Response Format:**
- Use bullet points and numbered lists for clarity
- Format numbers with Indian numbering system (lakhs, crores)
- Use tables for comparisons
- Bold important terms and figures
- Include relevant emojis sparingly for engagement (📊, 💰, 📈, ⚠️)

Remember: You are helping Indian investors make informed financial decisions. Be accurate, helpful, and educational.${relevantContext}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt || defaultSystemPrompt
    });

    // Convert messages to Gemini format
    // Filter out system messages from history if we are using systemInstruction
    let history = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Gemini requires the first message in history to be from "user"
    // Remove any leading "model" messages to avoid the error
    while (history.length > 0 && history[0].role === "model") {
      history = history.slice(1);
    }

    // Ensure alternating user/model pattern (Gemini requirement)
    const cleanHistory: typeof history = [];
    for (let i = 0; i < history.length; i++) {
      if (i === 0 && history[i].role !== "user") continue;
      if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === history[i].role) continue;
      cleanHistory.push(history[i]);
    }

    const chat = model.startChat({
      history: cleanHistory.slice(0, -1), // Previous context (exclude last message)
      generationConfig: {
        maxOutputTokens: 1000,
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
