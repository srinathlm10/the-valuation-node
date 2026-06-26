import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
                <p className="text-slate-400">Create, edit, and publish research articles.</p>
            </div>

            <Card className="border-slate-800 bg-slate-900/30">
                <CardHeader>
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>Published educational articles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ArticleList onEdit={handleEdit} onCreate={handleCreate} />
                </CardContent>
            </Card>
        </div>
    );
}
