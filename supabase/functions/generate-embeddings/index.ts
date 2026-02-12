import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.12.0";

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

        // Generate embedding using Gemini
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(content);
        const embedding = result.embedding.values;

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
