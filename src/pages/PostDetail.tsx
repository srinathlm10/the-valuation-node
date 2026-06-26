import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { communityService } from "@/services/communityService";
import { useAuth } from "@/hooks/useAuth";
import {
    Loader2, MessageSquare, ThumbsUp, User, ArrowLeft, Send,
    Pencil, Trash2, Flag, EyeOff, Eye,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ReportCommentDialog } from "@/components/community/ReportCommentDialog";

export default function PostDetail() {
    const { postId } = useParams<{ postId: string }>();
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const isAdmin = profile?.role === "admin";

    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [reportingId, setReportingId] = useState<string | null>(null);

    const { data: posts = [] } = useQuery({
        queryKey: ["communityPosts"],
        queryFn: communityService.getPosts,
    });

    const post = posts.find(p => p.id === postId);

    const { data: comments = [], isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => communityService.getComments(postId!),
        enabled: !!postId,
    });

    const toggleLikeMutation = useMutation({
        mutationFn: communityService.toggleLike,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["communityPosts"] }),
    });

    const createCommentMutation = useMutation({
        mutationFn: (content: string) => communityService.createComment(postId!, content),
        onSuccess: () => {
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
            toast({ title: "Comment added" });
        },
        onError: () => toast({ title: "Failed to add comment", variant: "destructive" }),
    });

    const updateCommentMutation = useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) =>
            communityService.updateComment(id, content),
        onSuccess: () => {
            setEditingId(null);
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            toast({ title: "Comment updated" });
        },
        onError: () => toast({ title: "Failed to update comment", variant: "destructive" }),
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (id: string) => communityService.deleteComment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
            toast({ title: "Comment deleted" });
        },
        onError: () => toast({ title: "Failed to delete comment", variant: "destructive" }),
    });

    const hideCommentMutation = useMutation({
        mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
            communityService.hideComment(id, hidden),
        onSuccess: (_d, vars) => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            toast({ title: vars.hidden ? "Comment hidden" : "Comment restored" });
        },
        onError: () => toast({ title: "Action failed", variant: "destructive" }),
    });

    const startEdit = (id: string, content: string) => {
        setEditingId(id);
        setEditContent(content);
    };

    if (!post) {
        return (
            <Layout>
                <div className="container py-12 text-center">
                    <h1 className="text-2xl font-bold">Post not found</h1>
                    <Button variant="link" asChild><Link to="/community">Back to Community</Link></Button>
                </div>
            </Layout>
        );
    }

    const slug = `post-${postId}`;

    return (
        <Layout>
            <div className="container max-w-3xl py-12">
                <Button variant="ghost" size="sm" asChild className="mb-6">
                    <Link to="/community">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Forum
                    </Link>
                </Button>

                {/* Post Content */}
                <Card className="mb-8 border-primary/20">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={post.profiles?.avatar_url || ""} />
                                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{post.profiles?.display_name || "Anonymous"}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <Badge variant="secondary">{post.category}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                        <p className="text-muted-foreground whitespace-pre-line">{post.content}</p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex gap-4 text-sm text-muted-foreground">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("gap-1", post.user_has_liked && "text-primary")}
                            onClick={() => toggleLikeMutation.mutate(post.id)}
                        >
                            <ThumbsUp className={cn("h-4 w-4", post.user_has_liked && "fill-current")} />
                            {post.likes_count}
                        </Button>
                        <div className="flex items-center gap-1 px-3">
                            <MessageSquare className="h-4 w-4" />
                            {post.comments_count} Comments
                        </div>
                    </CardFooter>
                </Card>

                {/* Comments Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Discussion</h3>

                    {/* New Comment Input */}
                    {user ? (
                        <div className="flex gap-4 items-start">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="flex-1 gap-2 flex flex-col items-end">
                                <Textarea
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[80px]"
                                />
                                <Button
                                    size="sm"
                                    onClick={() => createCommentMutation.mutate(newComment)}
                                    disabled={!newComment.trim() || createCommentMutation.isPending}
                                >
                                    {createCommentMutation.isPending
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <Send className="h-4 w-4 mr-2" />}
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-muted/30 rounded-lg text-center">
                            <p className="text-sm text-muted-foreground mb-2">Log in to join the discussion.</p>
                            <Button variant="outline" size="sm" asChild><Link to="/login">Log In</Link></Button>
                        </div>
                    )}

                    <Separator />

                    {/* Comments List */}
                    {commentsLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map(comment => {
                                const isOwn = user?.id === comment.user_id;
                                const isEditing = editingId === comment.id;

                                return (
                                    <div
                                        key={comment.id}
                                        className={cn(
                                            "flex gap-4 p-4 rounded-lg bg-card border shadow-sm",
                                            comment.is_hidden && "opacity-60 border-dashed"
                                        )}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={comment.profiles?.avatar_url || ""} />
                                            <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">
                                                        {comment.profiles?.display_name || "Anonymous"}
                                                    </p>
                                                    {comment.is_hidden && isAdmin && (
                                                        <Badge variant="secondary" className="text-xs">Hidden</Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                                    {comment.updated_at && " (edited)"}
                                                </span>
                                            </div>

                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={editContent}
                                                        onChange={e => setEditContent(e.target.value)}
                                                        className="min-h-[70px] text-sm"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateCommentMutation.mutate({ id: comment.id, content: editContent })}
                                                            disabled={!editContent.trim() || updateCommentMutation.isPending}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-foreground/90">{comment.content}</p>
                                            )}

                                            {/* Action buttons */}
                                            {!isEditing && user && (
                                                <div className="flex gap-1 pt-1">
                                                    {isOwn && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                                                onClick={() => startEdit(comment.id, comment.content)}
                                                            >
                                                                <Pencil className="h-3 w-3 mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 px-2 text-xs text-red-400 hover:text-red-300"
                                                                onClick={() => deleteCommentMutation.mutate(comment.id)}
                                                            >
                                                                <Trash2 className="h-3 w-3 mr-1" />
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                    {!isOwn && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                                            onClick={() => setReportingId(comment.id)}
                                                        >
                                                            <Flag className="h-3 w-3 mr-1" />
                                                            Report
                                                        </Button>
                                                    )}
                                                    {isAdmin && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 px-2 text-xs text-amber-400 hover:text-amber-300"
                                                                onClick={() => hideCommentMutation.mutate({ id: comment.id, hidden: !comment.is_hidden })}
                                                            >
                                                                {comment.is_hidden
                                                                    ? <><Eye className="h-3 w-3 mr-1" />Restore</>
                                                                    : <><EyeOff className="h-3 w-3 mr-1" />Hide</>}
                                                            </Button>
                                                            {!isOwn && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-7 px-2 text-xs text-red-400 hover:text-red-300"
                                                                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                                                                >
                                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                                    Delete
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No comments yet.</p>
                    )}
                </div>
            </div>

            {/* Report dialog */}
            {reportingId && (
                <ReportCommentDialog
                    commentId={reportingId}
                    contentSlug={slug}
                    open={!!reportingId}
                    onOpenChange={open => { if (!open) setReportingId(null); }}
                />
            )}
        </Layout>
    );
}
