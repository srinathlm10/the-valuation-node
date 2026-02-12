import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle2, XCircle, Info } from 'lucide-react';
import { populateEmbeddings } from '@/scripts/populateEmbeddings';

export function EmbeddingAdmin() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState<{ processed: number; failed: number; total: number } | null>(null);

    const handlePopulate = async () => {
        setStatus('loading');
        setMessage('Generating embeddings for all articles and definitions...');
        setStats(null);

        try {
            const result = await populateEmbeddings();
            setStats(result);
            setStatus('success');
            setMessage(`Successfully generated embeddings! Processed: ${result.processed}, Failed: ${result.failed}`);
        } catch (error) {
            setStatus('error');
            setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
            console.error('Embedding population error:', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    RAG System - Populate Embeddings
                </CardTitle>
                <CardDescription>
                    Generate vector embeddings for all articles and definitions to enable semantic search in FinBot.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        This will process all existing articles and definitions, generating vector embeddings that allow FinBot to search and use your content intelligently. This process may take a few minutes depending on the amount of content.
                    </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={handlePopulate}
                        disabled={status === 'loading'}
                        className="w-full sm:w-auto"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Embeddings...
                            </>
                        ) : (
                            <>
                                <Database className="mr-2 h-4 w-4" />
                                Populate Embeddings
                            </>
                        )}
                    </Button>

                    {status !== 'idle' && (
                        <Alert variant={status === 'error' ? 'destructive' : 'default'}>
                            {status === 'success' && <CheckCircle2 className="h-4 w-4" />}
                            {status === 'error' && <XCircle className="h-4 w-4" />}
                            {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    {stats && status === 'success' && (
                        <div className="rounded-lg border p-4 space-y-2">
                            <h4 className="font-semibold text-sm">Statistics</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Processed</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.processed}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Failed</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>What this does:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Fetches all articles and definitions from the database</li>
                        <li>Generates 768-dimensional vector embeddings using Gemini AI</li>
                        <li>Stores embeddings in the knowledge base for semantic search</li>
                        <li>Enables FinBot to find and cite relevant content when answering questions</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
