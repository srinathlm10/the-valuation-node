import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function EmbeddingManager() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const { toast } = useToast();

    const addLog = (message: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
    };

    const handleRegenerate = async () => {
        if (!confirm("This will regenerate embeddings for ALL articles and definitions. This might take a while. Continue?")) return;

        setLoading(true);
        setProgress(0);
        setLogs([]);
        addLog("Starting embedding generation process...");

        try {
            // 1. Fetch all content
            addLog("Fetching articles and definitions...");

            const { data: articles, error: articlesError } = await supabase
                .from('articles')
                .select('id, title, content');

            if (articlesError) throw articlesError;

            const { data: definitions, error: definitionsError } = await supabase
                .from('definitions')
                .select('id, term, definition');

            if (definitionsError) throw definitionsError;

            const totalItems = (articles?.length || 0) + (definitions?.length || 0);
            addLog(`Found ${articles?.length} articles and ${definitions?.length} definitions. Total: ${totalItems}`);

            let processed = 0;
            let failed = 0;

            // 2. Process Articles
            if (articles) {
                for (const article of articles) {
                    try {
                        addLog(`Processing article: ${article.title}...`);
                        const { error } = await supabase.functions.invoke('generate-embeddings', {
                            body: {
                                contentType: 'article',
                                contentId: article.id,
                                title: article.title,
                                content: article.content
                            }
                        });

                        if (error) throw error;
                        processed++;
                    } catch (e: any) {
                        console.error(`Error processing article ${article.title}:`, e);
                        failed++;
                        addLog(`❌ Failed: ${article.title} - ${e.message}`);
                    }

                    setProgress(Math.round(((processed + failed) / totalItems) * 100));
                }
            }

            // 3. Process Definitions
            if (definitions) {
                for (const def of definitions) {
                    try {
                        addLog(`Processing definition: ${def.term}...`);
                        const { error } = await supabase.functions.invoke('generate-embeddings', {
                            body: {
                                contentType: 'definition',
                                contentId: def.id,
                                title: def.term,
                                content: def.definition
                            }
                        });

                        if (error) throw error;
                        processed++;
                    } catch (e: any) {
                        console.error(`Error processing definition ${def.term}:`, e);
                        failed++;
                        addLog(`❌ Failed: ${def.term} - ${e.message}`);
                    }
                    setProgress(Math.round(((processed + failed) / totalItems) * 100));
                }
            }

            addLog(`✅ Completed! Processed: ${processed}, Failed: ${failed}`);
            toast({
                title: "Regeneration Complete",
                description: `Successfully processed ${processed} items.`
            });

        } catch (error: any) {
            console.error("Embedding generation failed:", error);
            addLog(`❌ CRITICAL ERROR: ${error.message}`);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            });
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Embedding Manager</h2>
                <p className="text-slate-400">Manage vector embeddings for the RAG system.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-800 bg-slate-900/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-purple-400" />
                            Regenerate Embeddings
                        </CardTitle>
                        <CardDescription>
                            Re-creates vector embeddings for all content. Use this after adding new content or changing the embedding model.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 text-sm text-yellow-200 flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                <p>This operation processes every single article and definition. It may take several minutes and consume API quota.</p>
                            </div>

                            <Button
                                onClick={handleRegenerate}
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Processing... {progress}%
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Regenerate All
                                    </>
                                )}
                            </Button>

                            {loading && <Progress value={progress} className="h-2" />}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/30 flex flex-col">
                    <CardHeader>
                        <CardTitle>Process Logs</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <ScrollArea className="h-[300px] w-full rounded-md border border-slate-800 bg-slate-950 p-4">
                            {logs.length === 0 ? (
                                <div className="text-center text-muted-foreground pt-10">
                                    Logs will appear here...
                                </div>
                            ) : (
                                <div className="space-y-1 font-mono text-xs">
                                    {logs.map((log, i) => (
                                        <div key={i} className={log.includes("❌") ? "text-red-400" : log.includes("✅") ? "text-emerald-400" : "text-slate-400"}>
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
