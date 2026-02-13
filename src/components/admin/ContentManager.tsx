import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, BookOpen } from "lucide-react";
import { ArticleList } from "./ArticleList";
import { ArticleEditor } from "./ArticleEditor";

export default function ContentManager() {
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

    const handleEdit = (article: any) => {
        setSelectedArticleId(article.id);
        setView("edit");
    };

    const handleCreate = () => {
        setSelectedArticleId(null);
        setView("create");
    };

    const handleBack = () => {
        setView("list");
        setSelectedArticleId(null);
    };

    if (view === "create" || view === "edit") {
        return (
            <ArticleEditor
                articleId={selectedArticleId}
                onCancel={handleBack}
                onSuccess={handleBack}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Content Manager</h2>
                <p className="text-slate-400">Manage your educational content and definitions.</p>
            </div>

            <Tabs defaultValue="articles" className="space-y-4">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="articles" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                        <FileText className="mr-2 h-4 w-4" /> Articles
                    </TabsTrigger>
                    <TabsTrigger value="definitions" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                        <BookOpen className="mr-2 h-4 w-4" /> Definitions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="articles" className="space-y-4">
                    <Card className="border-slate-800 bg-slate-900/30">
                        <CardHeader>
                            <CardTitle>Articles</CardTitle>
                            <CardDescription>Published educational articles.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ArticleList onEdit={handleEdit} onCreate={handleCreate} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="definitions">
                    <Card className="border-slate-800 bg-slate-900/30">
                        <CardHeader>
                            <CardTitle>Definitions</CardTitle>
                            <CardDescription>Financial terms and glossary items.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground border-2 border-dashed border-slate-800 rounded-lg">
                                Definitions Manager Coming Soon
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
