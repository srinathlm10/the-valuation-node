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
    profiles?: {
        display_name: string | null;
        avatar_url: string | null;
    };
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
