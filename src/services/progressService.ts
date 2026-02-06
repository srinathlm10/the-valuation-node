import { supabase } from "@/integrations/supabase/client";

export const progressService = {
    // Get all completed article IDs for the current user
    async getUserProgress(): Promise<string[]> {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return [];

        const { data, error } = await supabase
            .from("user_progress")
            .select("content_id")
            .eq("user_id", session.user.id)
            .eq("completed", true);

        if (error) {
            console.error("Error fetching progress:", error);
            return [];
        }

        return data.map((item) => item.content_id);
    },

    // Toggle read status
    async toggleArticleRead(articleId: string, isRead: boolean): Promise<void> {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error("User not authenticated");

        if (isRead) {
            // Mark as read (insert or update)
            const { error } = await supabase
                .from("user_progress")
                .upsert({
                    user_id: session.user.id,
                    content_id: articleId,
                    completed: true,
                    completed_at: new Date().toISOString()
                });

            if (error) throw error;
        } else {
            // Mark as unread (delete row or set completed=false)
            // Deleting is cleaner for "progress"
            const { error } = await supabase
                .from("user_progress")
                .delete()
                .eq("user_id", session.user.id)
                .eq("content_id", articleId);

            if (error) throw error;
        }
    }
};
