import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal, Plus, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Article {
    id: string;
    title: string;
    category: string; // This might be category_id or joined name depending on query
    author: string;
    published_at: string;
    created_at: string;
}

interface ArticleListProps {
    onEdit: (article: Article) => void;
    onCreate: () => void;
}

export function ArticleList({ onEdit, onCreate }: ArticleListProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error("Error fetching articles:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load articles."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;

        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Article deleted successfully."
            });
            fetchArticles(); // Refresh list
        } catch (error) {
            console.error("Error deleting article:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete article."
            });
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search articles..."
                        className="pl-9 bg-slate-900 border-slate-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={onCreate} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4" /> New Article
                </Button>
            </div>

            <div className="rounded-md border border-slate-800 bg-slate-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-slate-900/50">
                            <TableHead className="text-slate-400">Title</TableHead>
                            <TableHead className="text-slate-400">Category</TableHead>
                            <TableHead className="text-slate-400">Author</TableHead>
                            <TableHead className="text-slate-400">Published</TableHead>
                            <TableHead className="text-right text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div>
                                </TableCell>
                            </TableRow>
                        ) : filteredArticles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No articles found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredArticles.map((article) => (
                                <TableRow key={article.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-slate-200">{article.title}</TableCell>
                                    <TableCell className="text-slate-400">{article.category}</TableCell>
                                    <TableCell className="text-slate-400">{article.author}</TableCell>
                                    <TableCell className="text-slate-400">
                                        {article.published_at ? format(new Date(article.published_at), 'MMM d, yyyy') : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                                <DropdownMenuItem onClick={() => onEdit(article)} className="hover:bg-slate-800 cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(article.id)} className="text-red-400 hover:text-red-300 hover:bg-slate-800 cursor-pointer">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
