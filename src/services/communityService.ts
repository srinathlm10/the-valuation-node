import { supabase } from "@/integrations/supabase/client";

export interface Post {
    id: string;
    user_id: string;
    title: string;
    content: string;
    category: "General" | "Stocks" | "Mutual Funds" | "Q&A" | "News";
    created_at: string;
    profiles?: {
        display_name: string | null;
        avatar_url: string | null;
    };
    likes_count?: number;
    comments_count?: number;
    user_has_liked?: boolean;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at?: string | null;
    is_hidden?: boolean;
    profiles?: {
        display_name: string | null;
        avatar_url: string | null;
    };
}

export interface CommentReport {
    id: string;
    comment_id: string;
    reporter_user_id: string | null;
    reason: string;
    details: string | null;
    status: "pending" | "reviewed" | "dismissed";
    created_at: string;
    reviewed_at: string | null;
    reviewed_by: string | null;
    comments?: {
        id: string;
        content: string;
        is_hidden: boolean;
        post_id: string;
        profiles?: { display_name: string | null } | null;
    } | null;
    profiles?: { display_name: string | null } | null;
}

export const communityService = {
    // Get all posts (with profiles and counts)
    async getPosts() {
        // Note: Supabase doesn't support easy count aggregation in one query without a View or RPC.
        // For now, we'll fetch posts and profiles, and handle 'likes' count via client-side or separate query if needed.
        // To keep it simple, let's just fetch posts + profiles for now. 
        // Real production app would use a view: `posts_view` with counts.

        const { data, error } = await supabase
            .from("posts")
            .select(`
        *,
        profiles (display_name, avatar_url),
        post_likes (count),
        comments (count)
      `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error);
            return [];
        }

        // Map to friendly format
        const { data: { user } } = await supabase.auth.getUser();

        // Need to check if *current user* liked each post.
        // This is inefficient N+1 or requires a better query. 
        // Let's do a separate query for user's likes.
        let userLikes = new Set<string>();
        if (user) {
            const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id);
            likes?.forEach(l => userLikes.add(l.post_id));
        }

        return data.map((post: any) => ({
            ...post,
            likes_count: post.post_likes?.[0]?.count || 0,
            comments_count: post.comments?.[0]?.count || 0,
            user_has_liked: userLikes.has(post.id)
        })) as Post[];
    },

    async createPost(title: string, content: string, category: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from("posts")
            .insert({
                user_id: user.id,
                title,
                content,
                category
            });

        if (error) throw error;
    },

    async getComments(postId: string) {
        const { data, error } = await supabase
            .from("comments")
            .select(`
        *,
        profiles (display_name, avatar_url)
      `)
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error loading comments", error);
            return [];
        }
        return data as Comment[];
    },

    async createComment(postId: string, content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from("comments")
            .insert({
                user_id: user.id,
                post_id: postId,
                content
            });

        if (error) throw error;
    },

    async updateComment(commentId: string, content: string) {
        const { error } = await supabase
            .from("comments")
            .update({ content, updated_at: new Date().toISOString() })
            .eq("id", commentId);
        if (error) throw error;
    },

    async deleteComment(commentId: string) {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);
        if (error) throw error;
    },

    async hideComment(commentId: string, isHidden: boolean) {
        const { error } = await supabase
            .from("comments")
            .update({ is_hidden: isHidden })
            .eq("id", commentId);
        if (error) throw error;
    },

    async adminDeleteComment(commentId: string) {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);
        if (error) throw error;
    },

    async reportComment(commentId: string, reason: string, details?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from("comment_reports")
            .insert({
                comment_id: commentId,
                reporter_user_id: user.id,
                reason,
                details: details ?? null,
            });
        if (error) throw error;
    },

    async getAdminComments() {
        const { data, error } = await supabase
            .from("comments")
            .select("id, post_id, user_id, content, created_at, is_hidden, updated_at, profiles(display_name)")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching admin comments:", error);
            return [];
        }
        return data as Comment[];
    },

    async getAdminReports() {
        const { data, error } = await supabase
            .from("comment_reports")
            .select(`
                id, comment_id, reason, details, status, created_at,
                comments (id, content, is_hidden, post_id, profiles (display_name)),
                profiles!reporter_user_id (display_name)
            `)
            .eq("status", "pending")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching reports:", error);
            return [];
        }
        return data as CommentReport[];
    },

    async resolveReports(commentId: string, status: "reviewed" | "dismissed") {
        const { error } = await supabase
            .from("comment_reports")
            .update({ status, reviewed_at: new Date().toISOString() })
            .eq("comment_id", commentId)
            .eq("status", "pending");
        if (error) throw error;
    },

    async dismissReport(reportId: string) {
        const { error } = await supabase
            .from("comment_reports")
            .update({ status: "dismissed", reviewed_at: new Date().toISOString() })
            .eq("id", reportId);
        if (error) throw error;
    },

    async toggleLike(postId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if liked
        const { data: existing } = await supabase
            .from("post_likes")
            .select("*")
            .eq("post_id", postId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (existing) {
            // Unlike
            await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
        } else {
            // Like
            await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
        }
    }
};
