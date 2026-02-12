/**
 * Standalone script to populate RAG embeddings.
 * 
 * WHERE TO RUN: PowerShell/Terminal
 * COMMAND: node scripts/runPopulateEmbeddings.js
 * 
 * This script fetches all articles and definitions from Supabase,
 * then calls the generate-embeddings Edge Function for each one.
 * No need to run the dev server.
 */

const SUPABASE_URL = "https://rjmjzumuzxrptnncrqwc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqbWp6dW11enhycHRubmNycXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjYyMTUsImV4cCI6MjA4NTgwMjIxNX0.tZDknNPVjB2mEHYCvfCqihA0vhYHlDTXVY3T7KXtBmY";

async function supabaseQuery(table, select = "*") {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch ${table}: ${res.status} ${await res.text()}`);
    }
    return res.json();
}

async function generateEmbedding(item) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-embeddings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
            contentType: item.contentType,
            contentId: item.contentId,
            title: item.title,
            content: item.content,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed: ${res.status} - ${errorText}`);
    }
    return res.json();
}

async function main() {
    console.log("🚀 RAG Embedding Population Script");
    console.log("====================================\n");

    // Step 1: Fetch articles
    console.log("📚 Fetching articles...");
    let articles = [];
    try {
        articles = await supabaseQuery("articles", "id,title,content");
        console.log(`   Found ${articles.length} articles\n`);
    } catch (error) {
        console.log(`   ⚠️ No articles table or error: ${error.message}\n`);
    }

    // Step 2: Fetch definitions
    console.log("📖 Fetching definitions...");
    let definitions = [];
    try {
        definitions = await supabaseQuery("definitions", "id,term,definition");
        console.log(`   Found ${definitions.length} definitions\n`);
    } catch (error) {
        console.log(`   ⚠️ No definitions table or error: ${error.message}\n`);
    }

    // Step 3: Prepare content items
    const contentItems = [
        ...articles.map((a) => ({
            contentType: "article",
            contentId: a.id,
            title: a.title,
            content: `${a.title}\n\n${a.content || ""}`,
        })),
        ...definitions.map((d) => ({
            contentType: "definition",
            contentId: d.id,
            title: d.term,
            content: `${d.term}: ${d.definition || ""}`,
        })),
    ];

    if (contentItems.length === 0) {
        console.log("⚠️ No content found to generate embeddings for.");
        console.log("   Make sure you have articles or definitions in your database.");
        return;
    }

    console.log(`📊 Total items to process: ${contentItems.length}\n`);
    console.log("⏳ Generating embeddings (this may take a few minutes)...\n");

    // Step 4: Process in batches
    let processed = 0;
    let failed = 0;
    const batchSize = 5;

    for (let i = 0; i < contentItems.length; i += batchSize) {
        const batch = contentItems.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(contentItems.length / batchSize);

        console.log(`📦 Batch ${batchNum}/${totalBatches}:`);

        const promises = batch.map(async (item) => {
            try {
                await generateEmbedding(item);
                processed++;
                console.log(`   ✅ ${item.title}`);
            } catch (error) {
                failed++;
                console.log(`   ❌ Failed: ${item.title} - ${error.message}`);
            }
        });

        await Promise.all(promises);

        // Wait between batches to avoid rate limiting
        if (i + batchSize < contentItems.length) {
            console.log("   ⏳ Waiting 2 seconds...\n");
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    // Step 5: Print results
    console.log("\n====================================");
    console.log("🎉 Embedding Population Complete!");
    console.log(`   Total:     ${contentItems.length}`);
    console.log(`   Processed: ${processed} ✅`);
    console.log(`   Failed:    ${failed} ❌`);
    console.log("====================================\n");

    if (processed > 0) {
        console.log("✅ FinBot can now search your content using RAG!");
        console.log("   Test it by asking questions about your articles.");
    }
}

main().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
});
