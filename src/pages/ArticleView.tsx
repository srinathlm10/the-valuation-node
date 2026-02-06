import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { contentService } from "@/services/contentService";
import { progressService } from "@/services/progressService";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, Calendar, User, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Quiz } from "@/components/quiz/Quiz";

export default function ArticleView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [chatOpen, setChatOpen] = useState(false);

    // Fetch article content
    const { data: article, isLoading } = useQuery({
        queryKey: ['article', id],
        queryFn: () => contentService.getArticleById(id!),
        enabled: !!id,
    });

    // Fetch user progress
    const { data: completedIds = [] } = useQuery({
        queryKey: ['progress'],
        queryFn: progressService.getUserProgress,
        enabled: !!user,
    });

    const isCompleted = completedIds.includes(id || "");

    // Mutation to toggle read status
    const toggleReadMutation = useMutation({
        mutationFn: (checked: boolean) => progressService.toggleArticleRead(id!, checked),
        onSuccess: (_, checked) => {
            queryClient.invalidateQueries({ queryKey: ['progress'] });
            toast({
                title: checked ? "Marked as Read" : "Marked as Unread",
                description: checked
                    ? "Great job! Your progress has been updated."
                    : "Article removed from your completed list.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update progress. Please try again.",
                variant: "destructive",
            });
        }
    });

    if (isLoading) {
        return (
            <Layout>
                <div className="container flex min-h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!article) {
        return (
            <Layout>
                <div className="container py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
                    <Button asChild>
                        <Link to="/learn">Back to Learn</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <article className="container max-w-3xl py-12">
                <Button variant="ghost" size="sm" asChild className="mb-6">
                    <Link to="/learn">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Learn
                    </Link>
                </Button>

                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="capitalize">{article.category}</Badge>
                        <Badge variant="outline" className="capitalize">{article.difficulty}</Badge>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{article.readingTime} min read</span>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                {article.imageUrl && (
                    <div className="mb-10 overflow-hidden rounded-xl border bg-muted aspect-video">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                <Separator className="my-8" />

                {/* Quiz Section */}
                <Quiz articleId={id || ""} />

                <Separator className="my-8" />

                {/* Actions / Progress */}
                <div className="flex items-center justify-between rounded-lg border bg-card p-6 shadow-sm">
                    <div className="space-y-1">
                        <h3 className="font-semibold">Finished reading?</h3>
                        <p className="text-sm text-muted-foreground">
                            Mark this article as read to track your progress.
                        </p>
                    </div>
                    {user ? (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="mark-read"
                                checked={isCompleted}
                                onCheckedChange={(checked) => toggleReadMutation.mutate(checked as boolean)}
                                className="h-6 w-6"
                            />
                            <label
                                htmlFor="mark-read"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                            >
                                {isCompleted ? "Completed" : "Mark as Read"}
                            </label>
                        </div>
                    ) : (
                        <Button variant="outline" asChild>
                            <Link to="/login">Log in to track progress</Link>
                        </Button>
                    )}
                </div>
            </article>

            <ChatSidebar
                isOpen={chatOpen}
                onToggle={() => setChatOpen(!chatOpen)}
                context={`Current Article: ${article.title}\n\nContent:\n${article.content}`}
            />
        </Layout>
    );
}
