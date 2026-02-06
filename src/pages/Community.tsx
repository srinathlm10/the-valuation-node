import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CreatePostDialog } from "@/components/community/CreatePostDialog";
import { communityService } from "@/services/communityService";
import { Loader2, MessageSquare, ThumbsUp, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Community() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState("All");

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['communityPosts'],
        queryFn: communityService.getPosts
    });

    const toggleLikeMutation = useMutation({
        mutationFn: communityService.toggleLike,
        onMutate: async (postId) => {
            // Optimistic Update
            await queryClient.cancelQueries({ queryKey: ['communityPosts'] });
            const previousPosts = queryClient.getQueryData(['communityPosts']);

            queryClient.setQueryData(['communityPosts'], (old: any[]) => {
                return old.map(post => {
                    if (post.id === postId) {
                        const wasLiked = post.user_has_liked;
                        return {
                            ...post,
                            likes_count: wasLiked ? post.likes_count - 1 : post.likes_count + 1,
                            user_has_liked: !wasLiked
                        };
                    }
                    return post;
                });
            });

            return { previousPosts };
        },
        onError: (_err, _newPost, context) => {
            queryClient.setQueryData(['communityPosts'], context?.previousPosts);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
        }
    });

    const filteredPosts = filter === "All"
        ? posts
        : posts.filter(post => post.category === filter);

    const categories = ["All", "General", "Stocks", "Mutual Funds", "Q&A", "News"];

    return (
        <Layout>
            <div className="container py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
                        <p className="text-muted-foreground">Join the discussion with fellow investors.</p>
                    </div>
                    {user && <CreatePostDialog onPostCreated={() => queryClient.invalidateQueries({ queryKey: ['communityPosts'] })} />}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={filter === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Posts Feed */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid gap-6">
                        {filteredPosts.map(post => (
                            <Card key={post.id} className="hover:border-primary/50 transition-colors">
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
                                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                    <p className="text-muted-foreground whitespace-pre-line line-clamp-3">{post.content}</p>
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
                                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                                        <Link to={`/community/${post.id}`}>
                                            <MessageSquare className="h-4 w-4" />
                                            {post.comments_count} Comments
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border rounded-lg bg-muted/20">
                        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                        <p className="text-muted-foreground mb-4">Be the first to start a conversation!</p>
                        {user && <CreatePostDialog onPostCreated={() => queryClient.invalidateQueries({ queryKey: ['communityPosts'] })} />}
                    </div>
                )}
            </div>
        </Layout>
    );
}
