import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ArticleEditorProps {
    articleId?: string | null;
    onCancel: () => void;
    onSuccess: () => void;
}

const CATEGORIES = [
    { id: "investing", name: "Investing" },
    { id: "budgeting", name: "Budgeting" },
    { id: "taxes", name: "Taxes" },
    { id: "retirement", name: "Retirement" },
    { id: "credit", name: "Credit & Debt" },
];

export function ArticleEditor({ articleId, onCancel, onSuccess }: ArticleEditorProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        id: "", // slug
        title: "",
        excerpt: "",
        content: "",
        category_id: "",
        difficulty: "beginner",
        reading_time: 5,
        image_url: "",
    });

    useEffect(() => {
        if (articleId) {
            loadArticle(articleId);
        }
    }, [articleId]);

    const loadArticle = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    id: data.id,
                    title: data.title,
                    excerpt: data.excerpt,
                    content: data.content,
                    category_id: data.category_id,
                    difficulty: data.difficulty,
                    reading_time: data.reading_time,
                    image_url: data.image_url || "",
                });
            }
        } catch (error) {
            console.error("Error loading article:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load article details."
            });
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Only auto-generate slug for new articles
        if (!articleId) {
            setFormData(prev => ({ ...prev, title, id: generateSlug(title) }));
        } else {
            setFormData(prev => ({ ...prev, title }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            if (articleId) {
                // Update existing
                const { error } = await supabase
                    .from('articles')
                    .update({
                        title: formData.title,
                        excerpt: formData.excerpt,
                        content: formData.content,
                        category_id: formData.category_id,
                        difficulty: formData.difficulty,
                        reading_time: formData.reading_time,
                        image_url: formData.image_url,
                    })
                    .eq('id', articleId);

                if (error) throw error;
                toast({ title: "Success", description: "Article updated successfully." });
            } else {
                // Create new
                const { error } = await supabase
                    .from('articles')
                    .insert({
                        id: formData.id,
                        title: formData.title,
                        excerpt: formData.excerpt,
                        content: formData.content,
                        category_id: formData.category_id,
                        difficulty: formData.difficulty,
                        reading_time: formData.reading_time,
                        image_url: formData.image_url,
                        author: user.user_metadata.full_name || "Admin",
                        published_at: new Date().toISOString(),
                    });

                if (error) throw error;
                toast({ title: "Success", description: "Article created successfully." });
            }
            onSuccess();
        } catch (error: any) {
            console.error("Error saving article:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to save article."
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    {articleId ? "Edit Article" : "New Article"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 border border-slate-800 bg-slate-900/50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            required
                            value={formData.title}
                            onChange={handleTitleChange}
                            className="bg-slate-900 border-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (ID)</Label>
                        <Input
                            id="slug"
                            required
                            value={formData.id}
                            disabled={!!articleId} // Slugs shouldn't change for SEO/Links
                            onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                            className="bg-slate-900 border-slate-700 font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={formData.category_id}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}
                            required
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                            value={formData.difficulty}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, difficulty: val }))}
                            required
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700">
                                <SelectValue placeholder="Select Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reading_time">Reading Time (mins)</Label>
                        <Input
                            id="reading_time"
                            type="number"
                            min="1"
                            value={formData.reading_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) }))}
                            className="bg-slate-900 border-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL (Optional)</Label>
                        <Input
                            id="image_url"
                            value={formData.image_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                            className="bg-slate-900 border-slate-700"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                    <Textarea
                        id="excerpt"
                        required
                        rows={2}
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="bg-slate-900 border-slate-700 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                        id="content"
                        required
                        rows={15}
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="bg-slate-900 border-slate-700 font-mono"
                        placeholder="# Article Heading..."
                    />
                    <p className="text-xs text-muted-foreground">Markdown supported. Use **bold**, # headings, - lists, etc.</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                    <Button type="button" variant="ghost" onClick={onCancel} className="mr-2">Cancel</Button>
                    <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {articleId ? "Update Article" : "Create Article"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
