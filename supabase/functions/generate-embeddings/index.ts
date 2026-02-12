import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

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
        const { contentType, contentId, title, content } = await req.json();

        // Initialize clients
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const geminiKey = Deno.env.get("GEMINI_API_KEY")!;

        const supabase = createClient(supabaseUrl, supabaseKey);
        const genAI = new GoogleGenerativeAI(geminiKey);

        // Generate embedding using Gemini REST API with reduced dimensions
        const embeddingResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "models/gemini-embedding-001",
                    content: { parts: [{ text: content }] },
                    outputDimensionality: 768,
                }),
            }
        );
        if (!embeddingResponse.ok) {
            const errBody = await embeddingResponse.text();
            throw new Error(`Embedding API error: ${embeddingResponse.status} - ${errBody}`);
        }
        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.embedding.values;

        // Upsert into knowledge_embeddings table
        const { data, error } = await supabase
            .from("knowledge_embeddings")
            .upsert({
                content_type: contentType,
                content_id: contentId,
                title: title,
                content: content,
                embedding: embedding,
                metadata: {
                    length: content.length,
                    generated_at: new Date().toISOString(),
                },
            }, {
                onConflict: "content_type,content_id"
            })
            .select();

        if (error) {
            throw error;
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Embedding generated successfully",
                data: data,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error generating embedding:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
