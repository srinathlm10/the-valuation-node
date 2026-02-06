import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { articles } from "@/data/articles";
import definitions from "@/data/definitions.json";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function Migration() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string[]>([]);

    const addLog = (msg: string) => setStatus((prev) => [...prev, msg]);

    const migrateArticles = async () => {
        addLog("Starting Articles Migration...");
        let count = 0;

        for (const article of articles) {
            const {
                id, title, excerpt, content, category, difficulty,
                readingTime, author, publishedAt, imageUrl,
                keyTakeaways, relatedArticleIds
            } = article;

            const { error } = await supabase.from('articles').upsert({
                id,
                title,
                excerpt,
                content,
                category_id: category, // Mapping category string to category_id
                difficulty,
                reading_time: readingTime,
                author,
                published_at: publishedAt,
                image_url: imageUrl,
                key_takeaways: keyTakeaways,
                related_article_ids: relatedArticleIds
            });

            if (error) {
                addLog(`❌ Error migrating article ${id}: ${error.message}`);
            } else {
                count++;
            }
        }
        addLog(`✅ Successfully migrated ${count}/${articles.length} articles.`);
    };

    const migrateDefinitions = async () => {
        addLog("Starting Definitions Migration...");
        let count = 0;

        // Process in batches of 50 to avoid request size limits
        const batchSize = 50;
        for (let i = 0; i < definitions.length; i += batchSize) {
            const batch = definitions.slice(i, i + batchSize);

            const formattedBatch = batch.map(def => ({
                id: def.id,
                term: def.term,
                full_name: def.fullName,
                category_id: "investing", // Defaulting to one category ID if specific mapping isn't available, or map roughly
                // Ideally we would map definitions categories to valid category_ids, but definitions.json uses 
                // "Investment Planning", "Profitability Ratios" etc which don't all exist in our 'categories' table yet.
                // For the schema we created, we allowed 'category' text column in definitions table specifically for this.
                category: def.category,
                definition: def.definition,
                formula: def.formula,
                why_it_matters: def.whyItMatters,
                example: def.example,
                related_terms: def.relatedTerms
            }));

            const { error } = await supabase.from('definitions').upsert(formattedBatch);

            if (error) {
                addLog(`❌ Error migrating definitions batch ${i}: ${error.message}`);
            } else {
                count += batch.length;
                addLog(`Processing... ${count}/${definitions.length}`);
            }
        }

        addLog(`✅ Successfully migrated ${count} definitions.`);
    };

    const runMigration = async () => {
        setLoading(true);
        setStatus([]);
        try {
            await migrateArticles();
            await migrateDefinitions();
            addLog("🎉 MIGRATION COMPLETE!");
        } catch (error) {
            addLog(`❌ Critical Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-12 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Database Migration Tool</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                        {status.length === 0 ? (
                            <p className="text-muted-foreground">Ready to migrate data...</p>
                        ) : (
                            status.map((log, i) => (
                                <div key={i} className="mb-1">{log}</div>
                            ))
                        )}
                    </div>

                    <Button
                        className="w-full"
                        onClick={runMigration}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Migrating...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Start Migration
                            </>
                        )}
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
                        <AlertCircle className="h-4 w-4" />
                        <p>Ensure tables exist in Supabase before clicking Start.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
